import { getItem } from "../lib";

import { useEffect, useState } from 'react';
import { flattenItem } from '../lib.js';

const CmsBannerComponent = ({ props, component }) => {
    const [flattenedItem, setFlattenedItem] = useState(null);

    useEffect(() => {
        const fetchAndFlattenItem = async () => {
            try {
                const item = await getItem(component.elements.contentcomponent__contentitem.value[0]);  
                const flattenedData = flattenItem(item);
                setFlattenedItem(flattenedData);
            } catch (error) {
                console.error("Error fetching or flattening item:", error);
            }
        };

        fetchAndFlattenItem();
    }, [component]);

    if (!flattenedItem) {
        return <div>Loading...</div>; 
    }

    return (
        <>
            <h1>{flattenedItem.commoncontent__title}</h1>
            <img
                width="300"
                height="300"
                src={flattenedItem.commoncontent__mainimage[0]?.url}
                alt={flattenedItem.commoncontent__mainimage[0]?.name || 'Image'}
            />
            <p>{flattenedItem.commoncontent__description}</p>
        </>
    );
};

export default CmsBannerComponent;