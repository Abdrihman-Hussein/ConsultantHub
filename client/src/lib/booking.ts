import type { Appointment } from '../types';

/**
 * Booking rules, kept separate from React so they can be reasoned about (and
 * tested) on their own. These encode what a real backend would enforce.
 */

export interface SlotRequest {
  consultantId: string
  date: string
  startTime: string
  endTime: string
}

/**
 * Whether the requested slot collides with an existing booking.
 *
 * Cancelled sessions free their slot again; pending and confirmed ones do not.
 * This is the conflict detection the v2 backend would own.
 */
export function isSlotTaken(
  appointments: Appointment[],
  request: SlotRequest,
  ignoreId?: string,
): boolean {
  return appointments.some((appointment) => {
    if (appointment.id === ignoreId) return false;
    if (appointment.consultantId !== request.consultantId) return false;
    if (appointment.date !== request.date) return false;
    if (appointment.status === 'CANCELLED') return false;

    // Half-open interval comparison: touching endpoints (11:00 and 11:00) do
    // not count as overlapping, so back-to-back bookings are allowed.
    return request.startTime < appointment.endTime && request.endTime > appointment.startTime;
  });
}

/** Booked times for one consultant on one date, for disabling slots in the UI. */
export function bookedTimes(
  appointments: Appointment[],
  consultantId: string,
  date: string,
): string[] {
  return appointments
    .filter(
      (appointment) =>
        appointment.consultantId === consultantId &&
        appointment.date === date &&
        appointment.status !== 'CANCELLED',
    )
    .map((appointment) => appointment.startTime);
}

/**
 * Whether a date can still be booked. Slots are 09:00–17:00 in 90-minute
 * increments; the final slot of the day must finish by 17:00.
 */
export function generateSlots(durationMinutes: number, booked: string[] = []): string[] {
  const slots: string[] = []
  const openHour = 9
  const closeHour = 17

  for (let start = openHour * 60; start + durationMinutes <= closeHour * 60; start += 90) {
    const hours = String(Math.floor(start / 60)).padStart(2, '0')
    const minutes = String(start % 60).padStart(2, '0')
    const time = `${hours}:${minutes}`
    if (!booked.includes(time)) slots.push(time)
  }

  return slots;
}

/** The next `count` weekdays, as ISO dates, starting tomorrow. */
export function upcomingDays(count = 5): string[] {
  const days: string[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() + 1)

  while (days.length < count) {
    const weekday = cursor.getDay()
    if (weekday !== 0 && weekday !== 6) {
      const month = String(cursor.getMonth() + 1).padStart(2, '0')
      const day = String(cursor.getDate()).padStart(2, '0')
      days.push(`${cursor.getFullYear()}-${month}-${day}`)
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return days;
}
