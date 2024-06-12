import CmsBannerComponent from "./CmsBannerComponent.jsx";
import CmsImagesComponent from "./CmsImagesComponent.jsx";
import CmsRteComponent from "./CmsRteComponent.jsx";

const CmsComponents = ({props, componentsField}) => {
    return (<>{
        // for each CMS component
        props.item.elements[componentsField].value.map(component => {

        // switch on the content type of the CMS component
        const componentType = props.modular_content[component].system.type;

        switch (componentType) {
            case "rtecomponent":
                return (<CmsRteComponent props={props} component={component} key={Math.random()} />);
            case "imagecollectioncomponent":
                    return (<CmsImagesComponent props={props} component={component} key={Math.random()}/>);
            case "bannercomponent":
                return (<CmsBannerComponent props={props} component={component} key={Math.random()}/>);
            default:
                return (<div>Update CmsComponents.jsx to handle {componentType}</div>);
        }})
    }</>)
}

export default CmsComponents;