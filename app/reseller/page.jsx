import React from 'react'
import ResellerForm from './ResellerForm'
import Link from 'next/link'

// 1. check if user is reseller
// 2. display reseller status
// 3. if not, show form
// 4. if yes, show form with data

const page = () => {
  return (
    <div className="container max-w-5xl mx-auto mt-12">
    <h1 className="text-3xl font-semibold leading-9 text-gray-900">
      Reseller Application
    </h1>
    <Link href="https://pricepointwholesale.com/my-account">
				<p className="pt-4 text-blue-600">Back to My Account</p>
			</Link>
    <ResellerForm />
    </div>
  )
}

export default page