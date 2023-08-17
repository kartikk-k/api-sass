import React from 'react'
import Header from '@/components/header'
import isUserAuthenticated from '@/lib/auth'


async function layout({ children }: { children: React.ReactNode }) {

    // checking if user is authenticated else redirect to sign-in page
    await isUserAuthenticated()

    return (
        <div className='p-4 max-w-5xl mx-auto'>
            <Header />

            <main className='py-8 px-4'>
                {children}
            </main>
        </div>
    )
}

export default layout