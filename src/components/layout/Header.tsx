'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Menu, X } from 'lucide-react'

const navigationItems = [
  { name: 'Ahorrar', href: '/ahorrar' },
  { name: 'Invertir', href: '/invertir' },
  { name: 'Tu día a día', href: '/tu-dia-a-dia' },
  { name: 'Asesoramiento', href: '/asesoramiento' },
  { name: 'Aprender a Invertir', href: '/aprender-a-invertir' },
]

const secondaryNavItems = [
  { name: 'Lo más visto', href: '/lo-mas-visto' },
  { name: 'Blog', href: '/blog' },
  { name: 'Conócenos', href: '/conocenos' },
  { name: 'Ayuda', href: '/ayuda' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/self_bank.png"
                alt="Self Bank"
                width={180}
                height={60}
                priority
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-[var(--primary-red)] px-3 py-2 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-700 hover:text-[var(--primary-red)]"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="https://clientes.selfbank.es/conexion/"
              className="text-gray-700 hover:text-[var(--primary-red)] px-4 py-2 text-sm font-medium border border-gray-300 rounded-md"
            >
              Área cliente
            </Link>
            <Link
              href="https://clientes.selfbank.es/quiero-ser-cliente"
              className="bg-[var(--primary-red)] text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-red-700"
            >
              Hazte cliente
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-[var(--primary-red)]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[var(--primary-red)] hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {secondaryNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[var(--primary-red)] hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search dialog */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">¿Qué quieres buscar?</h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Escribe tu búsqueda..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]"
              />
              <button className="px-4 py-2 bg-[var(--primary-red)] text-white rounded-r-md hover:bg-red-700">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 