import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbHealth = await checkDatabaseHealth();

  return NextResponse.json({
    status: "ok",
    service: "Shramik API Gateway",
    timestamp: new Date().toISOString(),
    database: {
      status: dbHealth.status,
      host: dbHealth.host || "unknown",
      latencyMs: dbHealth.latencyMs || 0,
    },
    version: "2.0.0",
  });
}
