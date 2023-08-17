import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { PrismaClient, User } from "@prisma/client"
import { getServerSession, type Session } from "next-auth"
import { redirect } from "next/navigation"
import useStore from "../../Store"

const prisma = new PrismaClient()

// export default async function isUserAuthenticated() {
//     const session: Session | null = await getServerSession(authOptions)
//     if (!session) redirect('/api/auth/signin')

//     // const user:User | null = await prisma.user.findFirst({
//     //     where: { email: session.user?.email }
//     // })


// }



export async function authenticateUser() {
    const { session, setSession, setUser } = useStore()

    // if user is already logged in, return
    if (session?.user) return

    // get session
    const userSession: Session | null = await getServerSession(authOptions)

    // if user is not logged in, redirect to login page
    if (!userSession) redirect('/api/auth/signin')
    else setSession(userSession) // set session in store

    // get user data
    const userdata: User | null = await prisma.user.findFirst({
        where: { email: userSession.user?.email }
    })

    // set user in store
    if (userdata) setUser(userdata)
    else redirect('/')
}