import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { createBooking } from '@/api/pawconnect';

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

export default function BookingModal({ open, onClose, provider, selectedService }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    service_name: selectedService?.name || '',
    service_price: selectedService?.price || 0,
    date: null,
    time: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    pet_name: '',
    pet_type: 'dog',
    pet_breed: '',
    notes: ''
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createBooking({
        ...bookingData,
        provider_id: provider.id,
        provider_name: provider.name,
        date: bookingData.date ? format(bookingData.date, 'yyyy-MM-dd') : null
      });
      setStep(3);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setBookingData({
      service_name: '',
      service_price: 0,
      date: null,
      time: '',
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      pet_name: '',
      pet_type: 'dog',
      pet_breed: '',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 3 ? 'Booking Confirmed!' : `Book with ${provider?.name}`}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            {/* Service Selection */}
            <div>
              <Label>Service</Label>
              <Select 
                value={bookingData.service_name} 
                onValueChange={(v) => {
                  const service = provider.services_offered?.find(s => s.name === v);
                  setBookingData({...bookingData, service_name: v, service_price: service?.price || 0});
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {provider?.services_offered?.map((service, idx) => (
                    <SelectItem key={idx} value={service.name}>
                      {service.name} - ${service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingData.date ? format(bookingData.date, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingData.date}
                    onSelect={(date) => setBookingData({...bookingData, date})}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div>
              <Label>Time</Label>
              <Select value={bookingData.time} onValueChange={(v) => setBookingData({...bookingData, time: v})}>
                <SelectTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={() => setStep(2)} 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={!bookingData.service_name || !bookingData.date || !bookingData.time}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Your Name</Label>
                <Input 
                  value={bookingData.customer_name}
                  onChange={(e) => setBookingData({...bookingData, customer_name: e.target.value})}
                  placeholder="Full name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={bookingData.customer_email}
                  onChange={(e) => setBookingData({...bookingData, customer_email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  type="tel"
                  value={bookingData.customer_phone}
                  onChange={(e) => setBookingData({...bookingData, customer_phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Pet Info */}
            <div className="pt-4 border-t">
              <h4 className="font-medium text-slate-900 mb-3">Pet Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pet Name</Label>
                  <Input 
                    value={bookingData.pet_name}
                    onChange={(e) => setBookingData({...bookingData, pet_name: e.target.value})}
                    placeholder="Pet's name"
                  />
                </div>
                <div>
                  <Label>Pet Type</Label>
                  <Select value={bookingData.pet_type} onValueChange={(v) => setBookingData({...bookingData, pet_type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Breed (optional)</Label>
                  <Input 
                    value={bookingData.pet_breed}
                    onChange={(e) => setBookingData({...bookingData, pet_breed: e.target.value})}
                    placeholder="e.g., Golden Retriever"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Additional Notes (optional)</Label>
              <Textarea 
                value={bookingData.notes}
                onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                placeholder="Any special requests or information about your pet..."
                rows={3}
              />
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-medium text-slate-900 mb-2">Booking Summary</h4>
              <div className="text-sm space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium text-slate-900">{bookingData.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{bookingData.date && format(bookingData.date, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{bookingData.time}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                  <span className="font-medium text-slate-900">Total:</span>
                  <span className="font-semibold text-emerald-600">${bookingData.service_price}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={!bookingData.customer_name || !bookingData.customer_email || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Booking Request Sent!</h3>
            <p className="text-slate-600 mb-6">
              {provider?.name} will review your request and confirm your appointment shortly.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 text-left mb-6">
              <div className="text-sm space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-medium text-slate-900">{bookingData.service_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{bookingData.date && format(bookingData.date, 'PPP')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{bookingData.time}</span>
                </div>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full bg-emerald-600 hover:bg-emerald-700">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}