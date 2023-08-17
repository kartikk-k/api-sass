import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { redirect } from 'next/navigation'


const prisma = new PrismaClient()

// price_1NfN0tSGoLtqO7bmrXt5IY0m
const stripe = new Stripe(String(process.env.STRIPE_SECRET), {
    apiVersion: '2022-11-15',
})

export default stripe

export const createCustomerIfNull = async () => {
    const session = await getServerSession(authOptions)

    // checks if user is logged in
    if (session) {
        const user = await prisma.user.findFirst({
            where: { email: session.user?.email }
        })

        // creates api key if null
        if (!user?.api_key) {
            await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    api_key: "secret_" + randomUUID()
                }
            })
        }

        // checks if stipe account exists
        if (!user?.stripe_customer_id) {

            // create new account on stripe
            const customer = await stripe.customers.create({
                email: String(user?.email)
            })

            // update in database
            await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    stripe_customer_id: customer.id
                }
            })

        }
        // return new customer id
        const new_user = await prisma.user.findFirst({
            where: { email: session.user?.email }
        })

        return new_user?.stripe_customer_id

    }
}

export const isSubscribed = async () => {
    const session = await getServerSession(authOptions)

    // checks if user is logged in
    if (session) {
        const user = await prisma.user.findFirst({
            where: { email: session.user?.email }
        })

        const subscriptions = await stripe.subscriptions.list({
            customer: String(user?.stripe_customer_id)
        })

        return subscriptions.data.length > 0

    }

    return false
}


export const craeteCheckoutLink = async (customer_id: string) => {
    const checkout = await stripe.checkout.sessions.create({
        mode: 'subscription',
        success_url: 'http://localhost:3000/billing?success=true',
        cancel_url: 'http://localhost:3000/billing?success=true',
        customer: customer_id,
        line_items: [{
            price: 'price_1NfN0tSGoLtqO7bmrXt5IY0m'
        }]
    })

    return checkout.url
} 