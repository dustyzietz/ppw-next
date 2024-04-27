import React, { useState } from "react";
import Button from "./Button";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

const Dropdown = ({ buttonText, children, open, setOpen }) => {

	return (
		<div className={`${open ? "relative" : ""}`}>
			<Button text={<>{buttonText} {open ? <ChevronUpIcon className="w-6 h-6 inline" /> : <ChevronDownIcon className="w-6 h-6 inline" />}</>} onClick={() => setOpen(!open)} />
			{open && <div className="absolute z-50 w-96 right-0  bg-white rounded border shadow-xl ">{children}</div>}
		</div>
	);
};

export default Dropdown;
