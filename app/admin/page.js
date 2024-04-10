"use client"
import Form from './Form';
import {useState, useEffect} from 'react'
import { fetchOrders, fetchUsers } from '../actions'

export default function Admin() {
  const products = []
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  

  const [authenticated, setAuthenticated] = useState(false)
  useEffect(() => {
   const getOrders = async () => {
        const updatedOrders = await fetchOrders()
        setOrders(updatedOrders)
    }
    getOrders()
    const getUsers = async () => {
        const token = document.cookie.split('; ')?.find(row => row.startsWith('token='))?.split('=')[1];
  
        const updatedUsers = await fetchUsers(token)
        setUsers(updatedUsers)
    }
    getUsers()
    }, [])
    return (
        <main>
            {authenticated ? (
            <><h1>Authenticated</h1>
            <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title, email and role.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                    ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="even:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                      {user.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.is_super_admin ? "ADMIN" : "User"}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {user.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

            { // Orders table
}
<div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title, email and role.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                    Customer ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Billing Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date Created
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="even:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                      {order?.customer_id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.billing.first_name} {order.billing.last_name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date_created}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.total}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        {order.id}<span className="sr-only">, {order.id}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
   

           {orders.map(
                (order) => (
                    <div key={order.id}>
                        <h2>{order.total}</h2>
            {console.log(order)}
                    </div>
                )
            )}
            </>
    )
            :(<Form authenticated={authenticated} setAuthenticated={setAuthenticated} />)
            }
            
            
        </main>
    );
}


