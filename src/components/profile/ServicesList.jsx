import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign } from 'lucide-react';

export default function ServicesList({ services, onSelectService }) {
  if (!services?.length) return null;

  return (
    <Card className="border-slate-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">Services & Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service, idx) => (
          <div 
            key={idx}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-medium text-slate-900">{service.name}</h4>
              <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                {service.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-lg font-semibold text-slate-900">${service.price}</span>
              </div>
              <Button 
                size="sm" 
                onClick={() => onSelectService(service)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Book
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}