import React, { useEffect, useState } from "react";
import { getItem } from "../lib";
import CmsBannerComponent from "./CmsBannerComponent.jsx";
import CmsImagesComponent from "./CmsImagesComponent.jsx";
import CmsRteComponent from "./CmsRteComponent.jsx";

const CmsComponents = ({ props, componentsField }) => {
    const [componentsData, setComponentsData] = useState([]);

    useEffect(() => {
        const fetchComponents = async () => {
            const componentPromises = props.elements[componentsField].value.map((component) => 
                getItem(component)
            );
            const resolvedComponents = await Promise.all(componentPromises);
            setComponentsData(resolvedComponents);
        };

        fetchComponents();
    }, [props, componentsField]);

    return (
        <>
            {componentsData.map((componentData, index) => {
                const componentType = componentData.system.type;

                switch (componentType) {
                    case "rtecomponent":
                        return (
                            <CmsRteComponent
                                props={props}
                                component={componentData}
                                key={index}
                            />
                        );
                    case "imagecollectioncomponent":
                        return (
                            <CmsImagesComponent
                                props={props}
                                component={componentData}
                                key={index}
                            />
                        );
                    case "bannercomponent":
                        return (
                            <CmsBannerComponent
                                props={props}
                                component={componentData}
                                key={index}
                            />
                        );
                    default:
                        return (
                            <div key={index}>
                                Update CmsComponents.jsx to handle {componentType}
                            </div>
                        );
                }
            })}
        </>
    );
};

export default CmsComponents;
