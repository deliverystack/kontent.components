import { useEffect, useState } from 'react';
import { getItem } from '../lib';

const getImages = async (component) => {
    const images = [];
    const imageItems = component.elements?.imageitems?.value;
    if (!imageItems) return images;

    for (const imagesItemCode of imageItems) {
        const imagesItem = await getItem(imagesItemCode);

        if (imagesItem && imagesItem.elements?.images?.value) {
            imagesItem.elements.images.value.forEach((image) => {
                images.push({ name: image.name, url: image.url });
            });
        }
    }

    return images;
};

const CmsImagesComponent = ({ props, component }) => {
    const [images, setImages] = useState([]);
    const [treatment, setTreatment] = useState(null);
    const [imageHeight, setImageHeight] = useState(300);
    const [imageWidth, setImageWidth] = useState(300);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImagesData = async () => {
            const componentData = component;
            const fetchedImages = await getImages(component);
            setImages(fetchedImages);
            setTreatment(componentData.elements?.treatment?.value?.[0]?.codename);
            setImageHeight(componentData.elements?.imageheight?.value || 300);
            setImageWidth(componentData.elements?.imagewidth?.value || 300);
            setIsLoading(false);
        };

        fetchImagesData();
    }, [component]);

    if (isLoading) return <div>Loading images...</div>;

    switch (treatment) {
        case "gallery":
            return (
                <>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            height={imageHeight}
                            width={imageWidth}
                            src={image.url}
                            alt={image.name || "Image"}
                        />
                    ))}
                </>
            );
        default:
            return <>Update CmsImagesComponent to handle '{treatment}' treatment.</>;
    }
};

export default CmsImagesComponent;