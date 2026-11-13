const { createClient } = require("@supabase/supabase-js");

const url = "https://bbdfewknrwiurrioojll.supabase.co";
const key = "sb_publishable_n5uBFZjz2WvEu-B0DOcisg_FoioK1jL";
const supabase = createClient(url, key);

async function check() {
  console.log("=== SUPABASE LIVE DIAGNOSTIC PROBE ===");
  console.log("Project URL:", url);
  console.log("API Key Prefix:", key.substring(0, 16) + "...");
  console.log("Timestamp:", new Date().toISOString());
  console.log("\n1. Testing Database Tables:");

  const tables = [
    "admin_profiles",
    "site_settings",
    "homepage_content",
    "about_content",
    "services",
    "portfolio_categories",
    "portfolio_images",
    "bookings",
    "customer_enquiries",
    "testimonials",
    "website_sections",
    "youtube_videos",
    "customers",
    "booking_status_history",
    "booking_availability",
    "activity_logs",
    "notification_logs",
    "ai_settings"
  ];

  for (const t of tables) {
    try {
      const { data, error } = await supabase.from(t).select("*").limit(1);
      if (error) {
        console.log(`  [-] Table "${t}": ${error.code} - ${error.message}`);
      } else {
        console.log(`  [+] Table "${t}": ONLINE (records: ${data.length})`);
      }
    } catch (e) {
      console.log(`  [!] Table "${t}": EXCEPTION - ${e.message}`);
    }
  }

  console.log("\n2. Testing Storage Service:");
  try {
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) {
      console.log("  [-] Storage buckets:", bErr.message);
    } else {
      console.log("  [+] Storage online. Available buckets:", buckets ? buckets.map(b => b.name) : []);
    }
  } catch (e) {
    console.log("  [!] Storage exception:", e.message);
  }

  console.log("\n3. Testing Auth Service:");
  try {
    const { data: { session }, error: aErr } = await supabase.auth.getSession();
    if (aErr) {
      console.log("  [-] Auth session check:", aErr.message);
    } else {
      console.log("  [+] Auth service responsive. Active session:", session ? "YES" : "NO");
    }
  } catch (e) {
    console.log("  [!] Auth exception:", e.message);
  }

  console.log("\n=== DIAGNOSTIC PROBE COMPLETE ===");
}

check();
