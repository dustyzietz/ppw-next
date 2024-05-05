"use client";
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import {
	fetchOrdersForCurrentUser,
	fetchCurrentUser,
	fetchDesigns,
	fetchProductDesigns,
  fetchCustomProducts,
} from "../actions";
import Link from "next/link";
import OrderTable from "@/components/OrderTable";
import dayjs from "dayjs";

const Orders = () => {
	const [user, setUser] = useState(null);
	const [orders, setOrders] = useState(null);
	const [designs, setDesigns] = useState([]);
	const [productDesigns, setProductDesigns] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);

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
      try {
          const orderData = await fetchOrdersForCurrentUser(user.user_id);
          if(orderData?.success) {
            const { data } = orderData;
            setOrders(data);
          } else {
            console.log(orderData)
            if (orderData?.error.includes("jwt_auth_invalid_token")) {
              // redirect to pricepointwholesale.com/my-account
              alert("Your token has expired. Redirecting you to the login page.");
              window.location.href = "https://pricepointwholesale.com/my-account";
            }
          }
        } catch (error) {
          console.log(error);
          alert("Error");
        } 
			}
			fetchOrders();
		}
	}, [user]);

	useEffect(() => {
		async function handleFetchDesigns() {
			try {
				const designData = await fetchDesigns(token());
				if (designData.success) {
					setDesigns(designData.data);
				} else {
					console.log(designData);
					if (designData?.error?.includes("jwt_auth_invalid_token")) {
						// redirect to pricepointwholesale.com/my-account
						alert("Your token has expired. Redirecting you to the login page.");
						window.location.href = "https://pricepointwholesale.com/my-account";
					}
				}
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
    async function handleFetchCustomProducts() {
      try {
        const customProductData = await fetchCustomProducts(token());
        setCustomProducts(customProductData);
      } catch (error) {
        console.log(error);
        alert("Error");
      }
    }

		if (!productDesigns.length) {
			handleFetchProductDesigns();
		}
    if (!customProducts.length) {
      handleFetchCustomProducts();
    }

	}, []);

	const headers = ["Order", "Date", "Status", "Total"];

	const data = orders?.map((order) => ({
		row: [
			<a className="text-blue-600 text-lg underline" href={`https://pricepointwholesale.com/my-account/view-order/${order?.id}`}>View</a>,
			dayjs(order?.date_created).format("MMMM DD, YYYY"),
			`${order?.status} for ${order.line_items.length} items`,
			order.total,
		],
		lineItems: order.line_items.map((lineItem) => {
			const productDesignData = productDesigns.find(
				(productDesign) => +productDesign.order_product_id === lineItem.id
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
			<h1 className="text-3xl font-semibold leading-9 text-gray-900">Orders</h1>
			<Link href="https://pricepointwholesale.com/my-account">
				<p className="pt-4 text-blue-600">Back to My Account</p>
			</Link>
			{ orders === null ? (
				<h2>Loading...</h2>
			) : (
				<OrderTable
					title="Orders"
					description="A list of Your Orders."
					headers={headers}
					data={data}
					designs={designs}
					fetchProductDesigns={fetchProductDesigns}
					setProductDesigns={setProductDesigns}
          customProducts={customProducts}
				/>
			)}
		</div>
	);
};

export default Orders;
