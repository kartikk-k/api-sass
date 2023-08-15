import React, { use } from 'react'
import Link from 'next/link'
import stripe, { craeteCheckoutLink, createCustomerIfNull, isSubscribed } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

async function Dashboard() {
    const prisma = new PrismaClient()

    const session = await getServerSession(authOptions)

    // get user data
    const user = await prisma.user.findFirst({
        where: { email: session?.user?.email }
    })

    // set api_key
    const api_key = user?.api_key


    // get stripe customer id
    const customer = await createCustomerIfNull()

    // check if user is subscribed
    const isSub = await isSubscribed()

    // create checkout link
    const checkoutLink = await craeteCheckoutLink(String(customer))
    console.log(checkoutLink)

    // get recent logs
    const logs = await prisma.log.findMany({
        where: {
            userId: user?.id
        },
        orderBy: {
            created: 'desc'
        },
        take: 10
    })

    let current_usage = 0

    // get current usage
    if (isSub) {
        const subscription = await stripe.subscriptions.list({
            customer: String(user?.stripe_customer_id)
        })

        const invoice = await stripe.invoices.retrieveUpcoming({
            subscription: String(subscription.data.at(0)?.id)
        })

        if (invoice) current_usage = invoice.amount_due / 100

    }

    return (
        <div>
            {isSub ? (
                <div className='space-y-4'>
                    <div className='p-2 text-sm rounded-md bg-emerald-600 text-white'>
                        <p>You are subscribed to API</p>
                    </div>
                    <div className='flex flex-col border rounded-lg'>
                        <p className='font-semibold p-2 border-b' >Current usage</p>
                        <p className='p-2 text-sm bg-zinc-100 text-zinc-700' >${current_usage}</p>
                    </div>
                    <div className='flex flex-col border rounded-lg'>
                        <p className='font-semibold p-2 border-b' >API Key</p>
                        <p className='p-2 text-sm bg-zinc-100 text-zinc-700' >{api_key}</p>
                    </div>
                    <div className='flex flex-col border rounded-lg'>
                        <p className='font-semibold p-2 border-b' >Logs</p>
                        {logs.map((log) => (
                            <div key={log.id} className='flex gap-10 border-b items-center p-2 text-sm bg-zinc-100 text-zinc-700'>
                                <code className='p-1 rounded-md bg-zinc-200'>{log.method}</code>
                                <p>{log.status}</p>
                                <p>{log.created.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='min-h-[60vh] flex items-center justify-center rounded-xl bg-zinc-100'>
                    <Link href={checkoutLink!} className='text-sm hover:underline font-medium'>
                        Subscribe API to continue!!
                    </Link>
                </div>
            )}
        </div>
    )
}

export default Dashboard