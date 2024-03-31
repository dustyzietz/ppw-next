import React from "react";

const List = ({ listItems, listHeader, numbered }) => {
    return (
        <>
            <h3 className="mb-2 mt-12 text-xl text-left">{listHeader}</h3>
            <ul className="text-left">
                {listItems.map((item, index) => (
                    <li key={index} className="py-1 px-4 mx-auto">
                        <h4 className="text-sm font-semibold leading-6 text-gray-900">
                            {numbered && <span>{index + 1}. </span>}{item.header}
                        </h4>
                        <p className=" line-clamp-2 text-sm leading-6 text-gray-600">
                            {item.body}
                        </p>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default List;
