import { cookies } from 'next/headers'
import Link from 'next/link'

import { getCurrentUser } from '@aws-amplify/auth/server'
import { runWithAmplifyServerContext } from '@/lib/amplifyServerUtils'
import { SignOutButton } from './SignOutButton'

// This page always dynamically renders per request
export const dynamic = 'force-dynamic'
async function Navbar() {
	let hasUser = false
	try {
		await runWithAmplifyServerContext({
			nextServerContext: { cookies },
			operation: (contextSpec) => getCurrentUser(contextSpec),
		})
		hasUser = true
	} catch (error) {
		console.log(error)
		hasUser = false
	}

	return (
    <header className="bg-white shadow-sm w-full fixed top-0 left-0 z-50">
      <nav className="flex justify-around">
        <div className="flex">
          <Link href="/" className="btn btn-ghost text-xl">
            Rective Coffee
          </Link>
        </div>
        <div className="flex">
          <ul className="menu menu-horizontal px-1 flex gap-8">
            <li>
              <Link href="/order">My Orders</Link>
            </li>
            <li>
              <SignOutButton hasUser={hasUser} />
            </li>
          </ul>
        </div>
      </nav>
    </header>
	)
}

export default Navbar
