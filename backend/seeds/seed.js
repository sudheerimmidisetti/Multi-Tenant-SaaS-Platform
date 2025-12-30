const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting Database Seeding...");

  // ------------------------------------
  // 1️⃣ SUPER ADMIN
  // ------------------------------------
  const superAdminEmail = "superadmin@system.com";
  const superAdminHash = await bcrypt.hash("Admin@123", 10);

  const existingSuperAdmin = await prisma.user.findFirst({
    where: { email: superAdminEmail }
  });

  if (!existingSuperAdmin) {
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash: superAdminHash,
        fullName: "System Super Admin",
        role: "super_admin",
        tenantId: null,
      },
    });
  }

  console.log("✔ Super Admin Created");

  // ------------------------------------
  // 2️⃣ TENANT
  // ------------------------------------
  const demoTenant = await prisma.tenant.upsert({
    where: { subdomain: "demo" },
    update: {},
    create: {
      name: "Demo Company",
      subdomain: "demo",
      status: "active",
      subscriptionPlan: "pro",
      maxUsers: 25,
      maxProjects: 15,
    },
  });

  console.log(`✔ Tenant Ready: ${demoTenant.name}`);

  // ------------------------------------
  // 3️⃣ TENANT ADMIN
  // ------------------------------------
  const adminHash = await bcrypt.hash("Demo@123", 10);

  const tenantAdmin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: demoTenant.id,
        email: "admin@demo.com",
      },
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: "admin@demo.com",
      passwordHash: adminHash,
      fullName: "Demo Administrator",
      role: "tenant_admin",
    },
  });

  console.log("✔ Tenant Admin Ready");

  // ------------------------------------
  // 4️⃣ USERS
  // ------------------------------------
  const userHash = await bcrypt.hash("User@123", 10);

  const userEmails = [
    { email: "user1@demo.com", name: "Alice Employee" },
    { email: "user2@demo.com", name: "Bob Worker" },
  ];

  for (const u of userEmails) {
    const exists = await prisma.user.findFirst({
      where: { tenantId: demoTenant.id, email: u.email },
    });

    if (!exists) {
      await prisma.user.create({
        data: {
          tenantId: demoTenant.id,
          email: u.email,
          passwordHash: userHash,
          fullName: u.name,
          role: "user",
        },
      });
    }
  }

  console.log("✔ Users Ready");

  const user1 = await prisma.user.findFirst({
    where: { email: "user1@demo.com", tenantId: demoTenant.id },
  });

  const user2 = await prisma.user.findFirst({
    where: { email: "user2@demo.com", tenantId: demoTenant.id },
  });

  // ------------------------------------
  // 5️⃣ PROJECTS
  // ------------------------------------
  let project1 = await prisma.project.findFirst({
    where: {
      tenantId: demoTenant.id,
      name: "Website Redesign",
    },
  });

  if (!project1) {
    project1 = await prisma.project.create({
      data: {
        tenantId: demoTenant.id,
        name: "Website Redesign",
        description: "Q4 Website Overhaul",
        status: "active",
        createdBy: tenantAdmin.id,
      },
    });
  }

  let project2 = await prisma.project.findFirst({
    where: {
      tenantId: demoTenant.id,
      name: "Mobile App Launch",
    },
  });

  if (!project2) {
    project2 = await prisma.project.create({
      data: {
        tenantId: demoTenant.id,
        name: "Mobile App Launch",
        description: "iOS & Android Release",
        status: "active",
        createdBy: tenantAdmin.id,
      },
    });
  }

  console.log("✔ Projects Ready");

  // ------------------------------------
  // 6️⃣ TASKS
  // ------------------------------------
  await prisma.task.createMany({
    data: [
      {
        tenantId: demoTenant.id,
        projectId: project1.id,
        title: "Design Mockups",
        status: "completed",
        priority: "high",
        assignedTo: user1?.id || tenantAdmin.id,
      },
      {
        tenantId: demoTenant.id,
        projectId: project1.id,
        title: "Frontend Implementation",
        status: "in_progress",
        priority: "high",
        assignedTo: user2?.id || tenantAdmin.id,
      },
      {
        tenantId: demoTenant.id,
        projectId: project2.id,
        title: "App Store Submission",
        status: "todo",
        priority: "medium",
        assignedTo: tenantAdmin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✔ Tasks Ready");
  console.log("🎉 Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
