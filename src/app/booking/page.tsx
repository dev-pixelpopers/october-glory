import { redirect } from "next/navigation";

/**
 * The booking wizard lives inside the dashboard now (/dashboard/book) so it
 * renders with the sidebar, dashboard header, and theme toggle. This stub
 * keeps old bookmarks and emailed links working.
 */
export default function BookingPage() {
  redirect("/dashboard/book");
}
