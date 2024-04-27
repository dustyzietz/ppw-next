import React, { Fragment } from "react";

const Table = ({ title, description, headers, data }) => {
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
                <div className=" overflow-x-auto ">
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
                                        <tr className="even:bg-gray-100">
                                            {order.row.map((cell, i) => (
                                                <td key={i} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
