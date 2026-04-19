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
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db, getDb } from '@/lib/firebase';
import {
  Tournament,
  Challenge,
  LeaderboardEntry,
  TournamentReward,
  ChallengeMetric,
} from '@/types';

export class TournamentService {
  static async createTournament(data: {
    name: string;
    description: string;
    type: 'weekly' | 'monthly' | 'special';
    startDate: Date;
    endDate: Date;
    challenges: Omit<Challenge, 'id'>[];
    rewards: {
      bronze: TournamentReward;
      silver: TournamentReward;
      gold: TournamentReward;
    };
  }): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');

    const challenges = data.challenges.map((c, i) => ({
      ...c,
      id: `challenge_${i + 1}`,
    }));

    const tournamentData = {
      ...data,
      challenges,
      status: 'upcoming' as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(getDb(), 'tournaments'), tournamentData);
    return docRef.id;
  }

  static async getTournament(id: string): Promise<Tournament | null> {
    if (!db) return null;

    const tournamentDoc = await getDoc(doc(db, 'tournaments', id));
    if (!tournamentDoc.exists()) return null;
    return { id: tournamentDoc.id, ...tournamentDoc.data() } as Tournament;
  }

  static async getActiveTournament(): Promise<Tournament | null> {
    if (!db) return null;

    const q = query(
      collection(db, 'tournaments'),
      where('status', '==', 'active'),
      orderBy('startDate', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Tournament;
  }

  static async getTournaments(): Promise<Tournament[]> {
    if (!db) return [];

    const q = query(
      collection(db, 'tournaments'),
      orderBy('startDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Tournament[];
  }

  static async updateTournamentStatus(
    id: string,
    status: 'upcoming' | 'active' | 'completed'
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    await updateDoc(doc(db, 'tournaments', id), {
      status,
      updatedAt: serverTimestamp(),
    });
  }

  static async getLeaderboard(
    tournamentId: string,
    pageSize: number = 20
  ): Promise<LeaderboardEntry[]> {
    if (!db) return [];

    const q = query(
      collection(db, 'tournaments', tournamentId, 'leaderboard'),
      orderBy('rank', 'asc'),
      limit(pageSize)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      odinal: doc.id,
      ...doc.data(),
    })) as LeaderboardEntry[];
  }

  static async getUserRank(
    odinal: string,
    tournamentId: string
  ): Promise<number | null> {
    if (!db) return null;

    const q = query(
      collection(db, 'tournaments', tournamentId, 'leaderboard'),
      where('odinal', '==', odinal)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data().rank;
  }

  static async updateUserMetrics(
    odinal: string,
    tournamentId: string,
    metrics: {
      totalRides?: number;
      averageRating?: number;
      onTimePercentage?: number;
      distanceCovered?: number;
    }
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const leaderboardRef = doc(
      db,
      'tournaments',
      tournamentId,
      'leaderboard',
      odinal
    );

    const updateData: Record<string, any> = {};
    if (metrics.totalRides !== undefined) {
      updateData['metrics.totalRides'] = increment(metrics.totalRides);
    }
    if (metrics.averageRating !== undefined) {
      updateData['metrics.averageRating'] = metrics.averageRating;
    }
    if (metrics.onTimePercentage !== undefined) {
      updateData['metrics.onTimePercentage'] = metrics.onTimePercentage;
    }
    if (metrics.distanceCovered !== undefined) {
      updateData['metrics.distanceCovered'] = increment(metrics.distanceCovered);
    }

    await updateDoc(leaderboardRef, updateData);
  }

  static calculatePoints(metrics: LeaderboardEntry['metrics']): number {
    const ridePoints = metrics.totalRides * 10;
    const ratingPoints = metrics.averageRating * 20;
    const onTimePoints = metrics.onTimePercentage * 0.5;
    const distancePoints = metrics.distanceCovered * 0.1;

    return Math.round(ridePoints + ratingPoints + onTimePoints + distancePoints);
  }

  static async recalculateLeaderboard(tournamentId: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const leaderboard = await this.getLeaderboard(tournamentId, 100);

    const sorted = leaderboard.sort((a, b) => {
      const pointsA = this.calculatePoints(a.metrics);
      const pointsB = this.calculatePoints(b.metrics);
      return pointsB - pointsA;
    });

    for (let i = 0; i < sorted.length; i++) {
      await updateDoc(
        doc(db, 'tournaments', tournamentId, 'leaderboard', sorted[i].odinal),
        { rank: i + 1, points: this.calculatePoints(sorted[i].metrics) }
      );
    }
  }

  static async awardBadges(tournamentId: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const leaderboard = await this.getLeaderboard(tournamentId, 3);

    const badges = ['gold', 'silver', 'bronze'];
    for (let i = 0; i < leaderboard.length; i++) {
      await updateDoc(
        doc(db, 'users', leaderboard[i].odinal),
        {
          [`tournamentBadges.${tournamentId}`]: badges[i],
          'stats.tournamentPoints': increment(
            this.calculatePoints(leaderboard[i].metrics)
          ),
        }
      );
    }
  }

  static getChallengeProgress(
    challenge: Challenge,
    metrics: LeaderboardEntry['metrics']
  ): number {
    const currentValue = {
      rides: metrics.totalRides,
      rating: metrics.averageRating,
      onTime: metrics.onTimePercentage,
      distance: metrics.distanceCovered,
    }[challenge.metric];

    return Math.min((currentValue / challenge.target) * 100, 100);
  }
}
