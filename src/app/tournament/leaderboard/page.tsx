'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, TrendingUp, Star, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar?: string;
  points: number;
  totalRides: number;
  rating: number;
  onTimePercentage: number;
  badge?: 'gold' | 'silver' | 'bronze';
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'all'>('week');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const data = mockEntries;
        setEntries(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setEntries(mockEntries);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  const mockEntries: LeaderboardEntry[] = [
    { rank: 1, name: 'Rajesh Kumar', points: 2450, totalRides: 156, rating: 4.9, onTimePercentage: 98, badge: 'gold' },
    { rank: 2, name: 'Amit Singh', points: 2280, totalRides: 142, rating: 4.8, onTimePercentage: 95, badge: 'silver' },
    { rank: 3, name: 'Priya Sharma', points: 2150, totalRides: 138, rating: 4.9, onTimePercentage: 97, badge: 'bronze' },
    { rank: 4, name: 'Vikram Patel', points: 1920, totalRides: 125, rating: 4.7, onTimePercentage: 92 },
    { rank: 5, name: 'Sneha Gupta', points: 1850, totalRides: 118, rating: 4.8, onTimePercentage: 94 },
    { rank: 6, name: 'Rahul Verma', points: 1720, totalRides: 110, rating: 4.6, onTimePercentage: 90 },
    { rank: 7, name: 'Neha Kapoor', points: 1650, totalRides: 105, rating: 4.7, onTimePercentage: 93 },
    { rank: 8, name: 'Arun Joshi', points: 1580, totalRides: 98, rating: 4.5, onTimePercentage: 89 },
    { rank: 9, name: 'Meera Reddy', points: 1520, totalRides: 95, rating: 4.6, onTimePercentage: 91 },
    { rank: 10, name: 'Sanjay Rao', points: 1480, totalRides: 92, rating: 4.5, onTimePercentage: 88 },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="font-bold text-[var(--color-text)] w-6 text-center">#{rank}</span>;
  };

  const getBadgeVariant = (badge?: string) => {
    if (badge === 'gold') return 'warning';
    if (badge === 'silver') return 'secondary';
    if (badge === 'bronze') return 'primary';
    return 'default';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-shimmer mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Leaderboard</h1>
          <p className="text-[var(--color-text-muted)] mt-2">Top performers this {activeTab === 'week' ? 'week' : activeTab === 'month' ? 'month' : 'all time'}</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {(['week', 'month', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeTab === tab
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-white text-[var(--color-text-muted)] hover:bg-gray-100'
              )}
            >
              {tab === 'week' ? 'This Week' : tab === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <Card
              key={entry.rank}
              className={cn(
                'p-4 flex items-center gap-4',
                entry.rank <= 3 && 'border-2 border-[var(--color-primary)]'
              )}
            >
              <div className="flex items-center justify-center w-12">
                {getRankIcon(entry.rank)}
              </div>

              <div className="h-12 w-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {entry.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[var(--color-text)]">{entry.name}</h3>
                  {entry.badge && (
                    <Badge variant={getBadgeVariant(entry.badge) as any} size="sm">
                      {entry.badge}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {entry.points} pts
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {entry.totalRides} rides
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-[var(--color-warning)]" />
                    {entry.rating}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-[var(--color-primary)]">#{entry.rank}</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {entry.onTimePercentage}% on-time
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl text-white text-center">
          <h3 className="text-xl font-bold">Weekly Challenges</h3>
          <p className="mt-2 opacity-90">Complete challenges to earn bonus points and climb the leaderboard!</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm opacity-80">King of the Road</p>
              <p className="font-bold">Most rides this week</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm opacity-80">5-Star Streak</p>
              <p className="font-bold">Highest rating</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm opacity-80">Early Bird</p>
              <p className="font-bold">On-time pickups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
