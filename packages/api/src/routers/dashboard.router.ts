import { TRPCError } from "@trpc/server";
import { query } from "@wagyu-a5/db";
import { protectedProcedure, router } from "../index";

type OrganizerEventRow = {
  event_title: string;
  venue_name: string;
  total_quota: number | string | null;
  tickets_sold: number | string | null;
};

type CustomerTicketRow = {
  event_title: string;
  event_datetime: string | Date;
  venue_name: string;
  category_name: string;
};

export const dashboardRouter = router({
  summary: protectedProcedure.query(async ({ ctx }) => {
    const userRole = ctx.session.user.role;
    const userId = ctx.session.user.id;
    const fallbackName = ctx.session.user.name;
    const fallbackEmail = ctx.session.user.email;

    if (userRole === "ADMIN") {
      const summary = await getAdminSummary();
      return {
        ...summary,
        user: buildUserSummary(userId, userRole, fallbackName, fallbackEmail, fallbackName),
      };
    }

    if (userRole === "ORGANIZER") {
      return getOrganizerSummary(userId, fallbackName, fallbackEmail);
    }

    if (userRole === "CUSTOMER") {
      return getCustomerSummary(userId, fallbackName, fallbackEmail);
    }

    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Unsupported role",
    });
  }),
});

async function getAdminSummary() {
  const [
    usersRes,
    eventsRes,
    revenueRes,
    activePromosRes,
    venueRes,
    reservedVenueRes,
    promoBreakdownRes,
  ] = await Promise.all([
    query<{ total_users: number }>(
      "SELECT COUNT(*)::int AS total_users FROM tiktaktuk.user_account",
    ),
    query<{ total_events: number }>("SELECT COUNT(*)::int AS total_events FROM tiktaktuk.event"),
    query<{ platform_revenue: number | string }>(
      "SELECT COALESCE(SUM(total_amount), 0) AS platform_revenue FROM tiktaktuk.orders",
    ),
    query<{ active_promotions: number }>(
      "SELECT COUNT(*)::int AS active_promotions FROM tiktaktuk.promotion WHERE start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE",
    ),
    query<{ total_venues: number; max_capacity: number }>(
      "SELECT COUNT(*)::int AS total_venues, COALESCE(MAX(capacity), 0)::int AS max_capacity FROM tiktaktuk.venue",
    ),
    query<{ reserved_venues: number }>(
      "SELECT COUNT(DISTINCT venue_id)::int AS reserved_venues FROM tiktaktuk.seat",
    ),
    query<{ percentage_count: number; nominal_count: number; total_usage: number }>(
      "SELECT COUNT(*) FILTER (WHERE discount_type = 'PERCENTAGE')::int AS percentage_count, COUNT(*) FILTER (WHERE discount_type = 'NOMINAL')::int AS nominal_count, COALESCE(SUM(usage_count), 0)::int AS total_usage FROM tiktaktuk.promotion",
    ),
  ]);

  const platformRevenue = Number(revenueRes.rows[0]?.platform_revenue ?? 0);

  return {
    role: "ADMIN" as const,
    stats: {
      totalUsers: usersRes.rows[0]?.total_users ?? 0,
      totalEvents: eventsRes.rows[0]?.total_events ?? 0,
      platformRevenue,
      activePromotions: activePromosRes.rows[0]?.active_promotions ?? 0,
      totalVenues: venueRes.rows[0]?.total_venues ?? 0,
      reservedVenues: reservedVenueRes.rows[0]?.reserved_venues ?? 0,
      maxVenueCapacity: venueRes.rows[0]?.max_capacity ?? 0,
      promoPercentageCount: promoBreakdownRes.rows[0]?.percentage_count ?? 0,
      promoNominalCount: promoBreakdownRes.rows[0]?.nominal_count ?? 0,
      promoTotalUsage: promoBreakdownRes.rows[0]?.total_usage ?? 0,
    },
  };
}

async function getOrganizerSummary(userId: string, fallbackName: string, fallbackEmail: string) {
  const organizerRes = await query<{ organizer_id: string; organizer_name: string | null }>(
    "SELECT organizer_id, organizer_name FROM tiktaktuk.organizer WHERE user_id = $1 LIMIT 1",
    [userId],
  );
  const organizerId = organizerRes.rows[0]?.organizer_id;
  const organizerName = organizerRes.rows[0]?.organizer_name ?? null;
  const displayName = organizerName ?? fallbackName;

  if (!organizerId) {
    return {
      role: "ORGANIZER" as const,
      user: buildUserSummary(userId, "ORGANIZER", fallbackName, fallbackEmail, displayName),
      stats: {
        activeEvents: 0,
        ticketsSold: 0,
        revenue: 0,
        venuePartners: 0,
      },
      events: [],
    };
  }

  const [eventsRes, ticketsRes, revenueRes, venueRes, eventListRes] = await Promise.all([
    query<{ active_events: number }>(
      "SELECT COUNT(*)::int AS active_events FROM tiktaktuk.event WHERE organizer_id = $1",
      [organizerId],
    ),
    query<{ tickets_sold: number }>(
      "SELECT COUNT(*)::int AS tickets_sold FROM tiktaktuk.ticket t JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id WHERE e.organizer_id = $1",
      [organizerId],
    ),
    query<{ revenue: number | string }>(
      "SELECT COALESCE(SUM(o.total_amount), 0) AS revenue FROM (SELECT DISTINCT o.order_id, o.total_amount FROM tiktaktuk.orders o JOIN tiktaktuk.ticket t ON t.torder_id = o.order_id JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id WHERE e.organizer_id = $1) o",
      [organizerId],
    ),
    query<{ venue_partners: number }>(
      "SELECT COUNT(DISTINCT venue_id)::int AS venue_partners FROM tiktaktuk.event WHERE organizer_id = $1",
      [organizerId],
    ),
    query<OrganizerEventRow>(
      "SELECT e.event_title, v.venue_name, COALESCE(SUM(tc.quota), 0) AS total_quota, COALESCE(COUNT(t.ticket_id), 0) AS tickets_sold FROM tiktaktuk.event e JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id LEFT JOIN tiktaktuk.ticket_category tc ON tc.tevent_id = e.event_id LEFT JOIN tiktaktuk.ticket t ON t.tcategory_id = tc.category_id WHERE e.organizer_id = $1 GROUP BY e.event_id, e.event_title, v.venue_name, e.event_datetime ORDER BY e.event_datetime DESC LIMIT 3",
      [organizerId],
    ),
  ]);

  const events = eventListRes.rows.map((row) => {
    const totalQuota = Number(row.total_quota ?? 0);
    const ticketsSold = Number(row.tickets_sold ?? 0);
    const soldPercent = totalQuota > 0 ? Math.round((ticketsSold / totalQuota) * 100) : 0;
    return {
      title: row.event_title,
      soldPercent,
      location: row.venue_name,
    };
  });

  return {
    role: "ORGANIZER" as const,
    user: buildUserSummary(userId, "ORGANIZER", fallbackName, fallbackEmail, displayName),
    stats: {
      activeEvents: eventsRes.rows[0]?.active_events ?? 0,
      ticketsSold: ticketsRes.rows[0]?.tickets_sold ?? 0,
      revenue: Number(revenueRes.rows[0]?.revenue ?? 0),
      venuePartners: venueRes.rows[0]?.venue_partners ?? 0,
    },
    events,
  };
}

async function getCustomerSummary(userId: string, fallbackName: string, fallbackEmail: string) {
  const customerRes = await query<{ customer_id: string; full_name: string | null }>(
    "SELECT customer_id, full_name FROM tiktaktuk.customer WHERE user_id = $1 LIMIT 1",
    [userId],
  );
  const customerId = customerRes.rows[0]?.customer_id;
  const customerName = customerRes.rows[0]?.full_name ?? null;
  const displayName = customerName ?? fallbackName;

  if (!customerId) {
    return {
      role: "CUSTOMER" as const,
      user: buildUserSummary(userId, "CUSTOMER", fallbackName, fallbackEmail, displayName),
      stats: {
        activeTickets: 0,
        eventsJoined: 0,
        availablePromos: 0,
        totalSpend: 0,
      },
      upcomingTickets: [],
    };
  }

  const [activeTicketsRes, eventsJoinedRes, promoRes, spendRes, upcomingTicketsRes] =
    await Promise.all([
      query<{ active_tickets: number }>(
        "SELECT COUNT(*)::int AS active_tickets FROM tiktaktuk.ticket t JOIN tiktaktuk.orders o ON t.torder_id = o.order_id WHERE o.customer_id = $1 AND t.status = 'VALID'",
        [customerId],
      ),
      query<{ events_joined: number }>(
        "SELECT COUNT(DISTINCT e.event_id)::int AS events_joined FROM tiktaktuk.ticket t JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id JOIN tiktaktuk.orders o ON t.torder_id = o.order_id WHERE o.customer_id = $1",
        [customerId],
      ),
      query<{ available_promos: number }>(
        "SELECT COUNT(*)::int AS available_promos FROM tiktaktuk.promotion WHERE start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE",
      ),
      query<{ total_spend: number | string }>(
        "SELECT COALESCE(SUM(total_amount), 0) AS total_spend FROM tiktaktuk.orders WHERE customer_id = $1",
        [customerId],
      ),
      query<CustomerTicketRow>(
        "SELECT e.event_title, e.event_datetime, v.venue_name, tc.category_name FROM tiktaktuk.ticket t JOIN tiktaktuk.ticket_category tc ON t.tcategory_id = tc.category_id JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id JOIN tiktaktuk.venue v ON e.venue_id = v.venue_id JOIN tiktaktuk.orders o ON t.torder_id = o.order_id WHERE o.customer_id = $1 AND e.event_datetime >= NOW() ORDER BY e.event_datetime ASC LIMIT 2",
        [customerId],
      ),
    ]);

  const upcomingTickets = upcomingTicketsRes.rows.map((row) => ({
    title: row.event_title,
    tag: row.category_name,
    date:
      row.event_datetime instanceof Date ? row.event_datetime.toISOString() : row.event_datetime,
    location: row.venue_name,
  }));

  return {
    role: "CUSTOMER" as const,
    user: buildUserSummary(userId, "CUSTOMER", fallbackName, fallbackEmail, displayName),
    stats: {
      activeTickets: activeTicketsRes.rows[0]?.active_tickets ?? 0,
      eventsJoined: eventsJoinedRes.rows[0]?.events_joined ?? 0,
      availablePromos: promoRes.rows[0]?.available_promos ?? 0,
      totalSpend: Number(spendRes.rows[0]?.total_spend ?? 0),
    },
    upcomingTickets,
  };
}

function buildUserSummary(
  userId: string,
  role: "ADMIN" | "ORGANIZER" | "CUSTOMER" | null | undefined,
  name: string,
  email: string,
  displayName: string,
) {
  return {
    id: userId,
    role: role ?? "CUSTOMER",
    name,
    email,
    displayName,
  };
}
