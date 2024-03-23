'use client'

import { withAuthenticator } from '@aws-amplify/ui-react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

function Page() {
	useEffect(() => {
		redirect('/order')
	}, [])
	return null
}

export default withAuthenticator(Page, { signUpAttributes: ['email'] })
