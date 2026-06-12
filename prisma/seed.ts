import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.incident.createMany({
    data: [
      {
        title: 'Laptop cannot connect to VPN',
        description: 'User reported that their laptop fails to connect to the company VPN since this morning. Error code: 0x800704D3.',
        reporterName: 'Ahmad Razif',
        category: 'NETWORK',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
      },
      {
        title: 'Outlook not syncing emails',
        description: 'Outlook is stuck and not syncing new emails. User has tried restarting but the issue persists.',
        reporterName: 'Mohd Faizi',
        category: 'SOFTWARE',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        resolutionNotes: 'Cleared the OST cache file and re-created the Outlook profile. Email sync restored.',
        resolvedAt: new Date(),
      },
      {
        title: 'Shared printer showing offline',
        description: 'The shared printer (HP LaserJet) on Level 3 is showing offline status. Multiple users affected.',
        reporterName: 'Siti Hajar',
        category: 'HARDWARE',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
      },
      {
        title: 'New staff account creation request',
        description: 'Requesting new Active Directory account and email for new staff member joining on Monday.',
        reporterName: 'HR Department',
        category: 'OTHERS',
        priority: 'LOW',
        status: 'RESOLVED',
        resolutionNotes: 'Account created and credentials delivered via sealed envelope.',
        resolvedAt: new Date(),
      },
      {
        title: 'Blue screen of death on workstation',
        description: 'Workstation WS-FINANCE-04 is experiencing recurring BSOD with error: IRQL_NOT_LESS_OR_EQUAL.',
        reporterName: 'Nurul Ain',
        category: 'HARDWARE',
        priority: 'CRITICAL',
        status: 'IN_PROGRESS',
      },
    ],
  })

  const count = await prisma.incident.count()
  console.log(`✅ Seeded ${count} incidents.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
