# Rakesh Raja Portfolio

## Current State
A full portfolio site with an admin dashboard at `/dashboard`. Dashboard allows editing Profile, Contact, Education, Experience, Skills, and Projects. The portfolio loads data from the backend once on component mount. Despite backend saves working correctly, changes made in the dashboard were not reflecting in the portfolio because:
- The `useEffect` that loads backend data only re-runs when `fullActor` or `isFetching` changes
- If the user updates dashboard in the same session (or same tab), the portfolio's `useEffect` never re-fires
- Profile/Contact optional field mapping used truthy checks that could skip valid updates

## Requested Changes (Diff)

### Add
- `refreshTick` state in the Portfolio component that increments on `document.visibilitychange` (when tab regains focus) and every 15 seconds via interval
- `refreshTick` added to the `useEffect` dependency array so data reloads whenever the user comes back to the portfolio tab

### Modify
- Profile and Contact field mapping: replace `if (ps.field)` truthy checks with `|| fallback` pattern so backend values always override defaults when a save has been made
- `useEffect` dependency array: add `refreshTick` to trigger re-fetch on visibility change

### Remove
- Nothing removed

## Implementation Plan
1. Add `refreshTick` useState and a `useEffect` that listens for `visibilitychange` and sets a 15s interval — both increment `refreshTick`
2. In the data-loading `useEffect`, add `void refreshTick;` to reference it (satisfies linter) and add it to dependency array
3. Fix profile field mapping to use `ps.field || prev` instead of `if (ps.field)`
4. Fix contact field mapping the same way
