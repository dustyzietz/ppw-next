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
  deleteDesign,
  createMessage
} from "../actions";
import { token } from "@/components/utils/helperFunctions";
import ChatBubbles from "@/components/ChatBubbles";

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
  const [message, setMessage] = useState("");

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
      // create message
      const messageRes = await createMessage(token(), {
        design_id: res.design_id,
        message: message,
        from_admin: false,
        new: true,
        user_id: newDesign.user_id
      })

      try {
        if(messageRes.success) {
          console.log("Message sent successfully")
        } else {
          console.log("Something went wrong")
        }
      } catch (error) {
        console.log(error)
      }
  
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

  const handleDelete = async () => {
    if(confirm("Are you sure you want to delete this design?")) {
      try {
        const res = await deleteDesign(token(), currentDesign.Id);
        setNewDesign(initialDesign);
        fetchTheDesigns();
        setCurrentDesign(null);
        setOpen(false);
      } catch (error) {
        alert("Something went wrong")
        console.log(error)
      }
 
    }
  }

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

					<div className="sm:col-span-4">
						
						{template && <ImageOrPdfPreview imageUrl={template} />}
						{/* if image is pdf then show PDFLink */}
						{template && template.endsWith(".pdf") && (
							<PDFLink pdfUrl={template} />
						)}
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

        <div className="col-span-full">
            {currentDesign ? (
              <ChatBubbles />
            ) : (
              <>
              <label
							htmlFor="message"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							About
						</label>
						<div className="mt-2">
							<textarea
								id="message"
								name="message"
								rows={3}
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								placeholder="Tell us about your design."
							/>
						</div>
						</>
            )}
					</div>

				<div className="flex justify-end mt-8">
          <Button text="Delete" onClick={handleDelete} className="mr-4" />
        <Button className="mr-4" text="Cancel" onClick={() => {fetchTheDesigns();setCurrentDesign(null);setOpen(false)}} />
					<Button onClick={handleSubmit} text="Submit" />
				</div>
			</div>
		</form>
	);
};

export default DesignForm;
