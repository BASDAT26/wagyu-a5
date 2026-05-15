import { pool } from "./packages/db/src/index.js";
pool
  .query(
    "SELECT column_name FROM information_schema.columns WHERE table_schema='tiktaktuk' AND table_name='venue'",
  )
  .then((res) => {
    console.log(res.rows);
    process.exit(0);
  });
