import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/en'
import { href } from '@/lib/site'
<<<<<<< HEAD
import { CartBadge } from './CartBadge'

export type HubView = 'discover' | 'cart' | 'tickets'
=======

export type HubView = 'discover' | 'tickets'
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975

/** Two in-page sections of the My Booking hub: browse events, and your own tickets. */
export function AccountSections({
  locale,
  t,
  active,
}: {
  locale: Locale
  t: Dictionary
  active: HubView
}) {
  const base = href(locale, '/account')
  const items: { view: HubView; label: string; to: string }[] = [
    { view: 'discover', label: t.hubDiscover, to: base },
<<<<<<< HEAD
    { view: 'cart', label: t.hubCart, to: `${base}?view=cart` },
=======
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
    { view: 'tickets', label: t.hubMyTickets, to: `${base}?view=tickets` },
  ]
  return (
    <nav aria-label={t.myBookings} className="flex gap-6 overflow-x-auto border-b border-rule">
      {items.map((i) => (
        <Link
          key={i.view}
          href={i.to}
          aria-current={i.view === active ? 'page' : undefined}
          className={`-mb-px min-h-11 shrink-0 border-b-2 py-3 font-ui text-caption font-semibold ${
            i.view === active
              ? 'border-ink text-ink'
              : 'border-transparent text-slate hover:text-ink'
          }`}
        >
          {i.label}
<<<<<<< HEAD
          {i.view === 'cart' ? <CartBadge /> : null}
=======
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
        </Link>
      ))}
    </nav>
  )
}
