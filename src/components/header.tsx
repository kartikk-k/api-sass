import Link from 'next/link'
import React from 'react'

function Header() {
    return (
        <nav className='max-w-5xl mx-auto'>
            <div className='flex p-4 items-center gap-8 justify-between'>
                {/* logo */}
                <Link href={'/'} className='text-xl font-semibold hover:opacity-90'>
                    API Sass
                </Link>

                {/* nav links */}
                <div className='flex items-center gap-4 text-sm'>
                    <Link className='hover:opacity-90' href={'/dashboard'}>Dashboard</Link>
                    <Link className='hover:opacity-90' href={'/#features'}>Features</Link>
                    <Link className='hover:opacity-90' href={'/#pricing'}>Pricing</Link>
                </div>
            </div>

        </nav>
    )
}

export default Header