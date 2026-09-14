import { redirect } from "next/navigation";

// News Edge now lives as a tab on /market. Keep this route alive so old
// links/bookmarks land in the right place instead of 404ing.
export default function NewsRedirect() {
  redirect("/market?tab=news");
}
