'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { Trophy, Medal, Calendar, Users, Gift, MapPin, Clock, ChevronRight, TrendingUp, Star, Zap, X, Loader2, Check } from 'lucide-react';

const activeTournaments = [
  {
    id: 'beach-run-2024',
    title: 'Community Help Challenge',
    city: 'Mumbai',
    prize: '₹25,000',
    participants: 89,
    daysLeft: 3,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',
    badge: '🔥 Hot',
    status: 'live',
    type: 'Service Challenge',
    description: 'Help the most community members this month',
    rules: ['Complete 10 help requests', 'Get positive reviews', 'Share your journey'],
    rewards: ['1st: ₹10,000', '2nd: ₹5,000', '3rd: ₹2,500', 'All: Hive Coins'],
  },
  {
    id: 'heritage-trail-2024',
    title: 'Local Guide Master',
    city: 'Jaipur',
    prize: '₹30,000',
    participants: 124,
    daysLeft: 5,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=500&fit=crop',
    badge: '🎉 New',
    status: 'live',
    type: 'Tours',
    description: 'Guide tourists through the Pink City',
    rules: ['Complete 15 tours', 'Collect reviews', 'Share stories'],
    rewards: ['1st: ₹15,000', '2nd: ₹8,000', '3rd: ₹4,000', 'Bonus: Guide Badge'],
  },
  {
    id: 'mountain-explorer-2024',
    title: 'Tech Support Champion',
    city: 'Bangalore',
    prize: '₹40,000',
    participants: 67,
    daysLeft: 12,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop',
    badge: '⛰️ Tech',
    status: 'upcoming',
    type: 'Support',
    description: 'Help others with tech issues and problems',
    rules: ['Solve 20 tech issues', 'Video check-ins', 'Expert support'],
    rewards: ['1st: ₹20,000', '2nd: ₹10,000', '3rd: ₹5,000', 'Top 10: Badges'],
  },
  {
    id: 'sunset-challenge-2024',
    title: 'Cleaning Queen/King',
    city: 'Delhi',
    prize: '₹15,000',
    participants: 56,
    daysLeft: 7,
    image: 'https://images.unsplash.com/photo-1581578731548-c64649cc085f?w=800&h=500&fit=crop',
    badge: '🌟 Popular',
    status: 'live',
    type: 'Home Help',
    description: 'Provide the best cleaning services',
    rules: ['Best service photos', 'Most clients', '5-star reviews'],
    rewards: ['1st: ₹5,000', '2nd: ₹3,000', '3rd: ₹2,000', 'Top 20: 500 Hive Coins'],
  },
  {
    id: 'food-trail-2024',
    title: 'Tutoring Excellence',
    city: 'Pune',
    prize: '₹35,000',
    participants: 156,
    daysLeft: 2,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop',
    badge: '📚 Must Join',
    status: 'live',
    type: 'Education',
    description: 'Help students excel in their studies',
    rules: ['Help 10 students', 'Track progress', 'Best results'],
    rewards: ['1st: ₹15,000', '2nd: ₹8,000', '3rd: ₹5,000', 'All: Tutor Badge'],
  },
  {
    id: 'delivery-league-2024',
    title: 'Delivery Hero',
    city: 'Hyderabad',
    prize: '₹20,000',
    participants: 45,
    daysLeft: 14,
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=500&fit=crop',
    badge: '🚚 Fast',
    status: 'upcoming',
    type: 'Delivery',
    description: 'Complete deliveries with 5-star ratings',
    rules: ['Complete 50 deliveries', '100% rating', 'On-time'],
    rewards: ['1st: ₹8,000', '2nd: ₹5,000', '3rd: ₹3,000', 'Safety Badge'],
  },
];

const leaderboard = [
  { rank: 1, name: 'Priya S.', city: 'Mumbai', points: 2450, rides: 89, avatar: 'PS', badge: 'Crown', trend: '+120' },
  { rank: 2, name: 'Rahul M.', city: 'Jaipur', points: 2180, rides: 76, avatar: 'RM', badge: 'Trophy', trend: '+95' },
  { rank: 3, name: 'Aisha K.', city: 'Delhi', points: 1950, rides: 67, avatar: 'AK', badge: 'Star', trend: '+80' },
  { rank: 4, name: 'Vikram R.', city: 'Bangalore', points: 1820, rides: 58, avatar: 'VR', badge: null, trend: '+65' },
  { rank: 5, name: 'Sneha P.', city: 'Pune', points: 1690, rides: 52, avatar: 'SP', badge: null, trend: '+45' },
  { rank: 6, name: 'Arjun N.', city: 'Hyderabad', points: 1580, rides: 48, avatar: 'AN', badge: null, trend: '+30' },
  { rank: 7, name: 'Meera K.', city: 'Mumbai', points: 1420, rides: 41, avatar: 'MK', badge: null, trend: '+25' },
  { rank: 8, name: 'Ravi S.', city: 'Delhi', points: 1350, rides: 38, avatar: 'RS', badge: null, trend: '+15' },
];

const pastWinners = [
  { name: 'Carlos D.', city: 'Mumbai', tournament: 'Help Champion S1', prize: '₹10,000', avatar: 'CD', date: 'Mar 2024' },
  { name: 'Priya N.', city: 'Jaipur', tournament: 'Local Guide', prize: '₹15,000', avatar: 'PN', date: 'Feb 2024' },
  { name: 'Amit K.', city: 'Delhi', tournament: 'Tech Support Cup', prize: '₹12,000', avatar: 'AK', date: 'Jan 2024' },
];

interface JoinFormData {
  displayName: string;
  email: string;
  phone: string;
  city: string;
  serviceType: string;
}

export default function TournamentPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'leaderboard'>('active');
  const [showJoinModal, setShowJoinModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState<JoinFormData>({
    displayName: '',
    email: '',
    phone: '',
    city: '',
    serviceType: 'repairs',
  });

  const filteredTournaments = activeTournaments.filter(t => {
    if (activeTab === 'active') return t.status === 'live';
    if (activeTab === 'upcoming') return t.status === 'upcoming';
    return true;
  });

  const handleJoinTournament = async (tournamentId: string) => {
    if (!formData.displayName || !formData.email || !formData.phone || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/tournaments/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId,
          uid: `user_${Date.now()}`,
          displayName: formData.displayName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          vehicleType: formData.serviceType,
          termsAccepted: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Successfully registered! Check your email for confirmation.');
        setTimeout(() => {
          setShowJoinModal(null);
          setSuccessMessage('');
          setFormData({
            displayName: '',
            email: '',
            phone: '',
            city: '',
            serviceType: 'repairs',
          });
        }, 3000);
      } else {
        alert(data.error || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTournament = activeTournaments.find(t => t.id === showJoinModal);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16 lg:pt-[72px]">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#FF385C] to-[#FF5A5F] py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-white text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                  <Trophy className="h-8 w-8" />
                  <h1 className="text-3xl lg:text-5xl font-bold">Tournaments</h1>
                </div>
                <p className="text-lg text-white/80 max-w-xl">
                  Compete with helpers across India. Win prizes, earn Hive Coins, and climb the leaderboard!
                </p>
              </div>

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
            {activeTab !== 'leaderboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament, index) => (
                  <div
                    key={tournament.id}
                    className="card animate-fade-in-up group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative aspect-[16/10] img-zoom">
                      <img
                        src={tournament.image}
                        alt={tournament.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                          {tournament.badge}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tournament.status === 'live'
                            ? 'bg-[var(--color-success)] text-white'
                            : 'bg-[var(--color-warning)] text-white'
                        }`}>
                          {tournament.status === 'live' ? '● Live' : '⏳ Soon'}
                        </span>
                      </div>

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

                    <div className="p-4">
                      <p className="text-sm text-[var(--color-text-secondary)] mb-4">{tournament.description}</p>

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

                      <Button
                        onClick={() => setShowJoinModal(tournament.id)}
                        className="w-full"
                      >
                        {tournament.status === 'live' ? 'Join Tournament' : 'Notify Me'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="max-w-4xl mx-auto">
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
                        <p className="text-sm text-[var(--color-text-secondary)]">{entry.city} • {entry.rides} helps</p>
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
                { icon: Zap, title: 'Earn Points', desc: 'Complete challenges & helps' },
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

      {/* Join Tournament Modal */}
      {showJoinModal && selectedTournament && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[var(--radius-xl)] max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[var(--color-text)]">Join {selectedTournament.title}</h2>
                <button
                  onClick={() => setShowJoinModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {successMessage ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                    <Check className="h-8 w-8 text-[var(--color-success)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">Registration Complete!</h3>
                  <p className="text-[var(--color-text-secondary)]">{successMessage}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-[var(--color-surface-muted)] rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="h-5 w-5 text-[var(--color-primary)]" />
                      <span className="font-semibold">{selectedTournament.prize} Prize Pool</span>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">{selectedTournament.description}</p>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      required
                    />
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter your city"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                        Service Type
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="repairs">Repairs & Maintenance</option>
                        <option value="cleaning">Cleaning Services</option>
                        <option value="tutoring">Tutoring & Education</option>
                        <option value="delivery">Delivery & Logistics</option>
                        <option value="tech">Tech Support</option>
                        <option value="other">Other Services</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowJoinModal(null)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleJoinTournament(selectedTournament.id)}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Join Now'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-border-light)] md:hidden z-40">
        <Link href="/tournament" className="block w-full py-3 bg-[var(--color-primary)] text-white text-center rounded-[var(--radius-md)] font-semibold">
          Join a Tournament
        </Link>
      </div>
    </div>
  );
}
