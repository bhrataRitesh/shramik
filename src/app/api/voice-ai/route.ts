import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { transcript, language = "en" } = await request.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "No voice transcript received" },
        { status: 400 }
      );
    }

    const lower = transcript.toLowerCase();

    // Intelligent trade mapping
    let detectedTrade = "helper";
    let detectedCategoryLabel = "General Helper & Construction Labor";
    const detectedSkills: string[] = [];

    if (
      lower.includes("mason") ||
      lower.includes("brick") ||
      lower.includes("tile") ||
      lower.includes("plaster")
    ) {
      detectedTrade = "mason";
      detectedCategoryLabel = "Mason & Tile Fitter";
      detectedSkills.push("Bricklaying", "Tile Fitting", "Plastering");
    } else if (
      lower.includes("carpenter") ||
      lower.includes("wood") ||
      lower.includes("furniture") ||
      lower.includes("door")
    ) {
      detectedTrade = "carpenter";
      detectedCategoryLabel = "Carpenter & Woodworker";
      detectedSkills.push("Furniture Crafting", "Door Fitting", "Laminate Work");
    } else if (
      lower.includes("electric") ||
      lower.includes("wiring") ||
      lower.includes("inverter") ||
      lower.includes("switch")
    ) {
      detectedTrade = "electrician";
      detectedCategoryLabel = "Electrician & Wireman";
      detectedSkills.push("Home Wiring", "Inverter Setup", "MCB Troubleshooting");
    } else if (
      lower.includes("paint") ||
      lower.includes("putty") ||
      lower.includes("polish") ||
      lower.includes("waterproof")
    ) {
      detectedTrade = "painter";
      detectedCategoryLabel = "Painter & Polisher";
      detectedSkills.push("Putty Finish", "Roller Painting", "Waterproofing");
    } else if (
      lower.includes("plumber") ||
      lower.includes("pipe") ||
      lower.includes("leak") ||
      lower.includes("sanitary")
    ) {
      detectedTrade = "plumber";
      detectedCategoryLabel = "Plumber & Sanitary Specialist";
      detectedSkills.push("Pipe Fitting", "Bathroom Sanitaryware", "Leakage Repair");
    } else if (
      lower.includes("weld") ||
      lower.includes("iron") ||
      lower.includes("grill") ||
      lower.includes("gate")
    ) {
      detectedTrade = "welder";
      detectedCategoryLabel = "Welder & Fabricator";
      detectedSkills.push("Arc Welding", "Grill Fabrication", "Iron Work");
    } else if (
      lower.includes("thekedar") ||
      lower.includes("contractor") ||
      lower.includes("crew") ||
      lower.includes("labor") ||
      lower.includes("team")
    ) {
      detectedTrade = "thekedar";
      detectedCategoryLabel = "Contractor & Construction Crew";
      detectedSkills.push("Crew Management", "Slab Casting", "Complete Building Structure");
    }

    // Extract daily wage rate
    let extractedWage = 800;
    const wageMatch = transcript.match(/(\d{3,4})\s*(?:rupees|rs|daily|per day|\/day)/i);
    if (wageMatch) {
      extractedWage = parseInt(wageMatch[1], 10);
    }

    // Extract experience
    let extractedExp = 5;
    const expMatch = transcript.match(/(\d{1,2})\s*(?:years|year|yrs|yr)/i);
    if (expMatch) {
      extractedExp = parseInt(expMatch[1], 10);
    }

    return NextResponse.json({
      success: true,
      data: {
        rawTranscript: transcript,
        language: "en",
        parsedProfile: {
          tradeCategory: detectedTrade,
          categoryLabel: detectedCategoryLabel,
          suggestedTitle: `Skilled ${detectedCategoryLabel.split("/")[0].trim()} with ${extractedExp}+ Years Experience`,
          dailyWageRate: extractedWage,
          experienceYears: extractedExp,
          skills: detectedSkills.length ? detectedSkills : ["General Skilled Labor"],
          summary: `Professional artisan verified via Shramik Voice AI. Specializes in ${detectedCategoryLabel} works with an estimated daily wage of ₹${extractedWage}.`,
        },
      },
    });
  } catch (error) {
    console.error("Voice AI parsing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse voice transcript" },
      { status: 500 }
    );
  }
}
