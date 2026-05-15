import { query } from "../../../packages/db/src/index";

async function checkData() {
  try {
    const promos = await query(
      "SELECT promotion_id, promo_code, usage_limit, usage_count, start_date, end_date FROM tiktaktuk.promotion;",
    );
    console.log("PROMOTIONS:");
    console.table(promos.rows);

    const categories = await query(
      "SELECT tc.category_id, tc.quota, e.event_id, e.event_datetime, e.event_title FROM tiktaktuk.ticket_category tc JOIN tiktaktuk.event e ON tc.tevent_id = e.event_id;",
    );
    console.log("\nCATEGORIES & EVENTS:");
    console.table(categories.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    process.exit(0);
  }
}

checkData();
