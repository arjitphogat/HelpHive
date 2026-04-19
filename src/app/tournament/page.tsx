'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Trophy, Medal, Calendar, Users, Gift, MapPin, Clock, ChevronRight, TrendingUp, Star, Zap } from 'lucide-react';

// Test data for tournaments
const activeTournaments = [
  {
    id: 1,
    title: 'Beach Run Championship',
    city: 'Goa',
    prize: '₹25,000',
    participants: 89,
    daysLeft: 3,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    badge: '🔥 Hot',
    status: 'live',
    type: 'Speed Challenge',
    description: 'Race along the beautiful beaches of North Goa',
    rules: ['Complete 10 beach checkpoints', '拍照打卡', 'Share your journey'],
    rewards: ['1st: ₹10,000', '2nd: ₹5,000', '3rd: ₹2,500', 'All participants: Hive Coins'],
  },
  {
    id: 2,
    title: 'Heritage Trail Challenge',
    city: 'Jaipur',
    prize: '₹30,000',
    participants: 124,
    daysLeft: 5,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=500&fit=crop',
    badge: '🎉 New',
    status: 'live',
    type: 'Exploration',
    description: 'Discover the hidden gems of the Pink City',
    rules: ['Visit 15 heritage sites', 'Collect stamps', 'Share stories'],
    rewards: ['1st: ₹15,000', '2nd: ₹8,000', '3rd: ₹4,000', 'Bonus: Heritage Badge'],
  },
  {
    id: 3,
    title: 'Mountain Explorer Cup',
    city: 'Manali',
    prize: '₹40,000',
    participants: 67,
    daysLeft: 12,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=500&fit=crop',
    badge: '⛰️ Adventure',
    status: 'upcoming',
    type: 'Endurance',
    description: 'Conquer the mountain passes and scenic routes',
    rules: ['Complete 200km route', 'Photo checkpoints', 'Safe driving'],
    rewards: ['1st: ₹20,000', '2nd: ₹10,000', '3rd: ₹5,000', 'Top 10: Free upgrades'],
  },
  {
    id: 4,
    title: 'Sunset Ride Challenge',
    city: 'Pondicherry',
    prize: '₹15,000',
    participants: 56,
    daysLeft: 7,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=500&fit=crop',
    badge: '🌅 Popular',
    status: 'live',
    type: 'Photo Challenge',
    description: 'Capture the most stunning sunset moments',
    rules: ['Best sunset photos', 'Most likes', 'Creative content'],
    rewards: ['1st: ₹5,000', '2nd: ₹3,000', '3rd: ₹2,000', 'Top 20: 500 Hive Coins'],
  },
  {
    id: 5,
    title: 'Food Trail Championship',
    city: 'Delhi',
    prize: '₹35,000',
    participants: 156,
    daysLeft: 2,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=500&fit=crop',
    badge: '🍛 Must Join',
    status: 'live',
    type: 'Food Trail',
    description: 'Explore the best street food in Old Delhi',
    rules: ['Visit 10 food spots', 'Review each place', 'Best vlog wins'],
    rewards: ['1st: ₹15,000', '2nd: ₹8,000', '3rd: ₹5,000', 'All: Food Explorer Badge'],
  },
  {
    id: 6,
    title: 'River Rafting League',
    city: 'Rishikesh',
    prize: '₹20,000',
    participants: 45,
    daysLeft: 14,
    image: 'https://images.unsplash.com/photo-1600100195362-63369f3d0e5a?w=800&h=500&fit=crop',
    badge: '🏄 Thrilling',
    status: 'upcoming',
    type: 'Adventure',
    description: 'The ultimate river adventure tournament',
    rules: ['Complete 5 rapids', 'Safety first', 'Team or solo'],
    rewards: ['1st: ₹8,000', '2nd: ₹5,000', '3rd: ₹3,000', 'Safety Badge'],
  },
];

const leaderboard = [
  { rank: 1, name: 'Priya S.', city: 'Goa', points: 2450, rides: 89, avatar: 'PS', badge: 'Crown', trend: '+120' },
  { rank: 2, name: 'Rahul M.', city: 'Jaipur', points: 2180, rides: 76, avatar: 'RM', badge: 'Trophy', trend: '+95' },
  { rank: 3, name: 'Aisha K.', city: 'Delhi', points: 1950, rides: 67, avatar: 'AK', badge: 'Star', trend: '+80' },
  { rank: 4, name: 'Vikram R.', city: 'Mumbai', points: 1820, rides: 58, avatar: 'VR', badge: null, trend: '+65' },
  { rank: 5, name: 'Sneha P.', city: 'Rishikesh', points: 1690, rides: 52, avatar: 'SP', badge: null, trend: '+45' },
  { rank: 6, name: 'Arjun N.', city: 'Goa', points: 1580, rides: 48, avatar: 'AN', badge: null, trend: '+30' },
  { rank: 7, name: 'Meera K.', city: 'Jaipur', points: 1420, rides: 41, avatar: 'MK', badge: null, trend: '+25' },
  { rank: 8, name: 'Ravi S.', city: 'Delhi', points: 1350, rides: 38, avatar: 'RS', badge: null, trend: '+15' },
];

const pastWinners = [
  { name: 'Carlos D.', city: 'Goa', tournament: 'Beach Run S1', prize: '₹10,000', avatar: 'CD', date: 'Mar 2024' },
  { name: 'Priya N.', city: 'Jaipur', tournament: 'Heritage Trail', prize: '₹15,000', avatar: 'PN', date: 'Feb 2024' },
  { name: 'Amit K.', city: 'Delhi', tournament: 'Food Trail Cup', prize: '₹12,000', avatar: 'AK', date: 'Jan 2024' },
];

export default function TournamentPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'leaderboard'>('active');
  const [showJoinModal, setShowJoinModal] = useState<number | null>(null);

  const filteredTournaments = activeTournaments.filter(t => {
    if (activeTab === 'active') return t.status === 'live';
    if (activeTab === 'upcoming') return t.status === 'upcoming';
    return true;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16 lg:pt-[72px]">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#FF385C] to-[#FF5A5F] py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Content */}
              <div className="text-white text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <Trophy className="h-8 w-8" />
                  <h1 className="text-3xl lg:text-5xl font-bold">Tournaments</h1>
                </div>
                <p className="text-lg text-white/80 max-w-xl">
                  Compete with riders across India. Win prizes, earn Hive Coins, and climb the leaderboard!
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">₹10L+</p>
                  <p className="text-sm text-white/70">Prize Pool</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-sm text-white/70">Active Players</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-sm text-white/70">Events</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="border-b border-[var(--color-border-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {[
                { id: 'active', label: 'Active', count: activeTournaments.filter(t => t.status === 'live').length },
                { id: 'upcoming', label: 'Upcoming', count: activeTournaments.filter(t => t.status === 'upcoming').length },
                { id: 'leaderboard', label: 'Leaderboard', count: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--color-surface-muted)]">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tournament Cards */}
            {activeTab !== 'leaderboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament, index) => (
                  <div
                    key={tournament.id}
                    className="card animate-fade-in-up group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] img-zoom">
                      <img
                        src={tournament.image}
                        alt={tournament.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                          {tournament.badge}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tournament.status === 'live'
                            ? 'bg-[var(--color-success)] text-white'
                            : 'bg-[var(--color-warning)] text-white'
                        }`}>
                          {tournament.status === 'live' ? '● Live' : '⏳ Soon'}
                        </span>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold text-white mb-1">{tournament.title}</h3>
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {tournament.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tournament.daysLeft} days left
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{tournament.description}</p>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--color-border-light)]">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Gift className="h-4 w-4 text-[var(--color-primary)]" />
                            <span className="font-semibold">{tournament.prize}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                            <Users className="h-4 w-4" />
                            <span>{tournament.participants}</span>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-[var(--color-surface-muted)] rounded text-xs font-medium">
                          {tournament.type}
                        </span>
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => setShowJoinModal(tournament.id)}
                        className="w-full py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-semibold text-sm hover:opacity-90 transition"
                      >
                        {tournament.status === 'live' ? 'Join Tournament' : 'Notify Me'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="max-w-4xl mx-auto">
                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[1, 0, 2].map((index) => {
                    const entry = leaderboard[index];
                    if (!entry) return null;
                    return (
                      <div
                        key={entry.rank}
                        className={`relative text-center p-6 rounded-[var(--radius-xl)] ${
                          entry.rank === 1
                            ? 'bg-gradient-to-b from-[#FFD700]/20 to-transparent order-2 -mt-4'
                            : entry.rank === 2
                            ? 'bg-gradient-to-b from-[#C0C0C0]/20 to-transparent'
                            : 'bg-gradient-to-b from-[#CD7F32]/20 to-transparent'
                        }`}
                      >
                        {/* Avatar with Badge */}
                        <div className="relative inline-block mb-3">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${
                            entry.rank === 1
                              ? 'bg-[#FFD700] text-white'
                              : entry.rank === 2
                              ? 'bg-[#C0C0C0] text-white'
                              : 'bg-[#CD7F32] text-white'
                          }`}>
                            {entry.avatar}
                          </div>
                          {entry.badge === 'Crown' && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl">👑</span>
                          )}
                        </div>

                        <p className="font-semibold text-[var(--color-text)] mb-1">{entry.name}</p>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-2">{entry.city}</p>
                        <p className="text-2xl font-bold text-[var(--color-primary)]">{entry.points.toLocaleString()}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">points</p>
                      </div>
                    );
                  })}
                </div>

                {/* Rest of Leaderboard */}
                <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--color-border-light)] overflow-hidden">
                  {leaderboard.slice(3).map((entry, index) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-4 p-4 hover:bg-[var(--color-surface-muted)] transition ${
                        index !== leaderboard.slice(3).length - 1 ? 'border-b border-[var(--color-border-light)]' : ''
                      }`}
                    >
                      <div className="w-8 text-center font-bold text-[var(--color-text-secondary)]">
                        #{entry.rank}
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--color-primary)' }}>
                        {entry.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[var(--color-text)]">{entry.name}</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">{entry.city} • {entry.rides} rides</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-[var(--color-text)]">{entry.points.toLocaleString()}</p>
                          <p className="text-xs text-[var(--color-success)] flex items-center justify-end gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {entry.trend}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Past Winners */}
        <section className="py-8 lg:py-12 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Hall of Fame</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastWinners.map((winner, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-[var(--radius-lg)]"
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'var(--color-primary)' }}>
                    {winner.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--color-text)]">{winner.name}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{winner.tournament}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{winner.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--color-success)]">{winner.prize}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Won</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rewards Info */}
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">How Rewards Work</h2>
              <p className="text-[var(--color-text-secondary)]">Climb the ranks, earn coins, unlock exclusive perks</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Zap, title: 'Earn Points', desc: 'Complete challenges & rides' },
                { icon: Medal, title: 'Win Prizes', desc: 'Cash & Hive Coins' },
                { icon: Star, title: 'Unlock Badges', desc: 'Exclusive profile badges' },
                { icon: Trophy, title: 'Get Featured', desc: 'Top players highlighted' },
              ].map((item, index) => (
                <div key={index} className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary-10)' }}>
                    <item.icon className="h-6 w-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-border-light)] md:hidden z-40">
        <Link href="/tournament" className="block w-full py-3 bg-[var(--color-primary)] text-white text-center rounded-[var(--radius-md)] font-semibold">
          Join a Tournament
        </Link>
      </div>
    </div>
  );
}
