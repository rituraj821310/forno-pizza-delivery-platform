import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-char/10 bg-char text-flour/80 mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Logo className="[&_span:last-child]:text-flour" />
          <p className="mt-4 text-sm leading-relaxed text-flour/60 max-w-xs">
            Wood-fired pizza made with slow-fermented dough, real mozzarella, and a
            forty-minute promise from oven to door.
          </p>
        </div>

        <div>
          <h4 className="font-sans text-sm font-semibold text-flour mb-4">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/menu" className="hover:text-flour transition-colors">Full menu</Link></li>
            <li><Link to="/orders" className="hover:text-flour transition-colors">Track an order</Link></li>
            <li><Link to="/register" className="hover:text-flour transition-colors">Create account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-sm font-semibold text-flour mb-4">Hours</h4>
          <ul className="space-y-2 text-sm text-flour/60">
            <li>Mon – Thu: 11:00 – 22:00</li>
            <li>Fri – Sat: 11:00 – 23:30</li>
            <li>Sunday: 12:00 – 21:00</li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-sm font-semibold text-flour mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-flour/60">
            <li>support@forno.com</li>
            <li>+91 (999) 019-2231</li>
            <li>184, Connaught Place, New Delhi, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-flour/10 py-5 text-center text-xs text-flour/40">
        © {new Date().getFullYear()} Forno Pizza Co. All rights reserved.
      </div>
    </footer>
  )
}
