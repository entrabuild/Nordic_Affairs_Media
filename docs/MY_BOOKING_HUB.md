# My Booking hub (events, tickets, payments)

The existing **My bookings** link in the header (label, look and address `/[locale]/account`) opens one place for
discovering events and buying tickets. Events & Concerts (`/[locale]/events`), the homepage, articles, the header and
the Admin/Staff portals are unchanged. **There is no customer signup or login.**

## Routes (all inside My Booking)

| Address | What it is |
|---|---|
| `/[locale]/account` | **Discover events**: search, date chips, city, categories, list/map, "Coming up" |
| `/[locale]/account/events/[slug]` | Event details, venue map, tickets, promo code, checkout |
| `/[locale]/account?view=tickets` | **My tickets**: the original My Bookings (email one-time code, order history, ticket + receipt PDFs, re-send, cancellation request), unchanged |
| `/[locale]/booking/confirmation` | Stripe success page (unchanged) |

## How buying works now

1. The buyer picks tickets (and optionally applies a promo code; the discount is calculated by the server).
2. They tick the terms box and press **Continue to payment**. No name or email form on our side.
3. **Stripe's secure payment page collects email, name and phone number.**
4. When Stripe confirms the payment (signed webhook, never just the redirect), the website copies those details
   onto the order, issues the QR tickets and emails them. The same email can later open **My tickets** with a one-time code.
5. Free orders (free tickets or a 100% code) never reach Stripe, so only those ask for name and email on our page.
6. If payment is cancelled the buyer returns to the same event page inside My Booking.

The phone number is stored on the order and returned to authorised staff in the event order list (`phone`).

## Why ticket selection failed (diagnosis from the code)

The "+" button is disabled until the booking API answers `GET /events/:id/availability`. If that call failed
(wrong/missing `NEXT_PUBLIC_BOOKING_API_URL` at build time, `ALLOWED_ORIGINS` on Render not matching the Vercel address,
Render free tier still waking up, or the event not in the API's database) the button stayed disabled silently.
A missing `STRIPE_SECRET_KEY` on Render shows "payments unavailable". The picker now shows "Checking availability…",
a clear error with **Try again**, and per-tier "Not on sale".

## What you must configure

**Stripe (payments)**
1. Stripe Dashboard -> Developers -> API keys -> **Secret key** (`sk_test_...` first, `sk_live_...` later).
2. Developers -> Webhooks -> Add endpoint `https://<your-render-api>/webhooks/stripe` with events
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`,
   `checkout.session.expired`, `charge.refunded`. Copy the **Signing secret** (`whsec_...`).
3. Render -> nam-api -> Environment: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Redeploy.
4. `https://<api>/health` must show `"payments": true`. Test card `4242 4242 4242 4242`.

**Render API:** `ALLOWED_ORIGINS` = your Vercel address (https, no trailing slash; several allowed, comma separated).
**Vercel:** `NEXT_PUBLIC_BOOKING_API_URL` = the Render API address, then redeploy (baked in at build time).
**Email:** `RESEND_API_KEY` and `EMAIL_FROM` (domain verified in Resend) - needed for ticket emails and the My tickets code.
**Map pins:** enter each venue's real latitude and longitude in the CMS; events without them stay in the list only.

## Notes

- Promo codes are validated server-side: dates, event, usage limit, minimum spend, maximum discount, per-buyer limit
  (the per-buyer limit only applies where the email is known before payment, i.e. free orders).
- Gift cards and a cash/stored-value wallet are not built (they need a separate approval).
- Organiser names are not publicly searchable; search covers title, summary, venue, city and line-up names.
- Swedish, Tamil and Malayalam text is a draft for native review.

## Deploy and roll back

Deploy: push to GitHub (Vercel rebuilds the website), redeploy the Render API, set the variables above.
Roll back: redeploy the previous Git commit on both. No existing data was modified; no migration involved.
