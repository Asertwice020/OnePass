// ImageCropper.jsx
import React, { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";

const ImageCropper = ({ onChange }) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    aspect: 1 / 1,
  });
  const imageRef = useRef(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = (image) => {
    imageRef.current = image;
  };

  const onCropComplete = (crop) => {
    makeClientCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        "newFile.jpeg"
      );
      onChange(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    const width = crop.width * scaleX;
    const height = crop.height * scaleY;
    const x = crop.x * scaleX;
    const y = crop.y * scaleY;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(src);
        const imageUrl = window.URL.createObjectURL(blob);
        resolve(imageUrl);
      }, "image/jpeg");
    });
  };

  return (
    <div>
      <input type="file" onChange={onSelectFile} />
      {src && (
        <ReactCrop
          src={src}
          onImageLoaded={onImageLoaded}
          crop={crop}
          onChange={(newCrop) => setCrop(newCrop)}
          onComplete={onCropComplete}
        />
      )}
    </div>
  );
};

export default ImageCropper;
