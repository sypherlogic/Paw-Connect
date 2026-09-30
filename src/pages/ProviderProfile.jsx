import React, { useState } from 'react';
import { getProvider, listProviderReviews } from '@/api/pawconnect';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Award, Calendar, MapPin } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ServicesList from '@/components/profile/ServicesList';
import ReviewsList from '@/components/profile/ReviewsList';
import BookingModal from '@/components/booking/BookingModal';
import ReviewModal from '@/components/profile/ReviewModal';

export default function ProviderProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const providerId = urlParams.get('id');

  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => getProvider(providerId),
    enabled: !!providerId
  });

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', providerId],
    queryFn: () => listProviderReviews(providerId),
    enabled: !!providerId
  });

  const handleBookClick = () => {
    setSelectedService(null);
    setBookingOpen(true);
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  if (providerLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-6">
              <Skeleton className="w-40 h-40 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Provider Not Found</h1>
          <p className="text-slate-500 mb-6">The provider you're looking for doesn't exist.</p>
          <Link to={createPageUrl('Directory')}>
            <Button>Back to Directory</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link to={createPageUrl('Directory')} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>
        </div>
      </div>

      <ProfileHeader provider={provider} onBookClick={handleBookClick} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {provider.bio && (
              <Card className="border-slate-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{provider.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            <ServicesList 
              services={provider.services_offered} 
              onSelectService={handleSelectService}
            />

            {/* Reviews */}
            <ReviewsList 
              reviews={reviews} 
              onWriteReview={() => setReviewOpen(true)}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certifications */}
            {provider.certifications?.length > 0 && (
              <Card className="border-slate-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {provider.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Availability */}
            {provider.availability?.length > 0 && (
              <Card className="border-slate-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {provider.availability.map((day, idx) => (
                      <Badge key={idx} variant="outline" className="text-slate-600">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {provider.address && (
              <Card className="border-slate-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{provider.address}</p>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="border-emerald-200 bg-emerald-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-slate-900 mb-2">Ready to book?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Schedule an appointment with {provider.name?.split(' ')[0]} today.
                </p>
                <Button 
                  onClick={handleBookClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingModal 
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        provider={provider}
        selectedService={selectedService}
      />

      <ReviewModal 
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        provider={provider}
        onReviewSubmitted={refetchReviews}
      />
    </div>
  );
}