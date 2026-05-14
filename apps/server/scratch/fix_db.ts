import { query } from "../../../packages/db/src/index";

async function fixSchema() {
  try {
    console.log("Checking PROMOTION table for usage_count...");
    const checkPromo = await query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'tiktaktuk' AND table_name = 'promotion' AND column_name = 'usage_count';");
    
    if (checkPromo.rowCount === 0) {
      console.log("Adding usage_count to PROMOTION table...");
      await query("ALTER TABLE tiktaktuk.promotion ADD COLUMN usage_count INTEGER DEFAULT 0;");
    } else {
      console.log("usage_count already exists.");
    }
    
    console.log("Schema fix completed.");
  } catch (error) {
    console.error("Error fixing schema:", error);
  } finally {
    process.exit(0);
  }
}

fixSchema();
