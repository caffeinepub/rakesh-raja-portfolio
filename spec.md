# Rakesh Raja Portfolio

## Current State
The dashboard has save functions for Profile, Contact, Education, Experience, Skills, and Projects. The portfolio detects changes by listening to `visibilitychange` events and polling every 15 seconds — so changes made in the dashboard only show up in the portfolio after the user manually switches tabs or waits up to 15s.

## Requested Changes (Diff)

### Add
- BroadcastChannel messaging: after every successful save in Dashboard (profile, contact, education, experience save/update/delete, skill save/update/delete, project save/update/delete), post a `{type: 'portfolioDataUpdated'}` message on the `portfolio-sync` channel.
- BroadcastChannel listener in Portfolio (App.tsx): listen on `portfolio-sync` channel and immediately trigger a data re-fetch (increment `refreshTick`) when a message is received.

### Modify
- Dashboard.tsx: add a `notifyPortfolioUpdate()` helper that posts the broadcast message, and call it after every successful save/delete across all sections.
- App.tsx Portfolio component: add a `useEffect` that opens a `BroadcastChannel('portfolio-sync')` listener and increments `refreshTick` on any message received.

### Remove
- Nothing removed — existing visibilitychange + polling logic stays as-is as fallback.

## Implementation Plan
1. In Dashboard.tsx, add `notifyPortfolioUpdate` helper using `BroadcastChannel('portfolio-sync')` that posts `{type: 'portfolioDataUpdated'}`.
2. Call `notifyPortfolioUpdate()` at the end of every successful save/delete: `handleSaveProfile` (on ok), `handleSaveContact` (on ok), `handleSaveEdu`, `handleDeleteEdu`, `handleSaveExp`, `handleDeleteExp`, `handleSaveSkill`, `handleUpdateSkill`, `handleDeleteSkill`, `handleSaveProj`, `handleDeleteProj`.
3. In App.tsx Portfolio component, add a `useEffect` that opens `new BroadcastChannel('portfolio-sync')`, listens for messages, and calls `setRefreshTick(t => t + 1)`. Cleanup on unmount.
