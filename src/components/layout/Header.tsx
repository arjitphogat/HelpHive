'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
  Menu,
  X,
  MapPin,
  ChevronDown,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Heart,
  MessageSquare,
  PlusCircle,
  Globe,
} from 'lucide-react';

interface City {
  name: string;
  slug: string;
  status: 'live' | 'upcoming';
  count: number;
}

const cities: City[] = [
  { name: 'Goa', slug: 'goa', status: 'live', count: 234 },
  { name: 'Jaipur', slug: 'jaipur', status: 'live', count: 189 },
  { name: 'Rishikesh', slug: 'rishikesh', status: 'live', count: 156 },
  { name: 'Udaipur', slug: 'udaipur', status: 'live', count: 143 },
  { name: 'Delhi', slug: 'delhi', status: 'live', count: 312 },
  { name: 'Manali', slug: 'manali', status: 'upcoming', count: 0 },
  { name: 'Varanasi', slug: 'varanasi', status: 'live', count: 98 },
  { name: 'Pushkar', slug: 'pushkar', status: 'live', count: 87 },
  { name: 'Pondicherry', slug: 'pondicherry', status: 'live', count: 112 },
  { name: 'Mumbai', slug: 'mumbai', status: 'live', count: 267 },
  { name: 'Bangalore', slug: 'bangalore', status: 'upcoming', count: 0 },
  { name: 'Agra', slug: 'agra', status: 'live', count: 145 },
];

export function Header() {
  const { user, logout, role } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const profileRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    router.push('/');
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
    router.push(`/cities/${city.slug}`);
  };

  const liveCities = cities.filter(c => c.status === 'live');
  const upcomingCities = cities.filter(c => c.status === 'upcoming');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white shadow-[var(--shadow-sticky)]'
          : 'bg-white border-b border-[var(--color-border-light)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#FF5722] to-[#FF8A65] shadow-lg">
              <span className="text-white text-xl">🛵</span>
            </div>
            <span className="text-xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Sora, sans-serif' }}>
              HELP<span className="text-[#FF5722]">HIVE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/explore/vehicles" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition">
              Rentals
            </Link>
            <Link href="/hotels" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition">
              Hotels
            </Link>
            <Link href="/travel" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition">
              Travel
            </Link>
            <Link href="/tournament" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition">
              Tournaments
            </Link>
            <Link href="/explore/experiences" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition">
              Experiences
            </Link>
            <Link href="/cities" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition">
              Cities
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* City Selector */}
            <div ref={cityRef} className="relative hidden md:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-[var(--color-surface-muted)] transition"
              >
                <MapPin className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                <span className="text-sm font-medium text-[var(--color-text)]">{selectedCity.name}</span>
                <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
              </button>

              {cityDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCityDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-dropdown)] z-20 overflow-hidden animate-fade-in-scale">
                    <div className="p-3 border-b border-[var(--color-border-light)]">
                      <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">Live Now</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {liveCities.map((city) => (
                        <button
                          key={city.slug}
                          onClick={() => handleCitySelect(city)}
                          className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface-muted)] transition ${
                            selectedCity.slug === city.slug ? 'bg-[var(--color-surface-muted)]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                            <span className="text-sm font-medium text-[var(--color-text)]">{city.name}</span>
                          </div>
                          <span className="text-xs text-[var(--color-text-muted)]">{city.count}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-3 border-t border-[var(--color-border-light)]">
                      <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase">Coming Soon</p>
                    </div>
                    <div className="pb-2">
                      {upcomingCities.map((city) => (
                        <button
                          key={city.slug}
                          onClick={() => handleCitySelect(city)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-surface-muted)] transition"
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                          <span className="text-sm text-[var(--color-text-secondary)]">{city.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Host Button */}
            <button
              onClick={() => router.push('/host/onboarding')}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] rounded-full transition"
            >
              Host your vehicle
            </button>

            {/* Globe */}
            <button className="hidden md:flex items-center gap-1 px-3 py-2 rounded-full hover:bg-[var(--color-surface-muted)] transition">
              <Globe className="h-4 w-4 text-[var(--color-text-secondary)]" />
            </button>

            {user ? (
              <>
                {/* Profile Dropdown */}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-[var(--color-border-light)] hover:shadow-[var(--shadow-card)] transition bg-white"
                  >
                    <Menu className="h-4 w-4 text-[var(--color-text-secondary)]" />
                    <Avatar src={user.photoURL || undefined} fallback={user.displayName?.[0] || 'U'} size="sm" />
                  </button>

                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-dropdown)] z-20 overflow-hidden animate-fade-in-scale">
                        <div className="p-4 border-b border-[var(--color-border-light)]">
                          <p className="font-semibold text-[var(--color-text)]">{user.displayName || 'User'}</p>
                          <p className="text-sm text-[var(--color-text-secondary)]">{user.email}</p>
                        </div>

                        <div className="py-2">
                          <Link href="/dashboard/user" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-muted)] transition" onClick={() => setProfileDropdownOpen(false)}>
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          <Link href="/dashboard/user#saved" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-muted)] transition" onClick={() => setProfileDropdownOpen(false)}>
                            <Heart className="h-4 w-4" />
                            <span>Saved</span>
                          </Link>
                          <Link href="/chat" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-muted)] transition" onClick={() => setProfileDropdownOpen(false)}>
                            <MessageSquare className="h-4 w-4" />
                            <span>Messages</span>
                          </Link>

                          {(role === 'host' || role === 'guide' || role === 'admin') && (
                            <>
                              <div className="my-2 border-t border-[var(--color-border-light)]" />
                              <Link href={role === 'admin' ? '/dashboard/admin' : '/dashboard/host'} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-muted)] transition" onClick={() => setProfileDropdownOpen(false)}>
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                              </Link>
                              {role !== 'admin' && (
                                <Link href="/host/onboarding" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-muted)] transition" onClick={() => setProfileDropdownOpen(false)}>
                                  <PlusCircle className="h-4 w-4" />
                                  <span>List your vehicle</span>
                                </Link>
                              )}
                            </>
                          )}

                          <div className="my-2 border-t border-[var(--color-border-light)]" />
                          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-muted)] transition" onClick={() => setProfileDropdownOpen(false)}>
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-muted)] transition text-left">
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => router.push('/auth/login')} className="px-4 py-2 text-sm font-semibold text-[#1A1A2E] hover:bg-[#F5F5F7] rounded-full transition">
                  Log in
                </button>
                <button onClick={() => router.push('/auth/register')} className="px-4 py-2 text-sm font-semibold text-white rounded-full transition hover:shadow-lg hover:shadow-[#FF5722]/20" style={{ background: 'linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)' }}>
                  Sign up
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-full hover:bg-[var(--color-surface-muted)] transition">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--color-border-light)] animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase mb-2">Select City</p>
              <div className="flex flex-wrap gap-2">
                {cities.slice(0, 6).map((city) => (
                  <button
                    key={city.slug}
                    onClick={() => { setSelectedCity(city); setMobileMenuOpen(false); router.push(`/cities/${city.slug}`); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      selectedCity.slug === city.slug ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-muted)] text-[var(--color-text)]'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${city.status === 'live' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-warning)]'}`} style={selectedCity.slug === city.slug ? { background: 'white' } : {}} />
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--color-border-light)] pt-2" />
            <Link href="/explore/vehicles" className="block px-4 py-3 text-sm font-medium hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">Rentals</Link>
            <Link href="/hotels" className="block px-4 py-3 text-sm font-medium hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">Hotels</Link>
            <Link href="/travel" className="block px-4 py-3 text-sm font-medium hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">Travel</Link>
            <Link href="/tournament" className="block px-4 py-3 text-sm font-medium hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">Tournaments</Link>
            <Link href="/explore/experiences" className="block px-4 py-3 text-sm font-medium hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">Experiences</Link>
            <Link href="/cities" className="block px-4 py-3 text-sm font-medium hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">All Cities</Link>

            <div className="pt-4 border-t border-[var(--color-border-light)] space-y-2">
              {!user ? (
                <>
                  <button onClick={() => { router.push('/auth/login'); setMobileMenuOpen(false); }} className="w-full px-4 py-3 text-sm font-semibold text-[var(--color-text)] bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">Log in</button>
                  <button onClick={() => { router.push('/auth/register'); setMobileMenuOpen(false); }} className="w-full px-4 py-3 text-sm font-semibold text-white rounded-[var(--radius-md)]" style={{ background: 'var(--color-primary)' }}>Sign up</button>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full px-4 py-3 text-sm font-semibold text-left hover:bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">Log out</button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
