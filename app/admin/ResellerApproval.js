import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { updateReseller } from "@/app/actions";

export default function ResellerApproval({ reseller, getAllResellers }) {
	const [message, setMessage] = useState("");
	const [open, setOpen] = useState(false);

	const token = () => {
		return document.cookie
			.split("; ")
			?.find((row) => row.startsWith("token="))
			?.split("=")[1];
	};

	const handleApprove = async () => {
		try {
			const res = await updateReseller(token(), {
				...reseller,
				status: "approved",
			});
			if (res.success) {
				getAllResellers();
				alert("The application has been updated");
			}
		} catch (error) {
			console.log(error);
		}
		setOpen(false);
	};

	const handleReject = async () => {
		try {
			const res = await updateReseller(token(), {
				...reseller,
				message,
				status: "rejected",
			});
			if (res.success) {
				getAllResellers();
				alert("The application has been updated");
			}
		} catch (error) {
			console.log(error);
		}
		setOpen(false);
	};

	return (
		<>
			<Button text="Edit" onClick={() => setOpen(true)} />
			<Modal open={open} handleClose={() => setOpen(false)}>
        <div className="m-10">
				<h2>Approve Reseller</h2>
				<Button text="Approve" className="m-6" onClick={() => handleApprove()} />
				<br />
				OR
				<br />
				<Button text="Reject"  className="m-6"  onClick={() => handleReject()} />
				<textarea
					id="about"
					name="about"
					rows={3}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					placeholder="Changes Requested"
				/>
				<Button text="Cancel"  className="m-6"  onClick={() => setOpen(false)} />
        </div>
			</Modal>
		</>
	);
}
