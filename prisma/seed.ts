import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("Admin@1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ordertracking.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ordertracking.com",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: true,
    },
  });

  console.log("Seeded admin user:", admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
