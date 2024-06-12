//import Stringify from "./Stringify.jsx";
// return an array of objects that contain the required image properties
const getImages = (props, component) => {
    let images = [];
    
    // for each entry that the CMS component specifies, which references images 
    props.modular_content[component].elements.imageitems.value.forEach(imagesItemCode => {

        // for each of those referenced images
        props.modular_content[imagesItemCode].elements.images.value.forEach(image => {
            images.push({ name: image.name, url: image.url });
        });
    });

    return images;
};

const CmsImagesComponent = ({ props, component }) => {
    let images = getImages(props, component);
    const treatment = props.modular_content[component].elements.treatment.value[0].codename;
    const imageHeight = props.modular_content[component].elements.imageheight.value;
    const imageWidth = props.modular_content[component].elements.imagewidth.value;

    switch (treatment) {
        case "gallery":
            return (<>{
                images.map((image) => <img height={imageHeight} width={imageWidth} src={image.url} alt={image.name} key={Math.random()} />)
            }</>);
        default:
            return (<>Update ImagesComponent.jsx to handle {treatment} treatment.</>);
    }
}

export default CmsImagesComponent;