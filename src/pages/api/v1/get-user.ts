import { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { user_id } = req.query

    if (!user_id) {
        res.status(400).json({
            message: "Missing user_id"
        })
        return
    }

    const logs = await prisma.log.findMany({
        where: {
            userId: String(user_id)
        },
        orderBy: {
            created: 'desc'
        },
        take: 10
    })

    res.status(200).json({
        message: "Success",
        data: logs
    })
}

export default handler