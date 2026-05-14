import { query } from "../../../packages/db/src/index";

async function clearData() {
  try {
    console.log("Deleting data from junction tables...");
    await query("DELETE FROM tiktaktuk.order_promotion;");
    await query("DELETE FROM tiktaktuk.has_relationship;"); // Delete seat mappings too
    
    console.log("Deleting tickets...");
    await query("DELETE FROM tiktaktuk.ticket;");
    
    console.log("Deleting orders...");
    await query("DELETE FROM tiktaktuk.orders;");
    
    console.log("Resetting quotas and usage counts...");
    // Optional but recommended: reset usage_count to 0
    await query("UPDATE tiktaktuk.promotion SET usage_count = 0;");
    // We don't reset ticket_category quota because we don't know the original value, 
    // but usually users just want to clear the transaction history.
    
    console.log("All order-related data has been cleared.");
  } catch (error) {
    console.error("Error clearing data:", error);
  } finally {
    process.exit(0);
  }
}

clearData();
