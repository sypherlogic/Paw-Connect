import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function FeaturedProviders({ providers }) {
  if (!providers?.length) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Providers</h2>
            <p className="text-slate-500 mt-1">Top-rated professionals in your area</p>
          </div>
          <Link to={createPageUrl('Directory')}>
            <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map(provider => (
            <Link 
              key={provider.id} 
              to={createPageUrl('ProviderProfile') + `?id=${provider.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100">
                      {provider.photo_url ? (
                        <img 
                          src={provider.photo_url} 
                          alt={provider.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xl font-semibold">
                          {provider.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    {provider.verified && (
                      <CheckCircle2 className="absolute -bottom-1 -right-1 w-5 h-5 text-emerald-500 fill-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-slate-500">{provider.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium text-sm">{provider.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({provider.review_count} reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600 line-clamp-2">{provider.bio}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}