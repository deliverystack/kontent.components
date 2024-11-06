import Handlebars from "handlebars";
import { useEffect, useState } from 'react';
import { flattenItem, getItem } from '../lib.js';

const CmsRteComponent = ({ component }) => {
    const [flattenedItem, setFlattenedItem] = useState(null);
    const [handlebarsTemplate, setHandlebarsTemplate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTemplateData = async () => {
            try {
                // Fetch the item containing the RTE template
                const rteTemplateItemCode = component.elements?.rtetemplate?.value?.[0];
                const rteTemplateData = rteTemplateItemCode ? await getItem(rteTemplateItemCode) : null;

                // Extract the handlebars template
                const template = rteTemplateData?.elements?.rtetemplate?.value || '';
                setHandlebarsTemplate(template);

                // Fetch the content item for handlebars templates to process
                const contentItemCode = component.elements?.contentcomponent__contentitem?.value?.[0];
                const contentItemData = contentItemCode ? await getItem(contentItemCode) : null;

                // Flatten the content item for use with Handlebars
                const flattenedData = contentItemData ? flattenItem(contentItemData) : null;
                setFlattenedItem(flattenedData);

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchTemplateData();
    }, [component]);

    if (isLoading) return <div>Loading content...</div>;

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: Handlebars.compile(handlebarsTemplate)(flattenedItem || {}),
            }}
        />
    );
};

export default CmsRteComponent;