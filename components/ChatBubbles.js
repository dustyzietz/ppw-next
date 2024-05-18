import React from "react";
import Button from "./Button";
import { useState } from "react";

const ChatBubbles = () => {
	const [showInput, setShowInput] = useState(false);
	return (
		<>
			<h2 className="text-2xl font-bold">Conversation: </h2>
			<div className="flex items-center justify-start w-full">
				<div className="bg-green-100 border-green-600 border p-4 pb-2 my-4 rounded-lg flex-1 max-w-2xl">
					<span className="font-bold">Me: </span>🔥🔥🔥🔥Lorem ipsum dolor sit
					amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel
					sint commodi repudiandae consequuntur voluptatum laborum numquam
					blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
					optio, eaque rerum!
					<div className="flex items-center justify-end">
						<span className="text-sm text-green-600">11/11/23 10:00</span>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-end w-full ">
				<div className="bg-blue-100 border-blue-600 border p-4 pb-2 justify-end my-4 rounded-lg flex-1 max-w-2xl">
					<span className="font-bold">PPW: </span>Lorem ipsum dolor sit amet
					consectetur adipisicing elit. 😅
					<div className="flex items-center justify-end">
						<span className="text-sm text-blue-600">11/11/23 10:00PM</span>
					</div>
				</div>
			</div>

			{showInput ? (
				<div className="flex w-full items-center">
					<textarea className="bg-green-100 border-green-600 border p-4 pb-2 my-4 rounded-lg flex-1 w-full max-w-2xl h-20"></textarea>
					<Button text="Send" className="bg-green-600 h-12 m-6" />
					<Button
						onClick={() => setShowInput(false)}
						text="Cancel"
						className="bg-white border-green-600 border text-green-600 h-12"
					/>
				</div>
			) : (
				<button
					onClick={() => setShowInput(true)}
					className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full border-green-600 border"
				>
					<span className="text-2xl font-bold text-green-600">+</span>
				</button>
			)}
		</>
	);
};

export default ChatBubbles;
