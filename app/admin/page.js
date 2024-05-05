"use client";
import Form from "./Form";
import { useState, useEffect } from "react";
import {
	fetchOrders,
	fetchUsers,
	fetchCustomProducts,
	fetchTemplates,
	fetchAllResellers,
} from "../actions";
import AddTemplateModal from "./AddTemplateModal";
import Image from "next/image";
import PDFLink from "@/components/PDFLink";
import Table from "@/components/Table";
import ResellerApproval from "./ResellerApproval";

export default function Admin() {
	const [orders, setOrders] = useState([]);
	const [users, setUsers] = useState([]);
	const [templates, setTemplates] = useState([]);
	const [products, setProducts] = useState([]);
	const [authenticated, setAuthenticated] = useState(false);
	const [resellers, setResellers] = useState([]);

  const token = () => {
    return document.cookie
      .split("; ")
      ?.find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

	useEffect(() => {

		const getOrders = async () => {
			const updatedOrders = await fetchOrders();
			setOrders(updatedOrders);
		};
		if (!orders.length) {
			getOrders();
		}
		const getProducts = async () => {
			const updatedProducts = await fetchCustomProducts();
			setProducts(updatedProducts);
		};
		if (!products.length) {
			getProducts();
		}
		const getUsers = async () => {
			const updatedUsers = await fetchUsers(token());
			setUsers(updatedUsers);
		};

		if (!products.length) {
			getProducts();
		}
		if (!users.length) {
			getUsers();
		}
		if (!templates.length) {
			getTemplates();
		}
		if (!resellers.length) {
			getAllResellers();
		}
	}, [authenticated]);

  const getAllResellers = async () => {
    const updatedResellers = await fetchAllResellers(token());
    setResellers(updatedResellers.data);
  };

	const getTemplates = async () => {
		const updatedTemplates = await fetchTemplates(token());
		setTemplates(updatedTemplates);
	};

	const resellerHeaders = [
		"ID",
		"User ID",
		"Email",
		"Store Name",
		"About",
		"Status",
		"Approval",
	];
	const resellerData = resellers.map((reseller) => [
		reseller.ID,
		reseller.user_id,
		reseller.email,
		reseller.store_name,
		reseller.about,
		reseller.status,
		<ResellerApproval reseller={reseller} getAllResellers={getAllResellers} />,
	]);

	const userHeaders = ["ID", "Name", "Email", "Role"];
	const userData = users.map((user) => [
		user.id,
		user.name,
		user.email,
		user.is_super_admin ? "ADMIN" : "User",
	]);

	const orderHeaders = [
		"ID",
		"Customer ID",
		"Billing Name",
		"Date Created",
		"Total",
	];
	const orderData = orders.map((order) => [
		order.id,
		order.customer_id,
		order.billing.first_name + " " + order.billing.last_name,
		order.date_created,
		order.total,
	]);

	const customProductHeaders = ["ID", "Name", "Template", "Edit"];
	const customProductData = products.map((product) => {
		const template = templates.filter(
			(template) => +template.product_id === product.id
		)?.[0];
		return [
			product.id,
			product.name,
			template?.template,
			<AddTemplateModal
				product_id={product.id}
				template_id={template?.id}
				oldTemplate={template?.template}
				getTemplates={getTemplates}
			/>,
		];
	});

	return (
		<main>
			{authenticated ? (
				<>
					<h1>Authenticated</h1>

					<Table
						headers={resellerHeaders}
						data={resellerData}
						title="Resellers"
						description="A list of all the resellers in your account"
					/>

					<Table
						headers={customProductHeaders}
						data={customProductData}
						title="Custom Products"
						description="A list of all the custom products in your account"
					/>

					<Table
						headers={userHeaders}
						data={userData}
						title="Users"
						description="A list of all the users in your account"
					/>
					<Table
						headers={orderHeaders}
						data={orderData}
						title="Orders"
						description="A list of all the orders in your account"
					/>
				</>
			) : (
				<Form
					authenticated={authenticated}
					setAuthenticated={setAuthenticated}
				/>
			)}
		</main>
	);
}
