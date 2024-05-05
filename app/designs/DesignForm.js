import { useState, useEffect } from "react";
import DragDrop from "../../components/DragDrop";
import ImageGallery from "../../components/ImageGallery";
import ImageOrPdfPreview from "../../components/ImageOrPdfPreview";
import PDFLink from "@/components/PDFLink";
import Button from "@/components/Button";
import {
	createDesign,
	fetchCurrentUser,
	fetchCustomProducts,
	fetchTemplates,
} from "../actions";
import { token } from "@/components/utils/helperFunctions";

const DesignForm = ({
	designs,
	fetchTheDesigns,
	currentDesign,
	setOpen,
	setCurrentDesign,
  setLoading
}) => {
	const initialDesign = {
		user_id: null,
		email: "",
		name: "",
		template: "",
		images: [],
		conversation: [],
		product_id: 0,
	};

	const [imageUrl, setImageUrl] = useState("");
	const [newDesign, setNewDesign] = useState(
		currentDesign
			? { ...currentDesign, images: JSON.parse(currentDesign.images) }
			: initialDesign
	);
	const [templates, setTemplates] = useState([]);
	const [user, setUser] = useState(null);
	const [products, setProducts] = useState(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				const userData = await fetchCurrentUser(token());
				setUser(userData);
				setNewDesign({
					...newDesign,
					user_id: userData?.user_id,
					email: userData?.email,
				});
			} catch (error) {
				setLoading(false);
				console.log(error);
			}
		}
		fetchUser();

		async function fetchTheProducts() {
			try {
				const products = await fetchCustomProducts();
				// console.log(products)
				setProducts(products);
			} catch (error) {
				console.log(error);
			}
		}
		fetchTheProducts();

		async function fetchTheTemplates() {
			const templates = await fetchTemplates(token());
			setTemplates(templates);
		}
		fetchTheTemplates();
	}, []);

	useEffect(() => {
		// fetch the template linked to that product id.
		if (newDesign.product_id) {
			const template = templates.find(
				(template) => template.product_id === newDesign.product_id
			);
			setNewDesign({ ...newDesign, template: template?.template });
		}
	}, [newDesign.product_id]);

	const handleSaveImage = () => {
		if (imageUrl?.length) {
			const newImages = [...newDesign.images, imageUrl];
			setNewDesign({ ...newDesign, images: newImages });
			setImageUrl("");
		} else {
			alert("Please Upload Image");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await createDesign(token(), {
			...newDesign,
			images: JSON.stringify(newDesign.images),
		});
		if (res.design_id || res?.message === "Design updated successfully.") {
			setNewDesign(initialDesign);
			fetchTheDesigns();
			setCurrentDesign(null);
			setOpen(false);
		} else {
			console.log(res);
			alert("Something went wrong");
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

	const { name, template, images, conversation, product_id } = newDesign;

	return (
		<form>
			<div className="space-y-12 border rounded p-6 m-8">
				<h2 className="text-xl font-semibold">
					{designs.length < 1
						? "Create your first design"
						: "Create new design"}{" "}
					<div className="float-right">
          <Button className="mr-4" text="Cancel" onClick={() => {fetchTheDesigns();setCurrentDesign(null);setOpen(false)}} />
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
								<option value={0}>No Product Selected</option>
								{products?.map((product) => (
									<option key={product.id} value={product.id}>
										{product.name}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="bg-blue-100 sm:col-span-4">
						{!template && (
							<p>
								Once Template selected the template and product dimensions will
								be displayed here.
								<br />
								Also there will be a button to download the template pdf.
							</p>
						)}
						{template && <ImageOrPdfPreview imageUrl={template} />}
						{/* if image is pdf then show PDFLink */}
						{template && template.endsWith(".pdf") && (
							<PDFLink pdfUrl={template} />
						)}
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
								value={conversation[0]?.text}
								onChange={(e) => updateConversation(e)}
								className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								defaultValue={""}
								placeholder="Tell us about your design."
							/>
						</div>
						<p className="mt-3 text-sm leading-6 text-gray-600">
							Write a few sentences about your custom product design
							requirements.
						</p>
					</div>

					<div className="col-span-full">
						<label
							htmlFor="cover-photo"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Upload images.
						</label>
						<DragDrop imageUrl={imageUrl} setImageUrl={setImageUrl} />
        
						<Button onClick={handleSaveImage} text="Save" />
					</div>
				</div>

				<div className="col-span-full">
					<h2 className="text-xl font-semibold">Images </h2>
					{images && <ImageGallery images={images} />}
				</div>

				<div className="flex justify-end mt-8">
        <Button className="mr-4" text="Cancel" onClick={() => {fetchTheDesigns();setCurrentDesign(null);setOpen(false)}} />
					<Button onClick={handleSubmit} text="Submit" />
				</div>
			</div>
		</form>
	);
};

export default DesignForm;
