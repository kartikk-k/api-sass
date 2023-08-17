import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"


export default async function isUserAuthenticated() {

    const userSession = await getServerSession(authOptions)
    if (!userSession) return redirect('/api/auth/signin')

}