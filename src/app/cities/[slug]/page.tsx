'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Button, Badge } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  ChevronRight,
  Shield,
  Clock,
  Award,
  Trophy,
  Sun,
  ThermometerSun,
  Wind,
  Hotel,
  Train,
  Plane,
  Bus,
  Utensils,
  Camera,
  Palmtree,
  Mountain,
  Building2,
  Waves,
  Church,
  Castle,
  Sunrise,
  Coffee,
  Navigation,
  CheckCircle,
  ArrowRight,
  Filter,
  SlidersHorizontal
} from 'lucide-react';

// Sample Hotels Data
const hotelsByCity: Record<string, any[]> = {
  goa: [
    { id: 'hg-1', name: 'Taj Exotica Resort', location: 'Benaulim Beach', rating: 4.9, price: 12500, image: 'https://picsum.photos/seed/goahotel1/800/500', type: 'Luxury Resort', amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant'] },
    { id: 'hg-2', name: 'Marriott Suites Goa', location: 'Miramar Beach', rating: 4.7, price: 8500, image: 'https://picsum.photos/seed/goahotel2/800/500', type: '5 Star Hotel', amenities: ['Pool', 'Gym', 'Restaurant', 'Bar'] },
    { id: 'hg-3', name: 'Alila Diwa Goa', location: 'Majorda', rating: 4.8, price: 9500, image: 'https://picsum.photos/seed/goahotel3/800/500', type: 'Boutique Resort', amenities: ['Pool', 'Spa', 'Yoga', 'Beach'] },
    { id: 'hg-4', name: 'Hilton Goa Resort', location: 'Candolim', rating: 4.6, price: 7800, image: 'https://picsum.photos/seed/goahotel4/800/500', type: 'Resort', amenities: ['Pool', 'Gym', 'Kids Club', 'Restaurant'] },
  ],
  jaipur: [
    { id: 'hj-1', name: 'Taj Jai Mahal Palace', location: 'MI Road', rating: 4.9, price: 15000, image: 'https://picsum.photos/seed/jaipurhotel1/800/500', type: 'Heritage Palace', amenities: ['Pool', 'Spa', 'Heritage Tours', 'Restaurant'] },
    { id: 'hj-2', name: 'Marriott Jaipur', location: 'Ashram Road', rating: 4.7, price: 8500, image: 'https://picsum.photos/seed/jaipurhotel2/800/500', type: 'Business Hotel', amenities: ['Gym', 'Restaurant', 'Business Center'] },
    { id: 'hj-3', name: 'Raj Palace Hotel', location: 'Amer Road', rating: 4.8, price: 12000, image: 'https://picsum.photos/seed/jaipurhotel3/800/500', type: 'Heritage Hotel', amenities: ['Pool', 'Spa', 'Fort View', 'Restaurant'] },
  ],
  delhi: [
    { id: 'hd-1', name: 'The Leela Palace', location: 'Aerocity', rating: 4.9, price: 18000, image: 'https://picsum.photos/seed/delhiotel1/800/500', type: 'Luxury Hotel', amenities: ['Pool', 'Spa', 'Rooftop Restaurant', 'Airport Shuttle'] },
    { id: 'hd-2', name: 'Taj Palace Delhi', location: 'Diplomatic Enclave', rating: 4.8, price: 14000, image: 'https://picsum.photos/seed/delhiotel2/800/500', type: '5 Star Hotel', amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'] },
    { id: 'hd-3', name: 'The Imperial', location: 'Janpath', rating: 4.7, price: 11000, image: 'https://picsum.photos/seed/delhiotel3/800/500', type: 'Heritage Hotel', amenities: ['Heritage Tours', 'Restaurant', 'Bar', 'Gym'] },
    { id: 'hd-4', name: 'ITC Maurya', location: 'Chanakyapuri', rating: 4.6, price: 9500, image: 'https://picsum.photos/seed/delhiotel4/800/500', type: 'Business Hotel', amenities: ['Gym', 'Multiple Restaurants', 'Spa'] },
  ],
  mumbai: [
    { id: 'hm-1', name: 'The Taj Mahal Palace', location: 'Colaba', rating: 4.9, price: 25000, image: 'https://picsum.photos/seed/mumbaiotel1/800/500', type: 'Iconic Hotel', amenities: ['Sea View', 'Spa', 'Multiple Restaurants', 'Heritage Tours'] },
    { id: 'hm-2', name: 'The St. Regis Mumbai', location: 'Lower Parel', rating: 4.8, price: 18000, image: 'https://picsum.photos/seed/mumbaiotel2/800/500', type: 'Luxury Hotel', amenities: ['Pool', 'Spa', 'Butler Service', 'Bar'] },
    { id: 'hm-3', name: 'Marriott Mumbai Juhu', location: 'Juhu Beach', rating: 4.7, price: 12000, image: 'https://picsum.photos/seed/mumbaiotel3/800/500', type: 'Beach Resort', amenities: ['Beach Access', 'Pool', 'Restaurant', 'Kids Club'] },
  ],
  bangalore: [
    { id: 'hb-1', name: 'The Leela Palace Bangalore', location: 'OLD Airport Road', rating: 4.9, price: 16000, image: 'https://picsum.photos/seed/bangaloreotel1/800/500', type: 'Luxury Hotel', amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'Garden'] },
    { id: 'hb-2', name: 'ITC Gardenia', location: ' Residency Road', rating: 4.8, price: 10000, image: 'https://picsum.photos/seed/bangaloreotel2/800/500', type: 'Premium Hotel', amenities: ['Pool', 'Gym', 'Restaurant', 'Spa'] },
  ],
  udaipur: [
    { id: 'hu-1', name: 'The Leela Palace Udaipur', location: 'Lake Pichola', rating: 4.9, price: 20000, image: 'https://picsum.photos/seed/udaipurhotel1/800/500', type: 'Lake Palace Hotel', amenities: ['Lake View', 'Spa', 'Heritage Tours', 'Restaurant'] },
    { id: 'hu-2', name: 'Taj Lake Palace', location: 'Lake Pichola', rating: 5.0, price: 35000, image: 'https://picsum.photos/seed/udaipurhotel2/800/500', type: 'Luxury Palace', amenities: ['Lake Access', 'Spa', 'Private Dining', 'Butler Service'] },
  ],
  varanasi: [
    { id: 'hv-1', name: 'Taj Ganges Varanasi', location: 'Nadesar', rating: 4.7, price: 7500, image: 'https://picsum.photos/seed/varanasitel1/800/500', type: 'Heritage Hotel', amenities: ['Ganges View', 'Spa', 'Restaurant', 'Heritage Tours'] },
    { id: 'hv-2', name: 'BrijRama Colonial Manor', location: 'Darbhanga Ghat', rating: 4.8, price: 8500, image: 'https://picsum.photos/seed/varanasitel2/800/500', type: 'Heritage Hotel', amenities: ['Ghat Access', 'Rooftop Restaurant', 'Heritage Tours', 'Yoga'] },
  ],
  rishikesh: [
    { id: 'hr-1', name: 'Riverside by Salvus', location: 'Tapovan', rating: 4.6, price: 5500, image: 'https://picsum.photos/seed/rishikeshotel1/800/500', type: 'Riverside Resort', amenities: ['River View', 'Yoga', 'Adventure Tours', 'Restaurant'] },
    { id: 'hr-2', name: 'Ananda in the Himalayas', location: 'Narendranagar', rating: 4.9, price: 18000, image: 'https://picsum.photos/seed/rishikeshotel2/800/500', type: 'Luxury Spa Resort', amenities: ['Spa', 'Yoga', 'Meditation', 'Gym'] },
  ],
};

// Sample Local Hosts Data
const hostsByCity: Record<string, any[]> = {
  goa: [
    { id: 'hg-host1', name: 'Carlos D Costa', avatar: 'CD', rating: 4.97, tours: 234, bio: 'Born & raised in Goa. 10+ years hosting tuk-tuk tours.', languages: ['English', 'Hindi', 'Konkani'], verified: true },
    { id: 'hg-host2', name: 'Priya Naik', avatar: 'PN', rating: 4.95, tours: 189, bio: 'Heritage enthusiast & foodie. Specializes in spice tours.', languages: ['English', 'Hindi', 'Marathi'], verified: true },
    { id: 'hg-host3', name: 'Rahul Shet', avatar: 'RS', rating: 4.92, tours: 156, bio: 'Adventure specialist. Beach & water sports expert.', languages: ['English', 'Hindi'], verified: true },
  ],
  jaipur: [
    { id: 'hj-host1', name: 'Ravi Sharma', avatar: 'RS', rating: 4.96, tours: 289, bio: 'Heritage expert & licensed guide for 12 years.', languages: ['English', 'Hindi', 'Rajasthani'], verified: true },
    { id: 'hj-host2', name: 'Meera Jain', avatar: 'MJ', rating: 4.94, tours: 212, bio: 'Food tour specialist. Knows every street food spot.', languages: ['English', 'Hindi'], verified: true },
    { id: 'hj-host3', name: 'Vikram Singh', avatar: 'VS', rating: 4.91, tours: 178, bio: 'Photography enthusiast. Best photo spots in Pink City.', languages: ['English', 'Hindi', 'Punjabi'], verified: true },
  ],
  delhi: [
    { id: 'hd-host1', name: 'Amit Kumar', avatar: 'AK', rating: 4.98, tours: 412, bio: 'Old Delhi specialist. Food & history tours.', languages: ['English', 'Hindi', 'Punjabi'], verified: true },
    { id: 'hd-host2', name: 'Priya Singh', avatar: 'PS', rating: 4.95, tours: 356, bio: 'History buff & street food expert.', languages: ['English', 'Hindi'], verified: true },
    { id: 'hd-host3', name: 'Suresh Mehta', avatar: 'SM', rating: 4.92, tours: 289, bio: 'Photography expert. Monument tours.', languages: ['English', 'Hindi', 'Gujarati'], verified: true },
  ],
  mumbai: [
    { id: 'hm-host1', name: 'Karan Patel', avatar: 'KP', rating: 4.96, tours: 345, bio: 'Mumbai insider. Film city tours & street food.', languages: ['English', 'Hindi', 'Gujarati'], verified: true },
    { id: 'hm-host2', name: 'Neha Shah', avatar: 'NS', rating: 4.94, tours: 278, bio: 'Heritage walks & architecture tours.', languages: ['English', 'Hindi', 'Marathi'], verified: true },
  ],
  bangalore: [
    { id: 'hb-host1', name: 'Rajesh Nair', avatar: 'RN', rating: 4.95, tours: 234, bio: 'Tech tours & heritage walks expert.', languages: ['English', 'Hindi', 'Kannada', 'Malayalam'], verified: true },
    { id: 'hb-host2', name: 'Anita Reddy', avatar: 'AR', rating: 4.93, tours: 189, bio: 'Food tours & pub crawls specialist.', languages: ['English', 'Hindi', 'Telugu', 'Kannada'], verified: true },
  ],
  udaipur: [
    { id: 'hu-host1', name: 'Vijay Singh', avatar: 'VS', rating: 4.97, tours: 312, bio: 'Lake City expert. Palace & heritage tours.', languages: ['English', 'Hindi', 'Rajasthani'], verified: true },
    { id: 'hu-host2', name: 'Sunita Meena', avatar: 'SM', rating: 4.95, tours: 245, bio: 'Cultural dances & traditional arts tours.', languages: ['English', 'Hindi', 'Mewari'], verified: true },
  ],
  varanasi: [
    { id: 'hv-host1', name: 'Ramesh Yadav', avatar: 'RY', rating: 4.96, tours: 289, bio: 'Spiritual tours & Ganga aarti specialist.', languages: ['English', 'Hindi', 'Bhojpuri'], verified: true },
  ],
  rishikesh: [
    { id: 'hr-host1', name: 'Yogi Ramesh', avatar: 'YR', rating: 4.98, tours: 356, bio: 'Yoga & meditation retreats. Spiritual guide.', languages: ['English', 'Hindi', 'Sanskrit'], verified: true },
    { id: 'hr-host2', name: 'Gita Sharma', avatar: 'GS', rating: 4.94, tours: 234, bio: 'Adventure tours & river rafting expert.', languages: ['English', 'Hindi'], verified: true },
  ],
};

// Sample Experiences/Tours Data
const experiencesByCity: Record<string, any[]> = {
  goa: [
    { id: 'ge-1', title: 'North Goa Beach Hopping', duration: '6 hours', price: 999, rating: 4.96, reviews: 234, image: 'https://picsum.photos/seed/goaexp1/800/500', category: 'Beach Tour', includes: ['Transport', 'Guide', 'Snacks'] },
    { id: 'ge-2', title: 'Spice Plantation Visit', duration: '4 hours', price: 799, rating: 4.91, reviews: 156, image: 'https://picsum.photos/seed/goaexp2/800/500', category: 'Nature', includes: ['Transport', 'Tasting', 'Guide'] },
    { id: 'ge-3', title: 'Sunset Cruise Experience', duration: '3 hours', price: 1299, rating: 4.88, reviews: 189, image: 'https://picsum.photos/seed/goaexp3/800/500', category: 'Boat Tour', includes: ['Cruise', 'Dinner', 'Music'] },
    { id: 'ge-4', title: 'Old Goa Heritage Walk', duration: '3 hours', price: 599, rating: 4.85, reviews: 98, image: 'https://picsum.photos/seed/goaexp4/800/500', category: 'Heritage', includes: ['Guide', 'Entry Tickets'] },
  ],
  jaipur: [
    { id: 'je-1', title: 'Amber Fort Sunrise Tour', duration: '5 hours', price: 1299, rating: 4.98, reviews: 312, image: 'https://picsum.photos/seed/jaipurexp1/800/500', category: 'Heritage', includes: ['Transport', 'Guide', 'Entry Tickets'] },
    { id: 'je-2', title: 'Old City Food Walk', duration: '4 hours', price: 899, rating: 4.95, reviews: 234, image: 'https://picsum.photos/seed/jaipurexp2/800/500', category: 'Food Tour', includes: ['Food Tasting', 'Guide'] },
    { id: 'je-3', title: 'Palace & Museum Tour', duration: '6 hours', price: 1499, rating: 4.91, reviews: 178, image: 'https://picsum.photos/seed/jaipurexp3/800/500', category: 'Heritage', includes: ['Transport', 'Guide', 'Entry Tickets', 'Lunch'] },
  ],
  delhi: [
    { id: 'de-1', title: 'Old Delhi Food Trail', duration: '5 hours', price: 899, rating: 4.97, reviews: 456, image: 'https://picsum.photos/seed/delhi Exp1/800/500', category: 'Food Tour', includes: ['Food Tasting', 'Guide'] },
    { id: 'de-2', title: 'Monuments Tour', duration: '8 hours', price: 1599, rating: 4.92, reviews: 234, image: 'https://picsum.photos/seed/delhi Exp2/800/500', category: 'Heritage', includes: ['Transport', 'Guide', 'Entry Tickets', 'Lunch'] },
    { id: 'de-3', title: 'Street Photography Walk', duration: '4 hours', price: 699, rating: 4.89, reviews: 178, image: 'https://picsum.photos/seed/delhi Exp3/800/500', category: 'Photography', includes: ['Guide', 'Tips'] },
  ],
  mumbai: [
    { id: 'me-1', title: 'Bollywood Studio Tour', duration: '5 hours', price: 1999, rating: 4.95, reviews: 345, image: 'https://picsum.photos/seed/mumbai Exp1/800/500', category: 'Entertainment', includes: ['Transport', 'Guide', 'Studio Visit'] },
    { id: 'me-2', title: 'Dharavi Slum Tour', duration: '3 hours', price: 799, rating: 4.92, reviews: 567, image: 'https://picsum.photos/seed/mumbai Exp2/800/500', category: 'Social', includes: ['Guide', 'Snacks'] },
    { id: 'me-3', title: 'Marine Drive Sunset Walk', duration: '2 hours', price: 499, rating: 4.88, reviews: 234, image: 'https://picsum.photos/seed/mumbai Exp3/800/500', category: 'Walking Tour', includes: ['Guide'] },
  ],
  bangalore: [
    { id: 'be-1', title: 'Tech Park Innovation Tour', duration: '4 hours', price: 1299, rating: 4.94, reviews: 189, image: 'https://picsum.photos/seed/bangalore Exp1/800/500', category: 'Tech', includes: ['Transport', 'Guide'] },
    { id: 'be-2', title: 'Pub Crawl Bangalore', duration: '5 hours', price: 1999, rating: 4.91, reviews: 234, image: 'https://picsum.photos/seed/bangalore Exp2/800/500', category: 'Nightlife', includes: ['Guide', 'Entry', 'Drinks'] },
    { id: 'be-3', title: 'Mysore Palace Day Trip', duration: '10 hours', price: 2499, rating: 4.96, reviews: 178, image: 'https://picsum.photos/seed/bangalore Exp3/800/500', category: 'Day Trip', includes: ['Transport', 'Guide', 'Entry Tickets'] },
  ],
  udaipur: [
    { id: 'ue-1', title: 'Lake Pichola Boat Tour', duration: '3 hours', price: 999, rating: 4.97, reviews: 345, image: 'https://picsum.photos/seed/udaipur Exp1/800/500', category: 'Boat Tour', includes: ['Boat Ride', 'Guide'] },
    { id: 'ue-2', title: 'Traditional Art Workshop', duration: '4 hours', price: 1299, rating: 4.94, reviews: 123, image: 'https://picsum.photos/seed/udaipur Exp2/800/500', category: 'Workshop', includes: ['Materials', 'Instructor', 'Certificate'] },
  ],
  varanasi: [
    { id: 've-1', title: 'Ganga Aarti Experience', duration: '3 hours', price: 599, rating: 4.98, reviews: 456, image: 'https://picsum.photos/seed/varanasi Exp1/800/500', category: 'Spiritual', includes: ['Guide', 'Boat Ride'] },
    { id: 've-2', title: 'Morning Yoga by Ganges', duration: '2 hours', price: 499, rating: 4.95, reviews: 234, image: 'https://picsum.photos/seed/varanasi Exp2/800/500', category: 'Wellness', includes: ['Yoga Session', 'Instructor', 'Tea'] },
  ],
  rishikesh: [
    { id: 're-1', title: 'River Rafting Adventure', duration: '4 hours', price: 1499, rating: 4.97, reviews: 567, image: 'https://picsum.photos/seed/rishikesh Exp1/800/500', category: 'Adventure', includes: ['Rafting', 'Instructor', 'Lunch'] },
    { id: 're-2', title: 'Yoga & Meditation Retreat', duration: '3 hours', price: 999, rating: 4.95, reviews: 345, image: 'https://picsum.photos/seed/rishikesh Exp2/800/500', category: 'Wellness', includes: ['Yoga Session', 'Meditation', 'Guide'] },
    { id: 're-3', title: 'Cliff Jumping Experience', duration: '3 hours', price: 1799, rating: 4.92, reviews: 234, image: 'https://picsum.photos/seed/rishikesh Exp3/800/500', category: 'Adventure', includes: ['Equipment', 'Instructor', 'Photos'] },
  ],
};

// Sample Vehicles Data
const vehiclesByCity: Record<string, any[]> = {
  goa: [
    { id: 'g-v1', brand: 'Bajaj', model: 'RE Plus 3', type: 'Tuk-Tuk', price: 899, rating: 4.92, reviews: 128, image: 'https://picsum.photos/seed/goaveh1/800/500', instantBook: true, features: ['AC', 'Music', 'GPS'] },
    { id: 'g-v2', brand: 'Royal Enfield', model: 'Classic 350', type: 'Bike', price: 699, rating: 4.88, reviews: 94, image: 'https://picsum.photos/seed/goaveh2/800/500', instantBook: true, features: ['Helmet', 'Map'] },
    { id: 'g-v3', brand: 'TVS', model: 'Jupiter', type: 'Scooter', price: 499, rating: 4.95, reviews: 67, image: 'https://picsum.photos/seed/goaveh3/800/500', instantBook: false, features: ['USB Charging'] },
  ],
  jaipur: [
    { id: 'j-v1', brand: 'Bajaj', model: 'RE Pink City', type: 'Tuk-Tuk', price: 799, rating: 4.90, reviews: 112, image: 'https://picsum.photos/seed/jaipurveh1/800/500', instantBook: true, features: ['Local Guide', 'Photography'] },
    { id: 'j-v2', brand: 'Royal Enfield', model: 'Himalayan', type: 'Bike', price: 899, rating: 4.85, reviews: 89, image: 'https://picsum.photos/seed/jaipurveh2/800/500', instantBook: true, features: ['Helmet', 'Maps'] },
    { id: 'j-v3', brand: 'Mahindra', model: 'Bolero', type: 'Jeep', price: 1999, rating: 4.92, reviews: 56, image: 'https://picsum.photos/seed/jaipurveh3/800/500', instantBook: false, features: ['AC', 'Music'] },
  ],
  delhi: [
    { id: 'd-v1', brand: 'Bajaj', model: 'RE Metro', type: 'Tuk-Tuk', price: 599, rating: 4.88, reviews: 156, image: 'https://picsum.photos/seed/deliveh1/800/500', instantBook: true, features: ['GPS', 'Sanitized'] },
    { id: 'd-v2', brand: 'TVS', model: 'Activa 6G', type: 'Scooter', price: 399, rating: 4.82, reviews: 234, image: 'https://picsum.photos/seed/deliveh2/800/500', instantBook: true, features: ['Helmet', 'USB'] },
    { id: 'd-v3', brand: 'Maruti', model: 'Swift Dzire', type: 'Car', price: 1999, rating: 4.90, reviews: 89, image: 'https://picsum.photos/seed/deliveh3/800/500', instantBook: true, features: ['AC', 'Music', 'GPS'] },
  ],
  mumbai: [
    { id: 'm-v1', brand: 'Bajaj', model: 'RE Mumbai Special', type: 'Tuk-Tuk', price: 749, rating: 4.85, reviews: 145, image: 'https://picsum.photos/seed/mumbai veh1/800/500', instantBook: true, features: ['GPS', 'Music'] },
    { id: 'm-v2', brand: 'Honda', model: 'Activa 6G', type: 'Scooter', price: 399, rating: 4.83, reviews: 189, image: 'https://picsum.photos/seed/mumbai veh2/800/500', instantBook: true, features: ['Helmet'] },
  ],
  bangalore: [
    { id: 'b-v1', brand: 'Bajaj', model: 'RE Electric', type: 'E-Tuk-Tuk', price: 999, rating: 4.93, reviews: 78, image: 'https://picsum.photos/seed/bangalore veh1/800/500', instantBook: true, features: ['Electric', 'USB', 'AC'] },
    { id: 'b-v2', brand: 'Ather', model: '450X', type: 'E-Scooter', price: 699, rating: 4.91, reviews: 112, image: 'https://picsum.photos/seed/bangalore veh2/800/500', instantBook: true, features: ['Electric', 'GPS'] },
  ],
  udaipur: [
    { id: 'u-v1', brand: 'Bajaj', model: 'RE Royal', type: 'Tuk-Tuk', price: 849, rating: 4.90, reviews: 98, image: 'https://picsum.photos/seed/udaipurveh1/800/500', instantBook: true, features: ['Guide', 'Photography'] },
    { id: 'u-v2', brand: 'TVS', model: 'Jupiter', type: 'Scooter', price: 499, rating: 4.85, reviews: 67, image: 'https://picsum.photos/seed/udaipurveh2/800/500', instantBook: false, features: ['USB'] },
  ],
  varanasi: [
    { id: 'v-v1', brand: 'Bajaj', model: 'RE Varanasi', type: 'Tuk-Tuk', price: 649, rating: 4.88, reviews: 134, image: 'https://picsum.photos/seed/varanasiveh1/800/500', instantBook: true, features: ['GPS', 'Local Guide'] },
  ],
  rishikesh: [
    { id: 'r-v1', brand: 'Bajaj', model: 'RE Adventure', type: 'Tuk-Tuk', price: 799, rating: 4.92, reviews: 89, image: 'https://picsum.photos/seed/rishikeshveh1/800/500', instantBook: true, features: ['GPS', 'First Aid'] },
    { id: 'r-v2', brand: 'Royal Enfield', model: 'Classic 350', type: 'Bike', price: 799, rating: 4.89, reviews: 76, image: 'https://picsum.photos/seed/rishikeshveh2/800/500', instantBook: true, features: ['Helmet', 'Maps'] },
  ],
};

// All Cities Data
const ALL_CITIES = ['goa', 'jaipur', 'delhi', 'mumbai', 'bangalore', 'udaipur', 'varanasi', 'rishikesh'];

const cityInfo: Record<string, any> = {
  goa: { name: 'Goa', hero: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&h=800&fit=crop', tagline: 'Beach vibes, sunset rides & adventure', description: "India's party capital transforms into an explorer's paradise.", weather: { bestTime: 'October - March', avgTemp: '28°C', humidity: '65%' } },
  jaipur: { name: 'Jaipur', hero: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&h=800&fit=crop', tagline: 'Royal heritage tours & Pink City adventures', description: "Experience the magic of Rajasthan's capital.", weather: { bestTime: 'October - March', avgTemp: '25°C', humidity: '55%' } },
  delhi: { name: 'Delhi', hero: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&h=800&fit=crop', tagline: 'Historic monuments & modern street food', description: "From Mughal-era forts to bustling markets.", weather: { bestTime: 'October - March', avgTemp: '22°C', humidity: '60%' } },
  mumbai: { name: 'Mumbai', hero: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1920&h=800&fit=crop', tagline: 'The city that never sleeps', description: "India's financial capital with endless experiences.", weather: { bestTime: 'October - March', avgTemp: '26°C', humidity: '70%' } },
  bangalore: { name: 'Bangalore', hero: 'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=1920&h=800&fit=crop', tagline: 'Garden city & tech hub', description: "Bengaluru - the silicon valley of India.", weather: { bestTime: 'September - February', avgTemp: '24°C', humidity: '65%' } },
  udaipur: { name: 'Udaipur', hero: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&h=800&fit=crop', tagline: 'City of lakes & royal heritage', description: "The Venice of the East with magnificent palaces.", weather: { bestTime: 'October - March', avgTemp: '24°C', humidity: '50%' } },
  varanasi: { name: 'Varanasi', hero: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1920&h=800&fit=crop', tagline: 'Spiritual capital of India', description: "One of the oldest living cities on Earth.", weather: { bestTime: 'October - March', avgTemp: '26°C', humidity: '55%' } },
  rishikesh: { name: 'Rishikesh', hero: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=800&fit=crop', tagline: 'Yoga capital of the world', description: "Adventure and spirituality meet in the Himalayas.", weather: { bestTime: 'September - June', avgTemp: '22°C', humidity: '60%' } },
};

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export default function CityPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'hotels' | 'experiences' | 'hosts'>('vehicles');
  const [bookingModal, setBookingModal] = useState<{ type: string; item: any } | null>(null);
  const [bookingData, setBookingData] = useState({ date: '', guests: 1, hours: 8 });

  const slug = params.slug as string;
  const city = cityInfo[slug];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5722]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
            <Link href="/cities">
              <Button>View All Cities</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hotels = hotelsByCity[slug] || [];
  const hosts = hostsByCity[slug] || [];
  const experiences = experiencesByCity[slug] || [];
  const vehicles = vehiclesByCity[slug] || [];

  const handleBooking = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    // Store booking in localStorage for demo (in production, use API)
    const booking = {
      id: `BK-${Date.now()}`,
      type: bookingModal?.type,
      item: bookingModal?.item,
      city: slug,
      date: bookingData.date,
      guests: bookingData.guests,
      hours: bookingData.hours,
      total: bookingModal?.item?.price * (bookingData.hours / 8 || 1),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const existingBookings = JSON.parse(localStorage.getItem('helphive_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('helphive_bookings', JSON.stringify(existingBookings));

    alert(`Booking confirmed! Your booking ID is: ${booking.id}\n\nCheck your profile to view all bookings.`);
    setBookingModal(null);
    router.push('/dashboard/user');
  };

  const renderVehicles = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
          <div className="relative aspect-[16/10]">
            <img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover" />
            {vehicle.instantBook && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-[#FF5722] text-white text-xs font-semibold rounded-lg">
                Instant Book
              </div>
            )}
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
              <Heart className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
              <span className="font-semibold">{vehicle.rating}</span>
              <span className="text-sm text-gray-500">({vehicle.reviews})</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-sm text-gray-500 mb-3">{vehicle.type}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {vehicle.features.map((f: string) => (
                <span key={f} className="px-2 py-1 bg-gray-100 rounded text-xs">{f}</span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-2xl font-bold text-[#FF5722]">{formatCurrency(vehicle.price)}</span>
                <span className="text-sm text-gray-500">/day</span>
              </div>
              <Button onClick={() => setBookingModal({ type: 'vehicle', item: vehicle })}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHotels = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <div key={hotel.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
          <div className="relative aspect-[16/10]">
            <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3">
              <Badge variant="primary" size="sm">{hotel.type}</Badge>
            </div>
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
              <Heart className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
              <span className="font-semibold">{hotel.rating}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
            <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {hotel.location}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.map((a: string) => (
                <span key={a} className="px-2 py-1 bg-gray-100 rounded text-xs">{a}</span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-2xl font-bold text-[#FF5722]">{formatCurrency(hotel.price)}</span>
                <span className="text-sm text-gray-500">/night</span>
              </div>
              <Button onClick={() => setBookingModal({ type: 'hotel', item: hotel })}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderExperiences = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
          <div className="relative aspect-[16/10]">
            <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-semibold">
              {exp.duration}
            </div>
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
              <Heart className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
              <span className="font-semibold">{exp.rating}</span>
              <span className="text-sm text-gray-500">({exp.reviews})</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{exp.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{exp.category}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {exp.includes.map((inc: string) => (
                <span key={inc} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> {inc}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-2xl font-bold text-[#FF5722]">{formatCurrency(exp.price)}</span>
                <span className="text-sm text-gray-500">/person</span>
              </div>
              <Button onClick={() => setBookingModal({ type: 'experience', item: exp })}>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHosts = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hosts.map((host) => (
        <div key={host.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white text-xl font-bold">
              {host.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{host.name}</h3>
                {host.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                <span>{host.rating}</span>
                <span>•</span>
                <span>{host.tours} tours</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{host.bio}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {host.languages.map((lang: string) => (
              <span key={lang} className="px-2 py-1 bg-gray-100 rounded text-xs">{lang}</span>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            Contact {host.name.split(' ')[0]}
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px]">
          <img src={city.hero} alt={city.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5722] text-white text-xs font-semibold rounded-full mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">{city.name}</h1>
              <p className="text-xl text-white/80 mb-6 max-w-2xl">{city.tagline}</p>
              <div className="flex flex-wrap gap-6 text-white/70 text-sm">
                <span className="flex items-center gap-2">
                  <Sun className="h-4 w-4" /> {city.weather.bestTime}
                </span>
                <span className="flex items-center gap-2">
                  <ThermometerSun className="h-4 w-4" /> {city.weather.avgTemp}
                </span>
                <span className="flex items-center gap-2">
                  <Wind className="h-4 w-4" /> {city.weather.humidity}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="sticky top-20 lg:top-24 z-30 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-1 py-2">
              {[
                { id: 'vehicles', icon: Navigation, label: 'Vehicles', count: vehicles.length },
                { id: 'hotels', icon: Hotel, label: 'Hotels', count: hotels.length },
                { id: 'experiences', icon: Camera, label: 'Experiences', count: experiences.length },
                { id: 'hosts', icon: Award, label: 'Local Hosts', count: hosts.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#FF5722] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {activeTab === 'vehicles' && `${vehicles.length} Vehicles Available`}
                {activeTab === 'hotels' && `${hotels.length} Hotels & Stays`}
                {activeTab === 'experiences' && `${experiences.length} Experiences`}
                {activeTab === 'hosts' && `${hosts.length} Local Hosts`}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            {activeTab === 'vehicles' && renderVehicles()}
            {activeTab === 'hotels' && renderHotels()}
            {activeTab === 'experiences' && renderExperiences()}
            {activeTab === 'hosts' && renderHosts()}

            {(vehicles.length === 0 || hotels.length === 0) && activeTab !== 'hosts' && (
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg">More options coming soon for {city.name}!</p>
                <p className="text-sm">Check back later or explore other cities.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#FF5722] to-[#FF8A65]">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to explore {city.name}?</h2>
            <p className="text-white/80 mb-8">Book your perfect ride, stay, or experience now!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" onClick={() => setActiveTab('vehicles')}>
                <Navigation className="h-5 w-5 mr-2" />
                Rent a Vehicle
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setActiveTab('hotels')}>
                <Hotel className="h-5 w-5 mr-2" />
                Book a Hotel
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Book {bookingModal.item.name || bookingModal.item.brand + ' ' + bookingModal.item.model}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Booking Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#FF5722]"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {bookingModal.type === 'vehicle' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Hours</label>
                  <select
                    value={bookingData.hours}
                    onChange={(e) => setBookingData({ ...bookingData, hours: Number(e.target.value) })}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#FF5722]"
                  >
                    {[4, 6, 8, 10, 12].map((h) => (
                      <option key={h} value={h}>{h} hours</option>
                    ))}
                  </select>
                </div>
              )}
              {(bookingModal.type === 'hotel' || bookingModal.type === 'experience') && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {bookingModal.type === 'hotel' ? 'Number of Guests' : 'Number of People'}
                  </label>
                  <select
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#FF5722]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={g} value={g}>{g} {g === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Price</span>
                  <span className="font-bold text-lg">{formatCurrency(bookingModal.item.price)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Duration</span>
                  <span>{bookingModal.type === 'vehicle' ? `${bookingData.hours} hours` : bookingModal.type === 'hotel' ? '1 night' : bookingModal.item.duration}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#FF5722]">
                    {formatCurrency(bookingModal.item.price * (bookingModal.type === 'vehicle' ? bookingData.hours / 8 : 1))}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setBookingModal(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleBooking} className="flex-1">
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}