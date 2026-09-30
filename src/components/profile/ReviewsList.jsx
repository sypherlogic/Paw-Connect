import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewsList({ reviews, onWriteReview }) {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews?.slice(0, 3);

  const averageRating = reviews?.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews?.filter(r => Math.floor(r.rating) === rating).length || 0,
    percentage: reviews?.length ? (reviews.filter(r => Math.floor(r.rating) === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <Card className="border-slate-100">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Reviews ({reviews?.length || 0})
          </CardTitle>
          <Button onClick={onWriteReview} variant="outline" size="sm">
            Write a Review
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Rating Summary */}
        {reviews?.length > 0 && (
          <div className="flex gap-8 mb-6 pb-6 border-b border-slate-100">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900">{averageRating}</div>
              <div className="flex items-center justify-center mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <div className="text-sm text-slate-500 mt-1">{reviews.length} reviews</div>
            </div>
            <div className="flex-1 space-y-1">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-3 text-slate-600">{rating}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {displayedReviews?.map((review) => (
            <div key={review.id} className="pb-4 border-b border-slate-100 last:border-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{review.reviewer_name || 'Anonymous'}</span>
                    {review.verified_booking && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    {review.service_used && (
                      <span className="text-xs text-slate-500">• {review.service_used}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400">
                  {format(new Date(review.created_date), 'MMM d, yyyy')}
                </span>
              </div>
              {review.title && (
                <h4 className="font-medium text-slate-900 mt-2">{review.title}</h4>
              )}
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{review.comment}</p>
            </div>
          ))}

          {!reviews?.length && (
            <div className="text-center py-8 text-slate-500">
              <p>No reviews yet. Be the first to write one!</p>
            </div>
          )}

          {reviews?.length > 3 && !showAll && (
            <Button 
              variant="ghost" 
              onClick={() => setShowAll(true)}
              className="w-full text-slate-600"
            >
              Show All Reviews <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}