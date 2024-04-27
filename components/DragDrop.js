import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { getPresignedUrl } from "../app/actions"


const DragDrop = ({ imageUrl, setImageUrl, className }) => {
  const [loading, setLoading] = useState(false);
  const MAX_IMAGE_SIZE = 5000000;
  const [image, setImage] = useState();
  const [type, setType] = useState("");

  //DROPZONE stuff
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles && createImage(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const createImage = (file) => {
    if (!file.type) {
      return;
    }
    setType(file.type);
    let reader = new FileReader();
    reader.onload = (e) => {
      if (
        !e.target.result.includes("data:image/jpeg") &&
        !e.target.result.includes("data:image/png") &&
        !e.target.result.includes("data:image/webp")
      ) {
        setLoading(false);
        return alert("Wrong file type - JPG or PNG only.");
      }
      if (e.target.result.length > MAX_IMAGE_SIZE) {
        setLoading(false);
        return alert("Image is loo large - 5Mb maximum");
      }
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
    setLoading(true);
  };

  const uploadImage = async () => {
    // Get the presigned URL
    let response = await getPresignedUrl(type)
    
    let binary = atob(image.split(",")[1]);
    let array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    let blobData = new Blob([new Uint8Array(array)], { type: type });
    const result = await fetch(await response.uploadURL, {
      method: "PUT",
      body: blobData,
      headers: {
        "Content-Type": type,
      }, // e.g.: "video/mp4"
    });
    setImageUrl(result.url.split("?")[0]);
    setLoading(false);
  };

  useEffect(() => {
    image && uploadImage();
  }, [image]);

  return (
    <>
      <div {...getRootProps()} className={className}>
        <div style={{height:'140px', width:'250px'}} className=" mx-auto flex justify-center pt-5 pb-6 border border-black rounded-md">
          {imageUrl && imageUrl.length > 0 ? (
            <img src={imageUrl} alt="profile main cover" />
          ) : (
            <>
              {loading ? (
                <div className="flex my-auto justify-center">
                    Loading ...
                </div>
                
              ) : (
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                    </label>
                    <p className="ml-1"> or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}

              <input {...getInputProps()} />
            </>
          )}{" "}
        </div>
      </div>
    </>
  );
};
export default DragDrop;
