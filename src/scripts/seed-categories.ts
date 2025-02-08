import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Trending",
  "Gaming",
  "Music",
  "Movies",
  "Live",
  "Sports",
  "Learning",
  "Entertainment",
  "News",
  "Fashion & Beauty",
  "Travel",
  "Education",
  "Jobs",
  "Health",
  "Food & Drink",
  "Auto & Vehicles",
  "Pets",
  "Business",
  "Other",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Video related to ${name.toLocaleLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    console.log("Categories seeded successfully.");
  } catch (error) {
    console.log("Error seeding categories:", error);
    process.exit(1);
  }
}

main();
