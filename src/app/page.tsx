import Header from "@/components/header";

export default function Home() {
  return (
    <main>
      <Header />

      <div className="max-w-5xl p-4 pt-8 mx-auto space-y-4">
        <div>
          <h1 className="text-3xl font-bold">API Sass</h1>
          <p>API as service project made using Prisma, Stripe, Next-auth & NextJS 13</p>
        </div>

        <div className='flex flex-col border rounded-lg'>
          <p className='font-semibold p-2 border-b' >Endpoints</p>
          <div className='p-2 flex gap-10 items-center font-mono text-sm bg-zinc-100 text-zinc-700' >
            <code className='p-1 rounded-md bg-zinc-200'>GET</code>
            <p>/api/users?api_key[YOUR SECERET KEY]</p>
          </div>
        </div>
      </div>

    </main>
  )
}
