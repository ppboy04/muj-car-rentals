import Link from "next/link"
import { Car, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">MUJ Car Rentals</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Premium car rental service for MUJ students and locals. 
              Experience convenience, affordability, and reliability.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-slate-800 hover:bg-blue-400 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-slate-800 hover:bg-pink-600 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/cars" className="block text-slate-300 hover:text-white transition-colors">
                Browse Cars
              </Link>
              <Link href="/bookings" className="block text-slate-300 hover:text-white transition-colors">
                My Bookings
              </Link>
              <Link href="/auth" className="block text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <nav className="space-y-2">
              <span className="block text-slate-300">Hourly Rentals</span>
              <span className="block text-slate-300">Daily Rentals</span>
              <span className="block text-slate-300">Student Discounts</span>
              <span className="block text-slate-300">24/7 Support</span>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">
                  Manipal University Jaipur,<br />
                  Rajasthan, India
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">info@mujcarrentals.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 MUJ Car Rentals. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
