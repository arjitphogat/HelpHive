'use client';

// Force dynamic rendering to avoid SSR issues with Firebase/auth
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { Header, Footer } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Avatar, Input, EmptyState, Skeleton } from '@/components/ui';
import { ChatService } from '@/services/chat.service';
import { AuthService } from '@/services/auth.service';
import { Chat, Message, User } from '@/types';
import { Send, Image, MapPin, MoreVertical, Search } from 'lucide-react';
import { formatDate, getRelativeTime, cn } from '@/lib/utils';

export default function ChatPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      loadOtherUser();
      const unsubscribe = ChatService.subscribeToMessages(selectedChat.id, setMessages);
      return () => unsubscribe();
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChats = async () => {
    try {
      const userChats = await ChatService.getUserChats(user!.uid);
      setChats(userChats);
      if (userChats.length > 0) {
        setSelectedChat(userChats[0]);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const chatMessages = await ChatService.getMessages(chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadOtherUser = async () => {
    if (!selectedChat || !user) return;
    const otherUserId = selectedChat.participants.find((p) => p !== user.uid);
    if (otherUserId) {
      const profile = await AuthService.getUserProfile(otherUserId);
      setOtherUser(profile);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    try {
      await ChatService.sendMessage(selectedChat.id, user.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    return otherUser?.displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Messages</h1>

          <Card padding="none" className="h-[600px] flex overflow-hidden">
            {/* Chat List */}
            <div className={cn(
              'w-full md:w-80 border-r border-gray-100 flex flex-col',
              selectedChat && 'hidden md:flex'
            )}>
              <div className="p-4 border-b border-gray-100">
                <Input
                  placeholder="Search conversations..."
                  leftIcon={<Search className="h-4 w-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="p-4 text-center text-[var(--color-text-muted)]">
                    No conversations yet
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={cn(
                        'w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left',
                        selectedChat?.id === chat.id && 'bg-[var(--color-primary)]/5 border-r-2 border-[var(--color-primary)]'
                      )}
                    >
                      <Avatar size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate">
                            User {chat.participants[0]?.slice(0, 6)}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {chat.lastMessageAt ? getRelativeTime(chat.lastMessageAt.toDate()) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] truncate">
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                      {chat.unreadCount[user?.uid || ''] > 0 && (
                        <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center">
                          {chat.unreadCount[user?.uid || '']}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className={cn(
              'flex-1 flex flex-col',
              !selectedChat && 'hidden md:flex'
            )}>
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      ←
                    </button>
                    <Avatar size="sm" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {otherUser?.displayName || `User ${selectedChat.participants[0]?.slice(0, 6)}`}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        {otherUser?.email}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.uid;
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            'flex',
                            isOwn ? 'justify-end' : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[70%] rounded-2xl px-4 py-2',
                              isOwn
                                ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                                : 'bg-gray-100 text-[var(--color-text)] rounded-bl-md'
                            )}
                          >
                            {message.type === 'location' ? (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">Location shared</span>
                              </div>
                            ) : message.type === 'image' ? (
                              <div className="flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                <span className="text-sm">Image shared</span>
                              </div>
                            ) : (
                              <p className="text-sm">{message.text}</p>
                            )}
                            <div className={cn(
                              'text-xs mt-1',
                              isOwn ? 'text-white/70' : 'text-[var(--color-text-muted)]'
                            )}>
                              {formatDate(message.createdAt.toDate(), { hour: 'numeric', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Replies */}
                  <div className="px-4 py-2 flex gap-2 overflow-x-auto">
                    {['Where are you?', 'On my way!', 'I need help', 'See you soon'].map((reply) => (
                      <button
                        key={reply}
                        onClick={() => setNewMessage(reply)}
                        className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200 whitespace-nowrap"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Image className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MapPin className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyState
                    type="no-messages"
                    title="Select a conversation"
                    description="Choose a chat from the list to start messaging"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
