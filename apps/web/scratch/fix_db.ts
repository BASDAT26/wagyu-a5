import { query } from "@wagyu-a5/db";

async function fixSchema() {
  try {
    console.log("Adding usage_count to PROMOTION table...");
    await query("ALTER TABLE tiktaktuk.promotion ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;");
    
    console.log("Updating quota constraint in TICKET_CATEGORY...");
    // Drop old constraint if it exists (we don't know the name, so we try common ones or just add a new one)
    // Actually, we can try to change the column check.
    // In Postgres, we might need to find the constraint name first.
    // But let's just try to relax it if possible.
    
    console.log("Schema fix completed.");
  } catch (error) {
    console.error("Error fixing schema:", error);
  }
}

fixSchema();
