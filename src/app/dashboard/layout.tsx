import Header from '@/components/header'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

async function layout({ children }: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions)
    if (session) console.log("logged in")
    else redirect('/api/auth/signin')

    return (
        <div className='p-4 max-w-5xl mx-auto'>
            <Header />

            <main>
                {children}
            </main>
        </div>
    )
}

export default layout