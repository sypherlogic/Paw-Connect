import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, MapPin, CheckCircle2, Clock } from 'lucide-react';

const SERVICE_LABELS = {
  dog_sitter: 'Dog Sitter',
  trainer: 'Trainer',
  groomer: 'Groomer',
  vet_clinic: 'Vet Clinic'
};

const SERVICE_COLORS = {
  dog_sitter: 'bg-amber-50 text-amber-700 border-amber-200',
  trainer: 'bg-blue-50 text-blue-700 border-blue-200',
  groomer: 'bg-pink-50 text-pink-700 border-pink-200',
  vet_clinic: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export default function ProviderCard({ provider }) {
  const lowestPrice = provider.services_offered?.length > 0 
    ? Math.min(...provider.services_offered.map(s => s.price))
    : null;

  return (
    <Link to={createPageUrl('ProviderProfile') + `?id=${provider.id}`}>
      <Card className="group overflow-hidden bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="p-5">
          <div className="flex gap-4">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100">
                {provider.photo_url ? (
                  <img 
                    src={provider.photo_url} 
                    alt={provider.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-semibold">
                    {provider.name?.charAt(0)}
                  </div>
                )}
              </div>
              {provider.verified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {provider.name}
                  </h3>
                  <Badge variant="outline" className={`mt-1 text-xs font-medium ${SERVICE_COLORS[provider.service_type]}`}>
                    {SERVICE_LABELS[provider.service_type]}
                  </Badge>
                </div>
                {provider.rating > 0 && (
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-sm text-slate-700">{provider.rating?.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">({provider.review_count})</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {provider.location}
                </span>
                {provider.years_experience > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {provider.years_experience}+ yrs
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bio Preview */}
          {provider.bio && (
            <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {provider.bio}
            </p>
          )}

          {/* Bottom Section */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {provider.certifications?.slice(0, 2).map((cert, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  {cert}
                </span>
              ))}
              {provider.certifications?.length > 2 && (
                <span className="text-xs text-slate-400">+{provider.certifications.length - 2}</span>
              )}
            </div>
            {lowestPrice && (
              <div className="text-right">
                <span className="text-xs text-slate-400">From</span>
                <span className="ml-1 font-semibold text-slate-900">${lowestPrice}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}