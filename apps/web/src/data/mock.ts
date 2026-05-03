// [REFACTOR] Centralized mock data — previously duplicated across
// create-event.tsx, update-event.tsx, and read-event.tsx
//
// TODO: Replace with real API calls when backend endpoints are ready.

export const MOCK_ARTISTS = [
  "Fourtwenty",
  "Hindia",
  "Tulus",
  "Nadin Amizah",
  "Pamungkas",
  "Raisa",
] as const;

export const MOCK_VENUES = [
  { id: "1", name: "Jakarta Convention Center" },
  { id: "2", name: "Taman Impian Jayakarta" },
  { id: "3", name: "Bandung Hall Center" },
] as const;

/** Flat list of venue names for filter dropdowns */
export const MOCK_VENUE_NAMES = MOCK_VENUES.map((v) => v.name);
