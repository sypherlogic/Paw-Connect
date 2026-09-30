import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getProviderStats, listFeaturedProviders } from '@/api/pawconnect';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Shield, Heart, Clock, ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';
import FeaturedProviders from '@/components/directory/FeaturedProviders';

const SERVICE_CATEGORIES = [
  { 
    type: 'dog_sitter', 
    label: 'Dog Sitters', 
    icon: '🐕', 
    description: 'Trusted care while you\'re away',
    color: 'from-amber-400 to-orange-500'
  },
  { 
    type: 'trainer', 
    label: 'Trainers', 
    icon: '🎓', 
    description: 'Professional behavior training',
    color: 'from-blue-400 to-indigo-500'
  },
  { 
    type: 'groomer', 
    label: 'Groomers', 
    icon: '✂️', 
    description: 'Keep your pet looking great',
    color: 'from-pink-400 to-rose-500'
  },
  { 
    type: 'vet_clinic', 
    label: 'Vet Clinics', 
    icon: '🏥', 
    description: 'Quality healthcare nearby',
    color: 'from-emerald-400 to-teal-500'
  }
];

const TRUST_FEATURES = [
  { icon: Shield, title: 'Verified Providers', description: 'All professionals are background-checked and verified' },
  { icon: Star, title: 'Honest Reviews', description: 'Real reviews from pet owners in your community' },
  { icon: Heart, title: 'Trusted Care', description: 'Find providers who truly love animals' },
  { icon: Clock, title: 'Easy Booking', description: 'Book appointments online in minutes' },
  { icon: DollarSign, title: 'Transparent Pricing', description: 'Clear pricing with no hidden fees or surprises' }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: featuredProviders = [] } = useQuery({
    queryKey: ['featured-providers'],
    queryFn: listFeaturedProviders
  });

  const { data: stats } = useQuery({
    queryKey: ['provider-stats'],
    queryFn: getProviderStats
  });

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = createPageUrl('Directory') + `?search=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="absolute inset-0 bg-[url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69864827a911a9fbfd4b0406/e482e59f4_2b2da739-b1a2-477d-89fa-3343af59a44e.png')] bg-contain bg-center bg-no-repeat opacity-25" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              Serving Southern California
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
              Find Trusted Pet Care
              <span className="block text-emerald-600 mt-2">Near You</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Connect with verified dog sitters, trainers, groomers, and vet clinics. 
              Read real reviews, compare prices, and book with confidence.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-10 max-w-xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search for services, providers, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 h-14 text-lg rounded-2xl border-slate-200 shadow-lg shadow-slate-100 focus:ring-2 focus:ring-emerald-500"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 bg-emerald-600 hover:bg-emerald-700 h-10 px-6 rounded-xl"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            {stats && (
              <div className="flex items-center justify-center gap-8 mt-10 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-600"><strong className="text-slate-900">{stats.totalProviders}</strong> Providers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-slate-600"><strong className="text-slate-900">{stats.avgRating}</strong> Avg Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                  <span className="text-slate-600"><strong className="text-slate-900">{stats.totalReviews}</strong> Reviews</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Browse by Service</h2>
          <p className="text-slate-500 mt-2">Find the right care for your furry friend</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICE_CATEGORIES.map(category => (
            <Link 
              key={category.type}
              to={createPageUrl('Directory') + `?serviceType=${category.type}`}
              className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${category.color} opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`} />
              <div className="relative">
                <span className="text-4xl">{category.icon}</span>
                <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {category.label}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{category.description}</p>
                <ArrowRight className="mt-4 w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Providers */}
      <FeaturedProviders providers={featuredProviders} />

      {/* Trust Features */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Why PawPros?</h2>
            <p className="text-slate-500 mt-2">Built with trust and transparency in mind</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {TRUST_FEATURES.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69864827a911a9fbfd4b0406/e482e59f4_2b2da739-b1a2-477d-89fa-3343af59a44e.png')] bg-contain bg-center bg-no-repeat opacity-25" />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Ready to find the perfect care for your pet?
            </h2>
            <p className="mt-4 text-emerald-100">
              Browse our directory of trusted providers and book your first appointment today.
            </p>
            <Link to={createPageUrl('Directory')}>
              <Button className="mt-6 bg-white text-emerald-700 hover:bg-emerald-50 px-8 h-12 text-lg font-semibold">
                Explore Directory
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}