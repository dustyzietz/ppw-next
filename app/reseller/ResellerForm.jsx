"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import Link from "next/link";
import {
	addReseller,
	fetchCurrentUser,
	fetchReseller,
	updateReseller,
} from "../actions";
import DragDrop from "@/components/DragDrop";

const ResellerForm = () => {
	const initialFormData = {
		user_id: "",
		store_name: "",
		about: "",
		articles: "",
		permit: "",
		status: "not sent",
		message: "",
	};

	const [formData, setFormData] = useState(initialFormData);
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const token = () => {
		return document.cookie
			.split("; ")
			?.find((row) => row.startsWith("token="))
			?.split("=")[1];
	};

	useEffect(() => {
		if (!user) {
			async function fetchUser() {
				try {
					const userData = await fetchCurrentUser(token());
					if (userData.code === "jwt_auth_invalid_token") {
						setLoading(false);
						alert("Your token has expired. Redirecting you to the login page.");
						window.location.href = "https://pricepointwholesale.com/my-account";
					} else {
						setUser(userData);
					}
				} catch (error) {
					console.log(error);
					setLoading(false);
				}
			}
			fetchUser();
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			handleFetchReseller();
		}
	}, [user]);

	async function handleFetchReseller() {
		try {
			const resellerData = await fetchReseller(token());
			if (resellerData.success && resellerData.data.ID) {
				console.log("SUCCESS", resellerData.data);
				setFormData(resellerData.data);
			} else if (
				resellerData.success &&
				resellerData.data?.data?.status === 403
			) {
				alert("Your token has expired. Redirecting you to the login page.");
				window.location.href = "https://pricepointwholesale.com/my-account";
			} else {
				console.log("No reseller found", resellerData);
				setFormData({ ...formData, user_id: user.user_id, email: user.email });
				setOpen(true);
			}
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	}

	const handleSubmit = async () => {
		if (formData.ID) {
			try {
				const res = await updateReseller(token(), {
					...formData,
					status: "pending",
				});
				if (res.success) {
					alert("Your application has been updated");
				}
        setOpen(false);
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				const res = await addReseller(token(), {
					...formData,
					status: "pending",
				});
				if (res.success) {
					alert("Your application has been submitted");
				}
				handleFetchReseller();
				setOpen(false);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
	<>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<>
					{open ? (
						<>
							<h2 className="text-xl font-semibold py-4">Status: {formData.status}</h2>
							<div className="float-right">
								<Button
									className="mr-4"
									text="Cancel"
									onClick={() => {
										setOpen(false);
										handleFetchReseller();
									}}
								/>
								<Button text="Submit" onClick={handleSubmit} />
							</div>
							<form>
								<div className="space-y-12">
									<div className="border-b border-gray-900/10 pb-12">
										<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      {/* company name and address fields in dropdown take out message */}
											<div className="sm:col-span-4">
												<label
													htmlFor="username"
													className="block text-sm font-medium leading-6 text-gray-900"
												>
													Company Name
												</label>
												<div className="mt-2">
													<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
														<input
															type="text"
															name="store_name"
															id="store_name"
															autoComplete="store_name"
															className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
															placeholder="My Awesome Store"
															value={formData.store_name}
															onChange={(e) =>
																setFormData({
																	...formData,
																	store_name: e.target.value,
																})
															}
														/>
													</div>
												</div>
											</div>

											<div className="col-span-full">
												<label
													htmlFor="about"
													className="block text-sm font-medium leading-6 text-gray-900"
												>
													About
												</label>
												<div className="mt-2">
													<textarea
														id="about"
														name="about"
														rows={3}
														className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
														value={formData.about}
														onChange={(e) =>
															setFormData({
																...formData,
																about: e.target.value,
															})
														}
													/>
												</div>
												<p className="mt-3 text-sm leading-6 text-gray-600">
													Write a few sentences about your custom product store.
												</p>
											</div>

											<div className="col-span-full">
												<label
													htmlFor="cover-photo"
													className="block text-sm font-medium leading-6 text-gray-900"
												>
													Articles of incorporation
												</label>
												<DragDrop
													imageUrl={formData.articles}
													setImageUrl={(value) =>
														setFormData({ ...formData, articles: value })
													}
												/>
											</div>
											<div className="col-span-full">
												<label
													htmlFor="cover-photo"
													className="block text-sm font-medium leading-6 text-gray-900"
												>
													Sellers Permit or Resellers permit
												</label>
												<DragDrop
													imageUrl={formData.permit}
													setImageUrl={(value) =>
														setFormData({ ...formData, permit: value })
													}
												/>
											</div>
										</div>

										<div className="flex justify-end mt-8">
											<Button
												className="mr-4"
												text="Cancel"
												onClick={() => {
													setOpen(false);
													handleFetchReseller();
												}}
											/>
											<Button onClick={handleSubmit} text="Submit" />
										</div>
									</div>
								</div>
							</form>
						</>
					) : (
						<>
							<h2 className="text-xl font-semibold py-4">Status: {formData.status}</h2>
              {formData?.message && <p className="text-purple-700 mb-4">{formData.message}</p>}
							<Button text="Edit" onClick={() => setOpen(true)} />
						</>
					)}
				</>
			)}
		</>
	);
};

export default ResellerForm;
