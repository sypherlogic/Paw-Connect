import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, CheckCircle2, Phone, Mail, Globe, Share2 } from 'lucide-react';

const SERVICE_LABELS = {
  dog_sitter: 'Dog Sitter',
  trainer: 'Trainer',
  groomer: 'Groomer',
  vet_clinic: 'Vet Clinic'
};

export default function ProfileHeader({ provider, onBookClick }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: provider.name,
        text: `Check out ${provider.name} on PawPros`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo */}
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
              {provider.photo_url ? (
                <img 
                  src={provider.photo_url} 
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl font-semibold">
                  {provider.name?.charAt(0)}
                </div>
              )}
            </div>
            {provider.verified && (
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 fill-emerald-50" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{provider.name}</h1>
                  {provider.featured && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">Featured</Badge>
                  )}
                </div>
                <Badge variant="outline" className="mt-2 text-sm">
                  {SERVICE_LABELS[provider.service_type]}
                </Badge>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2">
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={onBookClick}
                  className="bg-emerald-600 hover:bg-emerald-700 px-6"
                >
                  Book Now
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-slate-600">
              {provider.rating > 0 && (
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-amber-700">{provider.rating?.toFixed(1)}</span>
                  <span className="text-amber-600">({provider.review_count} reviews)</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {provider.location}
              </div>
              {provider.years_experience > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {provider.years_experience}+ years experience
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              {provider.phone && (
                <a href={`tel:${provider.phone}`} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  {provider.phone}
                </a>
              )}
              {provider.email && (
                <a href={`mailto:${provider.email}`} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  {provider.email}
                </a>
              )}
              {provider.website && (
                <a href={provider.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}