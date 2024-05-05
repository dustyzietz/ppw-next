import React, { useState } from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";

const LineItem = ({ lineItem, designs, i, handleLinkDesign }) => {
	const [open, setOpen] = useState(false);
	return (
		<tr key={i}>
			
			<td colSpan={5}>
				<div className="border border-gray-400">
					<div className="flex justify-between items-center">
          <img src={lineItem.image.src} alt={lineItem.name} className="w-16 h-16 m-1" />
						<div> {lineItem.name}</div>
						<div>Quantity: {lineItem.quantity}</div>
						<div>
							{lineItem.designData ? (
								lineItem.designData.name
							) : (
								<Dropdown
									buttonText="Select Design"
									open={open}
									setOpen={setOpen}
								>
									<>
										<ul className="p-2">
											{designs?.map((design, i) => {
												if (lineItem.product_id === +design.product_id) {
													return (
														<li
															className="flex justify-between border items-center p-2"
															key={i}
														>
															<p>{design.name}</p>
															<Button
																onClick={() =>
																	handleLinkDesign(
																		design.Id,
																		design.user_id,
																		lineItem.id,
																		setOpen
																	)
																}
																className=" py-1 px-2 "
																text="Select"
															/>
														</li>
													);
												}
											})}
										</ul>
										<Button
											className="mt-4 w-full text-center"
											text="Create New Design"
											onClick={() => router.push("/custom-form")}
										/>
									</>
								</Dropdown>
							)}
						</div>
						{/* <div className="pr-8">Total: {lineItem.total}</div> */}
					</div>
				</div>
			</td>
		</tr>
	);
};

export default LineItem;
