import React, { useState, Fragment, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import Icon from '../../Icon/Icon';

const NewPostEdit = ({ previewImage, setPreviewImage, file }) => {
  const [imageState, setImageState] = useState({
    crop: { unit: '%', aspect: 16 / 9 },
    isCropping: false,
  });
  const imageRef = useRef();

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = 'cropped.jpeg';
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, 'image/jpeg');
    });
  };

  const makeClientCrop = async (crop) => {
    window.URL.revokeObjectURL(previewImage.src);
    if (imageState.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageState.imageRef,
        crop,
        'newFile.jpeg'
      );
      setPreviewImage({ src: croppedImageUrl, crop });
      setImageState((previous) => ({ ...previous, isCropping: false }));
    }
  };

  const onCropChange = (crop, percentCrop) => {
    setImageState((previous) => ({
      ...previous,
      crop,
    }));
  };

  const onImageLoaded = (image) => {
    setImageState((previous) => ({ ...previous, imageRef: image }));
  };

  const onDragStart = () => {
    setImageState((previous) => ({ ...previous, isCropping: true }));
  };

  return (
    <Fragment>
      <div className="new-post__preview">
        <div className="new-post__preview-image-container">
          <ReactCrop
            src={previewImage.src}
            crop={imageState.crop}
            onChange={onCropChange}
            onImageLoaded={onImageLoaded}
            onDragStart={onDragStart}
            style={{ width: '100%', height: '100%' }}
            ref={imageRef}
            imageStyle={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: previewImage.filter,
            }}
            ruleOfThirds
          />
          <Icon
            icon="checkmark-outline"
            className="new-post__crop-button"
            style={imageState.isCropping ? { display: 'inline-block' } : {}}
            onClick={() => makeClientCrop(imageState.crop)}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default NewPostEdit;
