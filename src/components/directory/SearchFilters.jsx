import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const SERVICE_TYPES = [
  { value: 'all', label: 'All Services' },
  { value: 'dog_sitter', label: 'Dog Sitters' },
  { value: 'trainer', label: 'Trainers' },
  { value: 'groomer', label: 'Groomers' },
  { value: 'vet_clinic', label: 'Vet Clinics' }
];

const LOCATIONS = [
  { value: 'all', label: 'All Locations' },
  { value: 'Los Angeles', label: 'Los Angeles' },
  { value: 'San Diego', label: 'San Diego' },
  { value: 'Orange County', label: 'Orange County' },
  { value: 'Santa Barbara', label: 'Santa Barbara' },
  { value: 'Riverside', label: 'Riverside' },
  { value: 'Ventura', label: 'Ventura' }
];

const EXPERIENCE_LEVELS = [
  { value: 'all', label: 'Any Experience' },
  { value: '1', label: '1+ Years' },
  { value: '3', label: '3+ Years' },
  { value: '5', label: '5+ Years' },
  { value: '10', label: '10+ Years' }
];

export default function SearchFilters({ filters, setFilters, onClearFilters }) {
  const hasActiveFilters = filters.search || filters.serviceType !== 'all' || 
    filters.location !== 'all' || filters.experience !== 'all' || filters.maxPrice < 200;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">Service Type</label>
        <Select value={filters.serviceType} onValueChange={(v) => setFilters({...filters, serviceType: v})}>
          <SelectTrigger className="bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">Location</label>
        <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
          <SelectTrigger className="bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map(loc => (
              <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 mb-2 block">Experience Level</label>
        <Select value={filters.experience} onValueChange={(v) => setFilters({...filters, experience: v})}>
          <SelectTrigger className="bg-white border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map(exp => (
              <SelectItem key={exp.value} value={exp.value}>{exp.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">Max Price</label>
          <span className="text-sm text-slate-500">${filters.maxPrice}</span>
        </div>
        <Slider
          value={[filters.maxPrice]}
          onValueChange={([v]) => setFilters({...filters, maxPrice: v})}
          max={200}
          min={10}
          step={5}
          className="py-2"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters} className="w-full text-slate-600">
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name, service, or keyword..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-3">
            <Select value={filters.serviceType} onValueChange={(v) => setFilters({...filters, serviceType: v})}>
              <SelectTrigger className="w-40 h-12 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.location} onValueChange={(v) => setFilters({...filters, location: v})}>
              <SelectTrigger className="w-40 h-12 bg-slate-50 border-slate-200">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map(loc => (
                  <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 px-4 bg-slate-50 border-slate-200">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  More Filters
                  {hasActiveFilters && (
                    <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full h-12 bg-slate-50 border-slate-200">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}