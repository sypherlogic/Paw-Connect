import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, CheckCircle2 } from 'lucide-react';
import { createReview } from '@/api/pawconnect';

export default function ReviewModal({ open, onClose, provider, onReviewSubmitted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: '',
    comment: '',
    reviewer_name: '',
    reviewer_email: '',
    service_used: ''
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createReview({
        ...reviewData,
        provider_id: provider.id
      });
      setIsSuccess(true);
      onReviewSubmitted?.();
    } catch (error) {
      console.error('Review error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setReviewData({
      rating: 0,
      title: '',
      comment: '',
      reviewer_name: '',
      reviewer_email: '',
      service_used: ''
    });
    onClose();
  };

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Thank You!</h3>
            <p className="text-slate-600 mb-6">
              Your review has been submitted successfully.
            </p>
            <Button onClick={handleClose} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review {provider?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <Label>Your Rating</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setReviewData({...reviewData, rating: star})}
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || reviewData.rating) 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-slate-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Your Name</Label>
              <Input 
                value={reviewData.reviewer_name}
                onChange={(e) => setReviewData({...reviewData, reviewer_name: e.target.value})}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                value={reviewData.reviewer_email}
                onChange={(e) => setReviewData({...reviewData, reviewer_email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Service Used */}
          <div>
            <Label>Service Used (optional)</Label>
            <Input 
              value={reviewData.service_used}
              onChange={(e) => setReviewData({...reviewData, service_used: e.target.value})}
              placeholder="e.g., Dog Grooming"
            />
          </div>

          {/* Title */}
          <div>
            <Label>Review Title (optional)</Label>
            <Input 
              value={reviewData.title}
              onChange={(e) => setReviewData({...reviewData, title: e.target.value})}
              placeholder="Summarize your experience"
            />
          </div>

          {/* Comment */}
          <div>
            <Label>Your Review</Label>
            <Textarea 
              value={reviewData.comment}
              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              placeholder="Share your experience with this provider..."
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={!reviewData.rating || !reviewData.comment || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}