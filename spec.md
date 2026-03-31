# Rakesh Raja Portfolio

## Current State
Full portfolio site with hero section, experience, skills, projects (Behance integrated), education, contact, and client reviews. Backend stores reviews with submit/get functions. Visit tracking exists in backend.

## Requested Changes (Diff)

### Add
- Admin dashboard at `/dashboard` route (separate page, does not affect main portfolio)
- PIN-based login screen (default PIN: rakesh2025)
- Dashboard tabs: Reviews Manager, Visit Stats, Change PIN
- Reviews Manager: view all reviews, delete any review
- Visit Stats: total visits, daily breakdown chart
- Change PIN: update admin PIN

### Modify
- Backend: add `verifyAdmin`, `setAdminPin`, `deleteReview` functions
- backend.d.ts: update with new function signatures
- App.tsx: add route `/dashboard` → Dashboard component (keep main portfolio untouched)

### Remove
- Nothing removed from main portfolio

## Implementation Plan
1. Update backend (done)
2. Update backend.d.ts with new functions
3. Create Dashboard.tsx component with PIN login + tabs
4. Update App.tsx to add /dashboard route
