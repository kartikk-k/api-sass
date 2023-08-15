import React, { use } from 'react'
import Link from 'next/link'
import { craeteCheckoutLink, createCustomerIfNull, isSubscribed } from '@/lib/stripe'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

async function Dashboard() {
    const prisma = new PrismaClient()

    const session = await getServerSession(authOptions)

    let api_key = null

    // checks if user is logged in
    if (session) {
        const user = await prisma.user.findFirst({
            where: { email: session.user?.email }
        })

        api_key = user?.api_key
    }

    // get stripe customer id
    const customer = await createCustomerIfNull()

    // check if user is subscribed
    const isSub = await isSubscribed()

    // create checkout link
    const checkoutLink = await craeteCheckoutLink(String(customer))
    console.log(checkoutLink)

    return (
        <div>
            {isSub ? (
                <div className='space-y-4'>
                    <div className='p-2 text-sm rounded-md bg-emerald-600 text-white'>
                        <p>You are subscribed to API</p>
                    </div>
                    <div className='flex flex-col border rounded-lg'>
                        <p className='font-semibold p-2 border-b' >API Key</p>
                        <p className='p-2 text-sm bg-zinc-100 text-zinc-700' >{api_key}</p>
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