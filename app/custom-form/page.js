"use client";
import Button from "@/components/Button";
import React, { useState, useEffect } from "react";
import {
    createDesign,
    fetchCurrentUser,
    fetchDesigns,
    fetchProducts,
} from "../actions";
import DragDrop from "../../components/DragDrop";
import ImageGallery from "../../components/ImageGallery";
import Link from "next/link";

const page = () => {
    const initialDesign = {
        user_id: null,
        email: "",
        name: "",
        template: "",
        images: [],
        conversation: [],
        product_id: 0,
    };

    const [designs, setDesigns] = useState([]);
    const [newDesign, setNewDesign] = useState(initialDesign);
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    let token 

    useEffect(() => {
         token = document.cookie
         .split("; ")
         ?.find((row) => row.startsWith("token="))
         ?.split("=")[1];
         
        async function fetchUser() {

            const userData = await fetchCurrentUser(token);
            setUser(userData);
            setNewDesign({
                ...newDesign,
                user_id: userData?.user_id,
                email: userData?.email,
            });
        }
        fetchUser();

        fetchTheDesigns();

        async function fetchTheProducts() {
            const products = await fetchProducts();
            setProducts(products);
        }
        fetchTheProducts();
    }, []);

    async function fetchTheDesigns() {
        const designs = await fetchDesigns(token);
        setDesigns(designs);
    }

    const handleSaveImage = () => {
        if (imageUrl?.length) {
            const newImages = [...newDesign.images, imageUrl];
            setNewDesign({ ...newDesign, images: newImages });
            setImageUrl("");
        } else {
            alert("Please Uplead Image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = document.cookie
            .split("; ")
            ?.find((row) => row.startsWith("token="))
            ?.split("=")[1];

        const res = await createDesign(token, newDesign);
        if(res.design_id){
            setNewDesign(initialDesign);
            fetchTheDesigns();
        }
    };

    const onChange = (e) => {
        setNewDesign({ ...newDesign, [e.target.name]: e.target.value });
    };

    const updateConversation = (e) => {
        setNewDesign({
            ...newDesign,
            conversation: [
                {
                    user_id: newDesign.user_id,
                    text: e.target.value,
                },
            ],
        });
    };

    const { user_id, email, name, template, images, conversation, product_id } =
        newDesign;
    return (
        <div className="container max-w-5xl mx-auto mt-12">
            <h1 className="text-3xl font-semibold leading-9 text-gray-900">
                Designs
            </h1>
            <Link  href="https://pricepointwholesale.com/my-account"><p className="pt-4 text-blue-600">Back to My Account</p></Link>
            {/* If there are no designs show the form, else show an Create New Design button */}
            {designs.length === 0 || newDesign ? (
                <form>
                    <div className="space-y-12 border rounded p-6 m-8">
                        <h2 className="text-xl font-semibold">
                            {designs.length > 1
                                ? "Create your first design"
                                : "Create new design"}{" "}
                            <div className="float-right">
                                <Button onClick={handleSubmit} text="Submit" />
                            </div>
                        </h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Design Name
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={name}
                                            onChange={(e) => onChange(e)}
                                            autoComplete="name"
                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                            placeholder="My Awesome Design"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-4">
                                <label
                                    htmlFor="product_id"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Product
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="product_id"
                                        name="product_id"
                                        value={product_id}
                                        onChange={(e) => onChange(e)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                                    >
                                        <option value={0}>
                                            No Product Selected
                                        </option>
                                        {products?.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <p className="bg-blue-100 sm:col-span-4">
                                Once Template selected the template and product
                                dimensions will be displayed here.
                                <br />
                                Also there will be a button to download the
                                template pdf.
                            </p>

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
                                        value={conversation[0]?.text}
                                        onChange={(e) => updateConversation(e)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={""}
                                        placeholder="Tell us about your design."
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                    Write a few sentences about your custom
                                    product design requirements.
                                </p>
                            </div>

                            <div className="col-span-full">
                                <label
                                    htmlFor="cover-photo"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Upload images.
                                </label>
                                <DragDrop
                                    imageUrl={imageUrl}
                                    setImageUrl={setImageUrl}
                                />
                                <Button onClick={handleSaveImage} text="Save" />
                            </div>
                            </div>
                            <div className="col-span-full">
                            <h2>Images </h2>
                            <ImageGallery images={images} />
                            </div>
                        
                    

                        <div className="flex justify-end mt-8">
                            <Button onClick={handleSubmit} text="Submit" />
                        </div>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setNewDesign(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create New Design
                </button>
            )}

            <h2 className="text-2xl font-semibold leading-9 text-gray-900 mt-12">
                Existing Designs
            </h2>
            <div className="grid grid-cols-1 gap-4 mt-4">
                {designs?.map((design, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-4 grid grid-cols-6"
                    >
                        <h3 className="text-xl font-semibold leading-9 text-gray-900 col-span-3">
                            {design.name}
                        </h3>
                        <p className="text-gray-600 col-span-2">
                            {design.template}
                        </p>
                        <div className=" justify-end">
                            <Button text="Edit" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default page;
