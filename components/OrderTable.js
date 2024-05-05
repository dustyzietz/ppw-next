import React, { Fragment } from "react";
import { linkDesign } from "../app/actions";
import { useRouter } from "next/navigation";
import LineItem from "./LineItem";

const OrderTable = ({
	title,
	description,
	headers,
	data,
	designs,
	fetchProductDesigns,
  setProductDesigns,
  customProducts
}) => {

	const token = () =>
		document.cookie
			.split("; ")
			?.find((row) => row.startsWith("token="))
			?.split("=")[1];

      const handleFetchProductDesigns = async () => {
        try {
            const productDesignData = await fetchProductDesigns(token());
            setProductDesigns(productDesignData);
        } catch (error) {
            console.log(error);
            alert("Error");
        }
    }

	const handleLinkDesign = (designId, userId, orderProductId, setOpen) => {
		const data = {
			user_id: userId,
			order_product_id: orderProductId,
			design_id: designId,
		};
		console.log(designId, userId, orderProductId);
		linkDesign(token(), data);
		handleFetchProductDesigns();
		setOpen(false);
	};
	return (
		<div className="container max-w-5xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
			{title && (
				<h2 className="text-2xl font-semibold leading-9 text-gray-900">
					{title}
				</h2>
			)}
			{description && (
				<div className="mt-4 sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<p className="text-base font-semibold leading-6 text-gray-900">
							{description}
						</p>
					</div>
				</div>
			)}
			<div className="flow-root">
				<div className="inline-block min-w-full py-2 align-middle">
					<table className="min-w-full divide-y divide-gray-300">
						<thead>
							<tr>
								{headers.map((header) => (
									<th
										key={header}
										scope="col"
										className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white">
							{data?.map((order, i) => (
								<Fragment key={i}>
									<tr className="bg-gray-100">
										{order.row.map((cell, i) => (
											<td
												key={i}
												className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
											>
												{cell}
											</td>
										))}
									</tr>
									{order.lineItems.map((lineItem, i) => {
                   if(customProducts.some(product => product.id === lineItem.product_id)) {
                    // TODO need to detect if lineItem is custom
                    return <LineItem key={i} lineItem={lineItem} designs={designs} i={i} handleLinkDesign={handleLinkDesign} />;
                   }
									})}
								</Fragment>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default OrderTable;
