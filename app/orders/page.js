"use client";
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import { fetchOrdersForCurrentUser, fetchCurrentUser } from "../actions";
import Link from "next/link";

const Orders = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState(null)

    const token = () =>
        document.cookie
            .split("; ")
            ?.find((row) => row.startsWith("token="))
            ?.split("=")[1];

    useEffect(() => {
      if(!user){
        async function fetchUser() {
          const userData = await fetchCurrentUser(token());
          setUser(userData);
          console.log(userData)
      }
      fetchUser();
      }
    },[]);

    useEffect(() => {
        if (user?.user_id) {
      async function fetchOrders() {
            const orderData = await fetchOrdersForCurrentUser(user.user_id);
            setOrders(orderData);
            console.log(orderData)
        }
        fetchOrders();
        }
    }, [user]);

    return (
        <div className="container max-w-5xl mx-auto mt-12">
            <h1 className="text-3xl font-semibold leading-9 text-gray-900">
                Orders
            </h1>

            <div className="mt-12 px-4 sm:px-6 lg:px-8 sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">
                                Orders
                            </h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of Orders.
                            </p>
                        </div>
                    </div>
                    <div className="flow-root">
                        <div className=" overflow-x-auto ">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                            >
                                                Customer ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Billing Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Date Created
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Total
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                                            >
                                                <span className="sr-only">
                                                    Edit
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {orders?.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="even:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                                    {order?.customer_id}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {order.billing.first_name}{" "}
                                                    {order.billing.last_name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {order.date_created}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {order.total}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                                    <a
                                                        href="#"
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        {order.id}
                                                        <span className="sr-only">
                                                            , {order.id}
                                                        </span>
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
    );
};

export default Orders;
