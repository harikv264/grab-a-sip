# TESTING.md — logging in as each persona

Until phone-OTP (MSG91) is live, use **email + password** test accounts to
experience every persona on the website and the mobile app. This does not depend
on SMS or the invite flow.

## 1. Seed the test users (one time; safe to re-run)

From the `grab-a-sip/` repo root, with your Supabase **service-role** key
available (either in `.env.local` as `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`,
or passed inline):

```bash
node scripts/seed-test-users.mjs
```

`SUPABASE_URL` must be the bare project URL (`https://<ref>.supabase.co`).
The script prints the logins when it finishes. It creates:

| Persona  | Email                     | Password        | Sign in at |
|----------|---------------------------|-----------------|------------|
| Admin    | `testadmin@grabasip.test` | `GrabASip#Test1`| `/admin/login` (web) |
| Rider    | `testrider@grabasip.test` | `GrabASip#Test1`| `/app/login` (web) or the mobile app |
| Customer | `testcustomer@grabasip.test` | `GrabASip#Test1` | `/app/login` (web) or the mobile app |

Override the domain/password with `TEST_EMAIL_DOMAIN` / `TEST_PASSWORD` env vars.

It also seeds a live subscription + a month of deliveries for the test customer,
assigns them to the test rider, and adds two extra "Sample …" stops — so the
customer's month-glass is partly full, the rider has a real route for today, and
the admin dashboard shows data.

## 2. Log in

- **Admin** → `/admin/login`, email + password. Full access to
  customers / subscriptions / deliveries / leads.
- **Rider / Customer** → `/app/login`. Tap **"Use email instead"**, then email +
  password. You're routed to `/rider` or `/me` by role.
- **Mobile app** → on the login screen tap **"Use email instead"** and sign in.
  (Set the app's `EXPO_PUBLIC_*` env to the same Supabase project.)

Roles come from the `app_users` table (`/api/me`); `/admin` stays admin-only, and
rider/customer data is scoped to that user.

## 3. What each persona should show

- **Customer (`/me`)** — hero juice-glass filling toward 26 boxes, animated
  stats, per-subscription mini-glasses, upcoming + recent deliveries.
- **Rider (`/rider`)** — today's-route glass, count-up stats, and the route
  timeline with status-coloured stops; advancing a stop updates it live.
- **Admin (`/admin`)** — KPI cards with sparklines, demand bars, recent checks,
  and the full customers/subscriptions/deliveries console.

## 4. Cleaning up

Delete the three `@grabasip.test` users in Supabase → Authentication, and remove
the seeded rows (tagged `TEST DATA`, phones `+9190000000xx`) from `customers`,
`delivery_persons`, `subscriptions`, `deliveries`, `app_users`.

## Notes

- These are throwaway test credentials for a test project — fine to keep in the
  repo. Never commit real user credentials or the service-role key.
- Real customers/riders are still created by the admin (invite / provisioning);
  this path is purely for testing the experience.
