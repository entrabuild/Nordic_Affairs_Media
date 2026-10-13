/** Shape of an order as returned by the booking API (`publicOrder` in apps/api). */
export type PublicOrder = {
  ref: string
  status: 'pending' | 'paid' | 'expired' | 'refunded' | 'partially_refunded' | 'cancelled'
  event: { id: string; slug: string; title: string; startsAt: string; venue: string }
  name: string
  email: string
  currency: string
  items: { tierId: string; name: string; unitPrice: number; quantity: number }[]
  subtotal: number
  discount: number
  fees: number
<<<<<<< HEAD
  servicesTotal?: number
  services?: { smsTickets: boolean; refundProtection: boolean; reminder: boolean }
=======
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
  total: number
  vatAmount: number
  promoCode: string | null
  createdAt: string
  paidAt: string | null
  cancelRequested: boolean
  tickets: {
    code: string
    tier: string
    holder: string
    status: 'valid' | 'checked_in' | 'cancelled'
    qr?: string
  }[]
}

/** Amounts from the API are in minor units (öre / cents). */
export function formatMinor(minor: number, currency: string, intlLocale: string): string {
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: minor % 100 ? 2 : 0,
  }).format(minor / 100)
}
