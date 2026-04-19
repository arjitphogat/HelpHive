import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Chat, Message, TemplateType } from '@/types';

export class ChatService {
  static async createChat(
    participants: string[],
    bookingId?: string,
    vehicleId?: string,
    experienceId?: string
  ): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');

    const existingChat = await this.findExistingChat(participants);
    if (existingChat) {
      return existingChat.id;
    }

    const chatData = {
      participants,
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      unreadCount: participants.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}),
      bookingId,
      vehicleId,
      experienceId,
    };

    const docRef = await addDoc(collection(db, 'chats'), chatData);
    return docRef.id;
  }

  static async findExistingChat(participants: string[]): Promise<Chat | null> {
    if (!db) return null;

    const sortedParticipants = [...participants].sort();
    const q = query(
      collection(db, 'chats'),
      where('participants', '==', sortedParticipants)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Chat;
  }

  static async getChat(id: string): Promise<Chat | null> {
    if (!db) return null;

    const chatDoc = await getDoc(doc(db, 'chats', id));
    if (!chatDoc.exists()) return null;
    return { id: chatDoc.id, ...chatDoc.data() } as Chat;
  }

  static async getUserChats(userId: string): Promise<Chat[]> {
    if (!db) return [];

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Chat[];
  }

  static async sendMessage(
    chatId: string,
    senderId: string,
    text: string,
    type: 'text' | 'image' | 'location' = 'text'
  ): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');

    const chat = await this.getChat(chatId);
    if (!chat) throw new Error('Chat not found');

    const messageData = {
      senderId,
      text,
      type,
      readBy: [senderId],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, 'chats', chatId, 'messages'),
      messageData
    );

    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: text,
      lastMessageAt: serverTimestamp(),
    });

    for (const participantId of chat.participants) {
      if (participantId !== senderId) {
        await updateDoc(doc(db, 'chats', chatId), {
          [`unreadCount.${participantId}`]: increment(1),
        });
      }
    }

    return docRef.id;
  }

  static async sendTemplateMessage(
    chatId: string,
    senderId: string,
    templateType: TemplateType
  ): Promise<string> {
    const templates: Record<TemplateType, string> = {
      arrived: "I've arrived at the pickup location!",
      onway: "I'm on my way!",
      help: "I need help with something",
    };

    return this.sendMessage(chatId, senderId, templates[templateType], 'text');
  }

  static async sendLocationMessage(
    chatId: string,
    senderId: string,
    latitude: number,
    longitude: number
  ): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');

    const messageData = {
      senderId,
      text: 'Location shared',
      type: 'location' as const,
      latitude,
      longitude,
      readBy: [senderId],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, 'chats', chatId, 'messages'),
      messageData
    );

    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: 'Location shared',
      lastMessageAt: serverTimestamp(),
    });

    return docRef.id;
  }

  static async sendImageMessage(
    chatId: string,
    senderId: string,
    file: File
  ): Promise<string> {
    if (!db || !storage) throw new Error('Firebase not initialized');

    const storageRef = ref(storage, `chats/${chatId}/${Date.now()}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    const messageData = {
      senderId,
      text: 'Image',
      type: 'image' as const,
      imageUrl,
      readBy: [senderId],
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, 'chats', chatId, 'messages'),
      messageData
    );

    await updateDoc(doc(db, 'chats', chatId), {
      lastMessage: 'Image',
      lastMessageAt: serverTimestamp(),
    });

    return docRef.id;
  }

  static async getMessages(
    chatId: string,
    pageSize: number = 50
  ): Promise<Message[]> {
    if (!db) return [];

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .reverse() as Message[];
  }

  static subscribeToMessages(
    chatId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    if (!db) return () => {};

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      callback(messages);
    });
  }

  static subscribeToChats(
    userId: string,
    callback: (chats: Chat[]) => void
  ): () => void {
    if (!db) return () => {};

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];
      callback(chats);
    });
  }

  static async markAsRead(chatId: string, userId: string): Promise<void> {
    if (!db) return;

    await updateDoc(doc(db, 'chats', chatId), {
      [`unreadCount.${userId}`]: 0,
    });
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const chats = await this.getUserChats(userId);
    return chats.reduce((total, chat) => total + (chat.unreadCount[userId] || 0), 0);
  }
}
