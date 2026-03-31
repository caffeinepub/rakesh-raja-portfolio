# Rakesh Raja Portfolio

## Current State
- Admin dashboard at /dashboard with PIN auth (rakesh2025)
- Reviews stored in Map.empty (volatile — lost on canister restart)
- Admin can view/delete reviews, see visit stats, change PIN
- Portfolio content (experience, skills, projects) is hardcoded in App.tsx

## Requested Changes (Diff)

### Add
- Stable storage for reviews so they survive canister restarts/upgrades
- Backend support for managing Experience entries (add/update/delete)
- Backend support for managing Skills (add/delete)
- Backend support for managing Project entries (add/update/delete)
- Admin dashboard tabs: Experience, Skills, Projects with full CRUD UI

### Modify
- Backend main.mo: convert reviews map to stable storage using stable var arrays
- Dashboard.tsx: add Experience, Skills, Projects tabs
- App.tsx: load experience, skills, projects from backend if available (fallback to hardcoded defaults)

### Remove
- Nothing removed

## Implementation Plan
1. Update main.mo to use stable var for reviews (stable var reviewsData: [(Nat, Review)])
2. Add Experience, Skill, Project types and stable storage in backend
3. Add CRUD functions for each content type
4. Update backend.d.ts to match new APIs
5. Update Dashboard.tsx with new management tabs
6. Update App.tsx to optionally load dynamic content from backend
