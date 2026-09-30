import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { PawPrint, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_LINKS = [
  { name: 'Home', page: 'Home' },
  { name: 'Directory', page: 'Directory' }
];

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-700 transition-colors">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">PawPros</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link 
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link to={createPageUrl('Directory')}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Find a Provider
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {NAV_LINKS.map(link => (
                    <Link 
                      key={link.page}
                      to={createPageUrl(link.page)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-slate-900 hover:text-emerald-600 transition-colors py-2"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t mt-4">
                    <Link to={createPageUrl('Directory')} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Find a Provider
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PawPros</span>
              </div>
              <p className="text-slate-400 max-w-xs leading-relaxed">
                Connecting pet owners with trusted professionals across Southern California. 
                Find the perfect care for your furry family members.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map(link => (
                  <li key={link.page}>
                    <Link 
                      to={createPageUrl(link.page)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Dog Sitting</li>
                <li>Training</li>
                <li>Grooming</li>
                <li>Vet Clinics</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} PawPros. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}