import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"


export default async function isUserAuthenticated() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/api/auth/signin')
}