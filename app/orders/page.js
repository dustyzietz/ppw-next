"use client";
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import {
    fetchOrdersForCurrentUser,
    fetchCurrentUser,
    fetchDesigns,
    fetchProductDesigns,
} from "../actions";
import Link from "next/link";
import OrderTable from "@/components/OrderTable";
import dayjs from "dayjs";

const Orders = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState(null);
    const [customOrders, setCustomOrders] = useState(null);
    const [designs, setDesigns] = useState([]);
    const [productDesigns, setProductDesigns] = useState([]);

    const token = () =>
        document.cookie
            .split("; ")
            ?.find((row) => row.startsWith("token="))
            ?.split("=")[1];

    useEffect(() => {
        if (!user) {
            async function fetchUser() {
                const userData = await fetchCurrentUser(token());
                setUser(userData);
            }
            fetchUser();
        }
    }, []);

    useEffect(() => {
        if (user?.user_id) {
            async function fetchOrders() {
                const orderData = await fetchOrdersForCurrentUser(user.user_id);
                const { orders, customOrders } = orderData;
                const filteredOrders = orders.filter(
                    (order) =>
                        !customOrders.some(
                            (customOrder) => customOrder.id === order.id
                        )
                );
                setOrders(filteredOrders);
                setOrders(filteredOrders);
                setCustomOrders(customOrders);
            }
            fetchOrders();
        }
    }, [user]);

    useEffect(() => {
        async function handleFetchDesigns() {
            try {
                const designData = await fetchDesigns(token());
                setDesigns(designData);
            } catch (error) {
                console.log(error);
                alert("Error");
            }
        }

        if (!designs.length) {
            handleFetchDesigns();
        }
    }, []);

    useEffect(() => {
        async function handleFetchProductDesigns() {
            try {
                const productDesignData = await fetchProductDesigns(token());
                setProductDesigns(productDesignData);
            } catch (error) {
                console.log(error);
                alert("Error");
            }
        }

        if (!productDesigns.length) {
            handleFetchProductDesigns();
        }
    }, []);

    const headers = ["Order", "Date", "Status", "Total"];
    const data = orders?.map((order) => ({
        row: [
            order?.id,
            dayjs(order?.date_created).format("MMMM DD, YYYY"),
            `${order?.status} for ${order.line_items.length} items`,
            order.total,
        ],
        lineItems: order.line_items,
    }));

    const customData = customOrders?.map((order) => ({
        row: [
            order?.id,
            dayjs(order?.date_created).format("MMMM DD, YYYY"),
            `${order?.status} for ${order.line_items.length} items`,
            order.total,
        ],
        lineItems: order.line_items.map((lineItem) => {
            const productDesignData = productDesigns.find(
                (productDesign) =>
                    +productDesign.order_product_id === lineItem.id
            );

            let designData = null;
            if (productDesignData) {
                designData = designs.find(
                    (design) => productDesignData.design_id === design.Id
                );
            }

            return { ...lineItem, designData: designData };
        }),
    }));

    return (
        <div className="container max-w-5xl mx-auto mt-12">
            <h1 className="text-3xl font-semibold leading-9 text-gray-900">
                Orders
            </h1>
            <OrderTable
                title="Custom Orders"
                description="A list of Custom Orders."
                headers={headers}
                data={customData}
                designs={designs}
                fetchProductDesigns={fetchProductDesigns}
                setProductDesigns={setProductDesigns}
            />

            <OrderTable
                title="Other Orders"
                description="A list of Orders."
                headers={headers}
                data={data}
            />
        </div>
    );
};

export default Orders;
