# CamCine — Dashboard Developer Tasks
> React + Vite dashboard (the `dashboard/` project)
> All API calls go to `VITE_API_BASE_URL` via `src/services/api.js`

---

## Context

The dashboard already has most **UI sections built** but many of them show **hardcoded mock data** instead of real API data. Your job is two things:

1. **Wire existing sections to real API endpoints** (replacing mock data)
2. **Build missing sections** that are referenced in the nav but not yet functional

---

## Part A — Wire Existing Sections to Real APIs

These sections exist and look good visually but their data is fake. Once the backend builds the APIs, connect them.

---

### A1. `DashboardSection.jsx` — Revenue Chart & Activity Feed

**Current problem:**
- Revenue chart uses hardcoded `revenueData` array (Jan–Oct, not real)
- Activity feed uses hardcoded `activity` array
- Stat cards only pull Total Titles and Users — Revenue and Tickets are missing

**What to do:**

1. Add a new service call to `GET /api/v1/analytics/overview?period=30d`
2. Replace the hardcoded `revenueData` with `data.revenue_trend` from the response
3. Replace the hardcoded `activity` array with `GET /api/v1/activity-log` (latest 5 events)
4. Wire the "Open Tickets" stat card to `GET /api/v1/support/tickets` count

**New service to add in `src/services/analytics.js`:**
```js
export const analyticsService = {
  getOverview: (period = '30d') => apiClient.get('/analytics/overview', { period }),
};
```

---

### A2. `AnalyticsSection.jsx` — Replace 12-Request Pattern

**Current problem:**
- Makes 12+ individual API calls to `/movies`, `/users`, `/views/content/:id/stats` etc.
- Stitches data client-side — slow and fragile
- Charts fall back to hardcoded `revenueData`

**What to do:**

1. Replace ALL the parallel fetches with a single call: `GET /analytics/overview?period=X`
2. Wire the period selector (`7d / 30d / 90d / 1y`) to pass as a query param
3. Map response fields to chart data:
   - `data.views_trend` → views area chart
   - `data.revenue_trend` → revenue bar chart
   - `data.top_content` → top content table
   - `data.content_type_breakdown` → pie chart
   - `data.user_growth` → users line chart
4. Remove all the `Promise.allSettled` loops — they are no longer needed

---

### A3. `SubscriptionsSection.jsx` — Connect to Real API

**Current problem:**
- Uses `const subs = [...]` hardcoded array at the top of the file
- Plan cards are also hardcoded
- No API calls anywhere in the component

**What to do:**

1. Add `src/services/subscriptions.js`:
```js
export const subscriptionService = {
  getPlans:  ()      => apiClient.get('/subscriptions/plans'),
  getAll:    (params) => apiClient.get('/subscriptions', params),
  getStats:  ()      => apiClient.get('/subscriptions/stats'),
  cancel:    (id)    => apiClient.patch(`/subscriptions/${id}/cancel`),
  pause:     (id)    => apiClient.patch(`/subscriptions/${id}/pause`),
  resume:    (id)    => apiClient.patch(`/subscriptions/${id}/resume`),
};
```

2. In `SubscriptionsSection.jsx`:
   - Replace `const subs = [...]` with `useState([])` + fetch from `GET /subscriptions`
   - Replace hardcoded `plans` array with fetch from `GET /subscriptions/plans`
   - Replace hardcoded stat card values with data from `GET /subscriptions/stats`
   - Wire "Cancel" button to `PATCH /subscriptions/:id/cancel`

---

### A4. `PaymentsSection.jsx` — Connect to Real API

**Current problem:**
- Uses `const mockTxns = [...]` — 100% fake data
- No API calls anywhere

**What to do:**

1. Add `src/services/payments.js`:
```js
export const paymentService = {
  getAll:    (params) => apiClient.get('/payments', params),
  getStats:  ()      => apiClient.get('/payments/stats'),
  getById:   (id)    => apiClient.get(`/payments/${id}`),
  refund:    (id, data) => apiClient.post(`/payments/refund/${id}`, data),
  export:    (params) => apiClient.get('/payments/export', params),
};
```

2. In `PaymentsSection.jsx`:
   - Replace `const mockTxns` with `useState([])` + fetch from `GET /payments`
   - Wire stat cards to `GET /payments/stats`
   - Wire the date range selector to pass `start_date` / `end_date` query params
   - Wire "Export" button to call `GET /payments/export` and trigger file download
   - Add a Refund button/modal per transaction row

---

### A5. `NotificationsSection.jsx` — Connect to Real API

**Current problem:**
- Uses `const mockNotifs = [...]` hardcoded array

**What to do:**

1. Add to `src/services/notifications.js`:
```js
export const notificationService = {
  getAll:    (params)  => apiClient.get('/notifications', params),
  markRead:  (id)      => apiClient.patch(`/notifications/${id}/read`),
  markAll:   ()        => apiClient.patch('/notifications/read-all'),
  remove:    (id)      => apiClient.delete(`/notifications/${id}`),
};
```

2. In `NotificationsSection.jsx`:
   - Replace `const mockNotifs` with `useState([])` + fetch from `GET /notifications`
   - Wire `markRead(id)`, `markAll()`, `clearAll()` to the real API calls
   - Show `unread_count` from the response on the badge

---

### A6. `NewsManagerSection.jsx` — Connect to Real API

**Current problem:**
- No API calls in the component at all

**What to do:**

1. Add `src/services/news.js`:
```js
export const newsService = {
  getAll:    (params) => apiClient.get('/news', params),
  getById:   (id)     => apiClient.get(`/news/${id}`),
  create:    (data)   => apiClient.post('/news', data),
  update:    (id, data) => apiClient.put(`/news/${id}`, data),
  publish:   (id)     => apiClient.patch(`/news/${id}/publish`),
  remove:    (id)     => apiClient.delete(`/news/${id}`),
};
```

2. Wire the article list, create form, publish toggle, and delete buttons.

---

### A7. `SettingsSection.jsx` — Connect to Real API

**What to do:**

1. Add `src/services/settings.js`:
```js
export const settingsService = {
  get:    ()     => apiClient.get('/settings'),
  update: (data) => apiClient.put('/settings', data),
};
```

2. On mount, load settings from `GET /settings` and pre-fill all form fields
3. On save, call `PUT /settings` with changed values

---

### A8. `ManagerEarningsSection.jsx` — Connect to Real API

**What to do:**

1. Fetch from `GET /managers/:managerId/earnings`
2. Map `content_performance` to the earnings breakdown table
3. Map `payout_history` to the payout records list
4. Show `pending_payout` prominently as the "Available to Withdraw" figure

---

### A9. `ActorPortalSection.jsx` / `ActorQueueSection.jsx` — Connect to Real API

**What to do:**

1. Add `src/services/actors.js`:
```js
export const actorService = {
  getAll:        (params) => apiClient.get('/actors', params),
  getById:       (id)     => apiClient.get(`/actors/${id}`),
  getFilmography:(id)     => apiClient.get(`/actors/${id}/filmography`),
  update:        (id, data) => apiClient.put(`/actors/${id}`, data),
};
```

2. `ActorQueueSection` — load pending actor applications from `GET /actors?status=pending`
3. `ActorPortalSection` — load the logged-in actor's own profile and filmography

---

## Part B — Build Missing Dashboard Sections

These sections don't exist yet and need to be created from scratch. Match the existing visual style in `App.css` / `pageStyles.js`.

---

### B1. Watchlist Management Page

**Section name:** `WatchlistSection`
**Nav label:** "Watchlists"
**Role access:** admin, manager

**What to show:**
- Search users by name/email
- When a user is selected, show their watchlist items
- Each item: thumbnail, title, type badge, "Added on" date, remove button

**API calls:**
- `GET /users` (to search users)
- `GET /users/:userId/watchlist`
- `DELETE /users/:userId/watchlist/:contentId`

---

### B2. Content Recommendations Config

**Section name:** `FeaturedContentSection`
**Nav label:** "Featured"
**Role access:** admin

**What to show:**
- Tabs for each section: Trending · New Releases · Featured · Free · Editor's Pick
- Drag-and-drop sortable list of pinned content per section
- "Add content" button → search modal → pin to section
- Remove button per item

**API calls:**
- `GET /content` (for search modal)
- `GET /featured-content?section=trending` (backend will need this)
- `POST /featured-content` (pin content)
- `DELETE /featured-content/:id` (unpin)
- `PATCH /featured-content/reorder` (save new sort order)

---

### B3. Support Tickets Page

**Section name:** `SupportSection`
**Nav label:** "Support"
**Role access:** admin, manager

**What to show:**
- Stat cards: Open · In Progress · Resolved · Urgent
- Filter by status, category, priority
- Ticket list table with: ticket number, user, subject, category, status badge, created date
- Click a ticket → open detail view with full conversation thread
- Reply form at the bottom
- Status change dropdown (Open → In Progress → Resolved)

**API calls:**
```js
supportService.getAll({ status, category, page })
supportService.getById(id)
supportService.reply(id, { body })
supportService.updateStatus(id, { status })
```

---

### B4. Refund Management Page

**Section name:** Within `PaymentsSection` as a new tab "Refunds"

**What to show:**
- List of transactions with status `refunded` or `failed`
- "Issue Refund" button on completed transactions
- Refund modal: reason dropdown + amount field + confirm

**API call:**
- `POST /payments/refund/:id` with `{ reason, amount }`

---

### B5. Search Analytics

**Section name:** Add as a tab inside `AnalyticsSection`

**What to show:**
- Top 20 search queries this week/month
- Queries with zero results (content gap opportunities)

*(Backend will need a `search_log` table to store this — flag to backend dev)*

---

## Part C — Improvements to Existing Sections

These don't need new pages but need specific fixes.

---

### C1. `ContentLibrarySection.jsx`

- Add a **"Processing"** status filter tab so admins can see stuck uploads
- Add **bulk actions**: select multiple → Publish All / Archive All
- Show **video upload status** badge: Draft · Processing · Published · Archived

---

### C2. `UsersSection.jsx`

- Add **Subscription Status** column: show the user's current plan (Basic / Premium / None)
- Add **Last Login** column (needs `last_login_at` on the users table — flag to backend)
- Add **"View Watchlist"** button per user row → navigate to WatchlistSection filtered to that user

---

### C3. `DashboardSection.jsx` (stat cards)

Replace the 4 stat cards to show real metrics:

| Card | Data Source |
|------|-------------|
| Total Titles | `GET /analytics/overview` → `summary.total_titles` |
| Active Users | `GET /analytics/overview` → `summary.active_users` |
| MRR | `GET /subscriptions/stats` → `mrr` |
| Open Tickets | `GET /support/tickets?status=open` → `pagination.total` |

---

### C4. Navigation (`Navigation.jsx`)

Add these new sections to the nav (admin role only):

- Support (🎫)
- Featured Content (⭐)
- Watchlists (🔖)

---

## Summary — What Needs a New Service File

| File | Used By |
|------|---------|
| `src/services/analytics.js` | AnalyticsSection, DashboardSection |
| `src/services/subscriptions.js` | SubscriptionsSection |
| `src/services/payments.js` | PaymentsSection |
| `src/services/notifications.js` | NotificationsSection |
| `src/services/news.js` | NewsManagerSection |
| `src/services/settings.js` | SettingsSection |
| `src/services/actors.js` | ActorPortalSection, ActorQueueSection |
| `src/services/support.js` | SupportSection (new) |

---

## Build Order for Dashboard

1. Wire `SubscriptionsSection` + `PaymentsSection` (highest business impact)
2. Wire `AnalyticsSection` (remove 12-request pattern)
3. Wire `NotificationsSection`
4. Wire `NewsManagerSection` + `SettingsSection`
5. Build `SupportSection` (new page)
6. Wire `ActorPortalSection` / `ActorQueueSection`
7. Build `WatchlistSection` (new page)
8. Build `FeaturedContentSection` (new page)
9. Fix stat cards in `DashboardSection`
10. Improvements: bulk actions, subscription column in users, processing filter in content
