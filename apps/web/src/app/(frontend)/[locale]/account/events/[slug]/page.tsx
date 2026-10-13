import type { Metadata } from 'next'
import Link from 'next/link'
<<<<<<< HEAD
import { eventPlace } from '@/lib/eventLocation'
=======
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { isLocale, localeMeta } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getEventBySlug } from '@/lib/queries'
import { isDoc } from '@/lib/payload'
import { formatEventDate, formatPrice, intlLocales } from '@/lib/format'
import { ticketState, tierOnSale } from '@/lib/tickets'
<<<<<<< HEAD
import { bookingApiUrl } from '@/lib/booking'
=======
import { bookingApiUrl, bookingLabels } from '@/lib/booking'
import { TicketPicker } from '@/components/events/TicketPicker'
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
import { href } from '@/lib/site'
import { MediaImage } from '@/components/ui/MediaImage'
import { Eyebrow, SectionHeading } from '@/components/ui/primitives'

export const dynamicParams = true

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const event = await getEventBySlug(locale, slug)
  return { title: event?.title ?? getDictionary(locale).myBookings, robots: { index: false, follow: false } }
}

/** Event details + tickets inside the My Booking hub. Same data and ticket picker as /events/[slug]. */
export default async function HubEventPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale) || !bookingApiUrl) notFound()
  const event = await getEventBySlug(locale, slug)
  if (!event) notFound()

  const t = getDictionary(locale)
  const date = formatEventDate(event.startsAt, locale)
  const venue = isDoc(event.venue) ? event.venue : null
  const category = isDoc(event.category) ? event.category : null
  const state = ticketState(event)
  const tiers = event.tiers ?? []
  const organizer = isDoc(event.organizer) ? event.organizer : null
<<<<<<< HEAD
  const place = eventPlace(event)
  const fromPrice = tiers.filter((x) => tierOnSale(x)).reduce((m, x) => Math.min(m, x.price), Infinity)
=======
  const hasCoords = venue && typeof venue.latitude === 'number' && typeof venue.longitude === 'number'
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
  const languages = (event.eventLanguage ?? []).filter(isLocale).map((l) => localeMeta[l].nativeLabel)

  return (
    <article className="pb-20">
      <div className="container-max pt-8">
        <Link
          href={href(locale, '/account')}
          className="inline-block font-ui text-meta font-semibold text-fjord hover:underline"
        >
          {t.hubBack}
        </Link>
      </div>
      <div className="container-max grid gap-10 pt-6 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <MediaImage media={event.poster} ratio="4/5" sizes="(min-width: 1024px) 40vw, 100vw" priority />
        </div>
        <div className="lg:col-span-7">
          {category ? <Eyebrow tone="brass">{category.title}</Eyebrow> : null}
          <h1 className="mt-3 text-h1 md:text-display">{event.title}</h1>
          {event.summary ? <p className="mt-5 font-text text-deck text-charcoal">{event.summary}</p> : null}

<<<<<<< HEAD
          <section id="tickets" aria-label={t.tickets} className="mt-8">
            {state === 'onSale' && tiers.length > 0 ? (
              <div className="border border-rule bg-snow p-5 sm:p-6">
                <p className="font-ui text-body">
                  <span className="text-slate">{t.hubFrom}</span>{' '}
                  <span data-testid="from-price" className="font-display text-h3">
                    {fromPrice === 0 ? t.hubFree : formatPrice(fromPrice, event.currency, locale)}
                  </span>
                </p>
                <Link
                  href={href(locale, `/account/events/${event.slug}/tickets`)}
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center bg-fjord px-6 font-ui text-caption font-semibold text-snow hover:bg-fjord-deep"
                >
                  {t.hubGetTickets}
                </Link>
              </div>
=======
          <dl className="mt-8 grid gap-4 border-y border-rule py-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-slate">{t.date}</dt>
              <dd className="mt-1 font-ui text-body font-semibold">
                {event.startsAt ? <time dateTime={event.startsAt}>{date.full}</time> : date.full}
              </dd>
            </div>
            {venue ? (
              <div>
                <dt className="eyebrow text-slate">{t.venue}</dt>
                <dd className="mt-1 font-ui text-body">
                  <span className="font-semibold">{venue.name}</span>, {venue.city}
                </dd>
              </div>
            ) : null}
            {organizer ? (
              <div>
                <dt className="eyebrow text-slate">{t.organizer}</dt>
                <dd className="mt-1 font-ui text-body">{organizer.name}</dd>
              </div>
            ) : null}
            {languages.length ? (
              <div>
                <dt className="eyebrow text-slate">{t.eventLanguage}</dt>
                <dd className="mt-1 font-ui text-body">{languages.join(', ')}</dd>
              </div>
            ) : null}
          </dl>

          <section id="tickets" aria-label={t.tickets} className="mt-10">
            <SectionHeading title={t.tickets} />
            {state === 'onSale' && tiers.length > 0 ? (
              <TicketPicker
                eventId={event.id}
                tiers={tiers.map((tier) => ({
                  tierId: tier.tierId,
                  name: tier.name,
                  description: tier.description,
                  price: tier.price,
                }))}
                currency={event.currency}
                locale={locale}
                intlLocale={intlLocales[locale]}
                termsHref={href(locale, '/terms')}
                privacyHref={href(locale, '/privacy')}
                labels={bookingLabels(t)}
                returnTo="account"
              />
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
            ) : (
              <>
                {tiers.length > 0 ? (
                  <ul className="divide-y divide-rule border-b border-rule">
                    {tiers.map((tier) => {
                      const available = state === 'onSale' && tierOnSale(tier)
                      return (
                        <li key={tier.tierId} className="flex items-baseline justify-between gap-6 py-4">
                          <p className="font-ui text-body font-semibold">{tier.name}</p>
                          <div className="text-right">
                            <p className="font-display text-h3">{formatPrice(tier.price, event.currency, locale)}</p>
                            <p className={`meta ${available ? '' : 'text-alert'}`}>
                              {available ? t.incVat : state === 'onSale' ? t.soldOut : t[state]}
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
                <p className="mt-6 font-ui text-caption font-semibold text-alert">
                  {state === 'onSale' ? t.bookingSoon : t[state]}
                </p>
              </>
            )}
          </section>
<<<<<<< HEAD
          <dl className="mt-6 space-y-5 border border-rule bg-snow p-5 sm:p-6">
            {venue || place ? (
              <div>
                <dt className="font-ui text-caption font-semibold">{t.hubLocation}</dt>
                <dd className="mt-2 font-ui text-body text-charcoal">
                  <span className="block">{place?.name || venue?.name}</span>
                  <span className="block whitespace-pre-line">{place?.address || venue?.address || venue?.city}</span>
                </dd>
              </div>
            ) : null}
            <div className="border-t border-rule pt-5">
              <dt className="font-ui text-caption font-semibold">{t.date}</dt>
              <dd className="mt-2 font-ui text-body text-charcoal">
                {event.startsAt ? <time dateTime={event.startsAt}>{date.full}</time> : date.full}
              </dd>
            </div>
            {organizer ? (
              <div className="border-t border-rule pt-5">
                <dt className="font-ui text-caption font-semibold">{t.organizer}</dt>
                <dd className="mt-2 font-ui text-body text-charcoal">{organizer.name}</dd>
              </div>
            ) : null}
            {languages.length ? (
              <div className="border-t border-rule pt-5">
                <dt className="font-ui text-caption font-semibold">{t.eventLanguage}</dt>
                <dd className="mt-2 font-ui text-body text-charcoal">{languages.join(', ')}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
      {venue || place ? (
        <section className="container-max mt-14" aria-label={t.venue}>
          <SectionHeading title={t.venue} as="h2" />
          <p className="font-ui text-body font-semibold">{place?.name || venue?.name}</p>
          <p className="meta mt-1 whitespace-pre-line">{place?.address || venue?.address}</p>
          {venue?.accessInfo ? <p className="mt-3 max-w-prose text-caption text-charcoal">{venue.accessInfo}</p> : null}
          {place ? (
            <>
              <iframe
                title={place.name || event.title}
                loading="lazy"
                className="mt-4 h-72 w-full max-w-3xl border border-rule"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng - 0.006}%2C${place.lat - 0.004}%2C${place.lng + 0.006}%2C${place.lat + 0.004}&layer=mapnik&marker=${place.lat}%2C${place.lng}`}
              />
              <a
                href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}`}
=======
        </div>
      </div>
      {venue ? (
        <section className="container-max mt-14" aria-label={t.venue}>
          <SectionHeading title={t.venue} as="h2" />
          <p className="font-ui text-body font-semibold">{venue.name}</p>
          <p className="meta mt-1 whitespace-pre-line">{venue.address}</p>
          {venue.accessInfo ? <p className="mt-3 max-w-prose text-caption text-charcoal">{venue.accessInfo}</p> : null}
          {hasCoords ? (
            <>
              <iframe
                title={venue.name}
                loading="lazy"
                className="mt-4 h-72 w-full max-w-3xl border border-rule"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${venue.longitude! - 0.006}%2C${venue.latitude! - 0.004}%2C${venue.longitude! + 0.006}%2C${venue.latitude! + 0.004}&layer=mapnik&marker=${venue.latitude}%2C${venue.longitude}`}
              />
              <a
                href={`https://www.openstreetmap.org/?mlat=${venue.latitude}&mlon=${venue.longitude}#map=16/${venue.latitude}/${venue.longitude}`}
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block font-ui text-meta font-semibold text-fjord hover:underline"
              >
                {t.getDirections}
              </a>
            </>
<<<<<<< HEAD
          ) : venue?.mapUrl ? (
=======
          ) : venue.mapUrl ? (
>>>>>>> b87107647cd1012898a78fa40acd2c290fe3c975
            <a href={venue.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-ui text-meta font-semibold text-fjord hover:underline">
              {t.getDirections}
            </a>
          ) : null}
        </section>
      ) : null}
      {event.description ? (
        <div className="container-max mt-14 lg:max-w-3xl">
          <RichText data={event.description} className="prose-article" />
        </div>
      ) : null}
    </article>
  )
}
