const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Database Seeding...');

  // ------------------------------------
  // 1️⃣ SUPER ADMIN  (No Tenant)
  // ------------------------------------
  const superAdminEmail = 'superadmin@system.com';
  const superAdminHash = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      passwordHash: superAdminHash,
      fullName: 'System Super Admin',
      role: 'super_admin',
      tenantId: null
    }
  });

  console.log('✔ Super Admin Ready');

  // ------------------------------------
  // 2️⃣ DEMO TENANT
  // ------------------------------------
  const demoTenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      name: 'Demo Company',
      subdomain: 'demo',
      status: 'active',
      subscriptionPlan: 'pro',
      maxUsers: 25,
      maxProjects: 15
    }
  });

  console.log(`✔ Tenant Ready: ${demoTenant.name}`);

  // ------------------------------------
  // 3️⃣ TENANT ADMIN
  // ------------------------------------
  const adminHash = await bcrypt.hash('Demo@123', 10);

  const tenantAdmin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: demoTenant.id,
        email: 'admin@demo.com'
      }
    },
    update: {},
    create: {
      tenantId: demoTenant.id,
      email: 'admin@demo.com',
      passwordHash: adminHash,
      fullName: 'Demo Administrator',
      role: 'tenant_admin'
    }
  });

  console.log('✔ Tenant Admin Ready');

  // ------------------------------------
  // 4️⃣ REGULAR USERS
  // ------------------------------------
  const userHash = await bcrypt.hash('User@123', 10);

  await prisma.user.createMany({
    data: [
      {
        tenantId: demoTenant.id,
        email: 'user1@demo.com',
        passwordHash: userHash,
        fullName: 'Alice Employee',
        role: 'user'
      },
      {
        tenantId: demoTenant.id,
        email: 'user2@demo.com',
        passwordHash: userHash,
        fullName: 'Bob Worker',
        role: 'user'
      }
    ],
    skipDuplicates: true
  });

  console.log('✔ Users Ready');

  // ------------------------------------
  // 5️⃣ PROJECTS
  // ------------------------------------
  const project1 = await prisma.project.upsert({
    where: { name_tenantId: { name: 'Website Redesign', tenantId: demoTenant.id }},
    update: {},
    create: {
      tenantId: demoTenant.id,
      name: 'Website Redesign',
      description: 'Q4 Website Overhaul',
      status: 'active',
      createdBy: tenantAdmin.id
    }
  });

  const project2 = await prisma.project.upsert({
    where: { name_tenantId: { name: 'Mobile App Launch', tenantId: demoTenant.id }},
    update: {},
    create: {
      tenantId: demoTenant.id,
      name: 'Mobile App Launch',
      description: 'iOS and Android release',
      status: 'active',
      createdBy: tenantAdmin.id
    }
  });

  console.log('✔ Projects Ready');

  // ------------------------------------
  // 6️⃣ TASKS
  // ------------------------------------
  await prisma.task.createMany({
    data: [
      {
        tenantId: demoTenant.id,
        projectId: project1.id,
        title: 'Design Mockups',
        status: 'completed',
        priority: 'high',
        assignedTo: tenantAdmin.id
      },
      {
        tenantId: demoTenant.id,
        projectId: project1.id,
        title: 'Frontend Implementation',
        status: 'in_progress',
        priority: 'high',
        assignedTo: tenantAdmin.id
      },
      {
        tenantId: demoTenant.id,
        projectId: project2.id,
        title: 'App Store Submission',
        status: 'todo',
        priority: 'medium',
        assignedTo: tenantAdmin.id
      }
    ],
    skipDuplicates: true
  });

  console.log('✔ Tasks Ready');
  console.log('🎉 Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
