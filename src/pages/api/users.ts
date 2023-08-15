import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import stripe from "@/lib/stripe";
import { randomUUID } from "crypto";

const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { api_key } = req.query

    if (!api_key) {
        res.status(400).json({
            message: "Missing api_key"
        })
        return
    }

    const user = await prisma.user.findFirst({
        where: {
            api_key: api_key as string
        }
    })

    if (!user) return res.status(401).json({
        message: "Invalid api_key"
    })


    const customer = await stripe.customers.retrieve(String(user?.stripe_customer_id))

    const subscriptions = await stripe.subscriptions.list({
        customer: String(user?.stripe_customer_id)
    })

    const item = await subscriptions.data.at(0)?.items.data.at(0)

    if (!item) {
        res.status(403).json({
            message: "No subscription found"
        })
    }

    const result = await stripe.subscriptionItems.createUsageRecord(String(item?.id), {
        quantity: 1
    })

    const log = await prisma.log.create({
        data: {
            userId: String(user.id),
            method: "GET",
            status: 200
        }
    })

    res.status(200).json({
        message: "Success",
        data: [{
            id: randomUUID(),
            name: "John",
        }, {
            id: randomUUID(),
            name: "Smith",
        }]
    })
}

export default handler