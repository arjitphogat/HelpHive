'use client';

import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  Hexagon,
  Gift,
  Users,
  Star,
  Trophy,
  Calendar,
  Camera,
  MapPin,
  ChevronRight,
  Flame,
  Crown,
  Zap
} from 'lucide-react';

const earnWays = [
  { icon: Camera, title: 'Share Trip Photos', coins: 50, description: 'Upload & share on social' },
  { icon: Star, title: 'Write a Review', coins: 100, description: 'After completing a booking' },
  { icon: Gift, title: 'First Booking', coins: 200, description: 'On your first rental' },
  { icon: Users, title: 'Invite Friends', coins: 150, description: 'Per successful referral' },
  { icon: Calendar, title: 'Complete Bookings', coins: 25, description: 'Per completed booking' },
  { icon: MapPin, title: 'City Check-ins', coins: 30, description: 'Visit a new city' },
  { icon: Trophy, title: 'Win Tournaments', coins: 500, description: 'Top 3 finish' },
  { icon: Flame, title: 'Daily Streak', coins: 10, description: 'Log in every day' },
];

const redeemOptions = [
  { title: '₹50 Off', coins: 500, popular: false },
  { title: 'Free Upgrade', coins: 750, popular: false },
  { title: '₹100 Off', coins: 1000, popular: true },
  { title: 'Priority Support', coins: 300, popular: false },
  { title: '₹250 Off', coins: 2500, popular: false },
  { title: 'Free Day Rental', coins: 5000, popular: false },
];

const leaderboard = [
  { rank: 1, name: 'Priya S.', city: 'Goa', coins: 15420, avatar: 'PS', badge: 'Crown' },
  { rank: 2, name: 'Rahul M.', city: 'Jaipur', coins: 12350, avatar: 'RM', badge: 'Trophy' },
  { rank: 3, name: 'Aisha K.', city: 'Delhi', coins: 11200, avatar: 'AK', badge: 'Star' },
  { rank: 4, name: 'Vikram R.', city: 'Mumbai', coins: 9850, avatar: 'VR', badge: null },
  { rank: 5, name: 'Sneha P.', city: 'Rishikesh', coins: 9200, avatar: 'SP', badge: null },
];

const levels = [
  { name: 'Newcomer', minCoins: 0, icon: Zap, color: '#B0B0B0' },
  { name: 'Explorer', minCoins: 1000, icon: MapPin, color: '#00A699' },
  { name: 'Adventurer', minCoins: 5000, icon: Star, color: '#0070C5' },
  { name: 'Champion', minCoins: 15000, icon: Trophy, color: '#C45A00' },
  { name: 'Legend', minCoins: 50000, icon: Crown, color: '#FF385C' },
];

export default function RewardsPage() {
  const userCoins = 3250;
  const userLevel = 'Adventurer';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16 lg:pt-[72px]">
        {/* Hero - Coin Balance */}
        <section className="relative bg-gradient-to-br from-[#FF385C] to-[#FF5A5F] py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Coin Balance */}
              <div className="text-white text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Hexagon className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl lg:text-5xl font-bold">{userCoins.toLocaleString()}</p>
                    <p className="text-white/70">Hive Coins</p>
                  </div>
                </div>
                <p className="text-white/70">Worth approximately ₹{Math.floor(userCoins / 10)} in rewards</p>
              </div>

              {/* Level Progress */}
              <div className="bg-white/10 backdrop-blur-sm rounded-[var(--radius-xl)] p-6 min-w-[300px]">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="h-6 w-6 text-[#FFD700]" />
                  <span className="text-white font-semibold">{userLevel} Level</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-white rounded-full" style={{ width: '45%' }} />
                </div>
                <p className="text-sm text-white/70">2,250 coins to next level</p>
              </div>
            </div>
          </div>
        </section>

        {/* Earn Coins */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Earn Hive Coins</h2>
                <p className="text-[var(--color-text-secondary)]">Complete activities to earn more coins</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {earnWays.map((way, index) => (
                <div
                  key={way.title}
                  className="p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)] hover:bg-[var(--color-border-light)] transition-colors cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary-10)] flex items-center justify-center mb-3">
                    <way.icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-1">{way.title}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">{way.description}</p>
                  <div className="flex items-center gap-1">
                    <Hexagon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>+{way.coins}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Redeem */}
        <section className="py-12 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Redeem Rewards</h2>
                <p className="text-[var(--color-text-secondary)]">Use your coins for exclusive benefits</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {redeemOptions.map((option, index) => (
                <div
                  key={option.title}
                  className={`relative p-4 rounded-[var(--radius-xl)] bg-white border ${
                    option.popular ? 'border-[var(--color-primary)]' : 'border-[var(--color-border-light)]'
                  } hover:shadow-lg transition-shadow cursor-pointer animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {option.popular && (
                    <div className="absolute -top-2 left-4 px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs font-semibold rounded-full">
                      Popular
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-[var(--color-text)] mb-1">{option.title}</h3>
                  <div className="flex items-center gap-1">
                    <Hexagon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{option.coins.toLocaleString()}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={userCoins >= option.coins ? 'primary' : 'secondary'}
                    className="w-full mt-3"
                    disabled={userCoins < option.coins}
                  >
                    {userCoins >= option.coins ? 'Redeem' : `Need ${option.coins - userCoins} more`}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Top Explorers</h2>
                <p className="text-[var(--color-text-secondary)]">This month's leaderboard</p>
              </div>
              <Button variant="outline" size="sm">
                View Full Leaderboard <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-[var(--radius-xl)] bg-white border border-[var(--color-border-light)] ${
                    entry.rank <= 3 ? 'border-[var(--color-warning)]' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1 ? 'bg-[#FFD700] text-white' :
                    entry.rank === 2 ? 'bg-[#C0C0C0] text-white' :
                    entry.rank === 3 ? 'bg-[#CD7F32] text-white' :
                    'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]'
                  }`}>
                    {entry.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>
                    {entry.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--color-text)]">{entry.name}</span>
                      {entry.badge === 'Crown' && <Crown className="h-4 w-4 text-[#FFD700]" />}
                      {entry.badge === 'Trophy' && <Trophy className="h-4 w-4 text-[#C45A00]" />}
                      {entry.badge === 'Star' && <Star className="h-4 w-4 text-[var(--color-primary)]" />}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">{entry.city}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Hexagon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    <span className="font-bold text-[var(--color-text)]">{entry.coins.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Levels */}
        <section className="py-12 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-8 text-center">
              Explorer Levels
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              {levels.map((level) => (
                <div
                  key={level.name}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full border-2 ${
                    level.name === userLevel
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-10)]'
                      : 'border-[var(--color-border-light)] bg-white'
                  }`}
                >
                  <level.icon className="h-5 w-5" style={{ color: level.color }} />
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{level.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{level.minCoins.toLocaleString()}+ coins</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8">
              Complete your first booking to earn your first Hive Coins!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore/vehicles">
                <Button size="lg">Book Your First Ride</Button>
              </Link>
              <Link href="/pass">
                <Button size="lg" variant="outline">Get 2x Multiplier</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
