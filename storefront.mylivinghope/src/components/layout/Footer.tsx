import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#336F49] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">My Living Hope</h3>
            <p className="text-sm text-white/70">
              Prayer Portals &mdash; connecting your emotions with Scripture and
              prayer.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Made in New Zealand</h4>
            <p className="text-sm text-white/70">Christchurch, NZ</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} My Living Hope. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}
