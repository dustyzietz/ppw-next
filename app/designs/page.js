"use client";
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import { fetchDesigns } from "../actions";

import Link from "next/link";
import Modal from "@/components/Modal";
import DesignForm from "./DesignForm";
import { token } from "@/components/utils/helperFunctions";
import ImageOrPdfPreview from "@/components/ImageOrPdfPreview";
import PDFLink from "@/components/PDFLink";

const page = () => {
	const [designs, setDesigns] = useState(null);
	const [open, setOpen] = useState(false);
	const [currentDesign, setCurrentDesign] = useState(null);
	const [loading, setLoading] = useState(true);

	const handleClose = () => {
		setOpen(false);
		setCurrentDesign(null);
	};

	async function fetchTheDesigns() {
		try {
			const designs = await fetchDesigns(token());
			if (designs?.success) {
        if(Array.isArray(designs?.data)) {
          setDesigns(designs?.data);
        } else{
          console.log(designs)
          setDesigns([]);
        }
			} else {
				console.log(designs);
				if (designs?.error.includes("jwt_auth_invalid_token")) {
					// redirect to pricepointwholesale.com/my-account
					alert("Your token has expired. Redirecting you to the login page.");
					window.location.href = "https://pricepointwholesale.com/my-account";
				}
			}
		} catch (error) {
			console.error("Error fetching designs:", error);
		}
	}
	useEffect(() => {
		if (!designs) {
			fetchTheDesigns();
		}
	}, [designs]);

	return (
		<div className="container max-w-5xl mx-auto mt-12">
			<h1 className="text-3xl font-semibold leading-9 text-gray-900">
				Designs
			</h1>
			<Link href="https://pricepointwholesale.com/my-account">
				<p className="pt-4 text-blue-600">Back to My Account</p>
			</Link>
			<Button
				className="mt-4"
				text={
					designs?.length < 1 ? "Create your first design" : "Create new design"
				}
				onClick={() => setOpen(true)}
			/>
			<Modal open={open} handleClose={handleClose} wide>
				<DesignForm
					setOpen={setOpen}
					designs={designs}
					fetchTheDesigns={fetchTheDesigns}
					currentDesign={currentDesign}
					setCurrentDesign={setCurrentDesign}
				/>
			</Modal>

			<h2 className="text-2xl font-semibold leading-9 text-gray-900 mt-12">
				Existing Designs
			</h2>
			<div className=" gap-4 mt-4">
				{loading && !designs && "Loading..."}
         {designs && designs.length < 1 && "No designs yet"}
				 {designs?.map((design, index) => (
					<div
						key={index}
						className="bg-white shadow-md rounded-lg p-4 flex justify-between"
					>
						<h3 className="text-xl font-semibold leading-9 text-gray-900 col-span-3">
							{design.name}
						</h3>
            {console.log(design)}
            {JSON.parse(design.images).map((image, index) => {
              if(image.endsWith(".pdf")) {
                return <PDFLink key={index} pdfUrl={image} />
              } else {
                return <img key={index} src={image} alt="Template" className="w-12 h-12" />
              }
						})}
						<div className=" justify-end">
							<Button
								onClick={() => {
									setOpen(true);
									setCurrentDesign(design);
								}}
								text="Edit"
							/>
						</div>
					</div>
				))} 
			</div>
		</div>
	);
};

export default page;
