// Shared SWR key constants. Using the same string literal across every
// component that reads the same endpoint lets SWR's cache dedupe requests
// and propagate updates between them automatically (one component's `mutate`
// call updates every other component subscribed to the same key).
export const NOTIF_KEY = "/notifications/recent/";
export const PROFILE_KEY = "/profile/";
