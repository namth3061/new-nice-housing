export const BOOKING_DRAFT_KEY = "nicehousing_booking_draft";

export interface BookingDraft {
  slug: string;
  checkIn: string;
  checkOut?: string;
  guests: number;
}

export function getBookingDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BOOKING_DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as BookingDraft;
    return data && typeof data.slug === "string" ? data : null;
  } catch {
    return null;
  }
}

export function clearBookingDraft(): void {
  try {
    localStorage.removeItem(BOOKING_DRAFT_KEY);
  } catch {}
}
