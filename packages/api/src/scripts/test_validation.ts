import "dotenv/config";
import { orderRouter } from "../routers/order.router";
import { query } from "@wagyu-a5/db";

async function test() {
  const ctx: any = {
    session: {
      user: {
        id: "e4d5f6a7-b8c9-4d0e-1f2a-000000001001", // Customer Budi
        role: "CUSTOMER",
      }
    }
  };

  const caller = orderRouter.order.createCaller(ctx);

  console.log("--- TEST 1: Existence ---");
  try {
    await caller.createForCurrentUser({
      totalAmount: 100000,
      promoCode: "INVALID_CODE",
      ticketCount: 1,
      categoryId: "a1c2d3e4-f5a6-4b7c-8d9e-000000000101", // K-Pop
    });
  } catch (e: any) {
    console.log("Result:", e.message);
  }

  console.log("\n--- TEST 2: Usage Limit ---");
  try {
    await caller.createForCurrentUser({
      totalAmount: 100000,
      promoCode: "TESTING", // Limit 20, Count 15
      ticketCount: 10,
      categoryId: "a1c2d3e4-f5a6-4b7c-8d9e-000000000101", // K-Pop
    });
  } catch (e: any) {
    console.log("Result:", e.message);
  }

  console.log("\n--- TEST 3: Date Validity (Too Late) ---");
  try {
    await caller.createForCurrentUser({
      totalAmount: 100000,
      promoCode: "FLASH20", // Ends May 14
      ticketCount: 1,
      categoryId: "a1c2d3e4-f5a6-4b7c-8d9e-000000000101", // K-Pop (June 9)
    });
  } catch (e: any) {
    console.log("Result:", e.message);
  }

  console.log("\n--- TEST 4: Date Validity (Too Early) ---");
  try {
    await caller.createForCurrentUser({
      totalAmount: 100000,
      promoCode: "MIDYEAR15", // Starts May 31
      ticketCount: 1,
      categoryId: "394e86e4-0ca2-488b-acd7-f2ffeff506dd", // Besok Konser (May 13)
    });
  } catch (e: any) {
    console.log("Result:", e.message);
  }

  process.exit(0);
}

test();
