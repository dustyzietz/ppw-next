import React, { useState } from "react";
import Modal from "../../components/Modal";
import DragDrop from "@/components/DragDrop";
import Button from "@/components/Button";
import { addTemplate, updateTemplate } from "../actions";
import ImageOrPdfPreview from "@/components/ImageOrPdfPreview";

const AddTemplateModal = ({ product_id, template_id, oldTemplate, getTemplates }) => {
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    
    const handleUpdateTemplate = async () => {
      const token = document.cookie
      .split("; ")
      ?.find((row) => row.startsWith("token="))
      ?.split("=")[1];
      const data = {
        template_id,
        template: imageUrl,
        product_id,
    };
    try {
       await updateTemplate(token, data);
       alert("Template Updated" )
       getTemplates();
       setOpen(false);
      } catch (error) {
       console.log(error);
       alert("Error Updating Template")
       setOpen(false);
      }  
    }

    const handleAddTemplate = async () => {
        const data = {
            product_id,
            template: imageUrl,
        };
        const token = document.cookie
            .split("; ")
            ?.find((row) => row.startsWith("token="))
            ?.split("=")[1];
       try {
        await addTemplate(token, data);
        alert("New Template Created")
        getTemplates();
        setOpen(false);
       } catch (error) {
        console.log(error);
        alert("Error Creating Template")
        setOpen(false);
       }  
    };
      
    return (
        <>
            <Button onClick={() => setOpen(true)} text={template_id ? "Edit Template" : "Add Template" } />
            <Modal open={open} handleClose={() => setOpen(false)}>
              <div className="p-6">
                <h1>{template_id ? "Edit Template" : "Add Template" }</h1>
                <h2>Product ID: {product_id}</h2>
                {template_id && <h2>Template ID: {template_id}</h2>}  
                {oldTemplate && <>
                  <h2>Current Template:</h2>
                  <ImageOrPdfPreview imageUrl={oldTemplate} />
                </>}
                <h2 className="pt-6">New Template Image:</h2>
                <DragDrop className="pb-6" imageUrl={imageUrl} setImageUrl={setImageUrl} />
                <Button onClick={template_id ? handleUpdateTemplate : handleAddTemplate} text="Save" />
                </div>
            </Modal>
        </>
    );
};

export default AddTemplateModal;
