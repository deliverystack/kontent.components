import { flattenItem } from '../lib.js';
//import Stringify from './Stringify.jsx';

const CmsBannerComponent = ({ props, component }) => {
    // simplify the structure of the kontent.ai item specified by the CMS component 
    const flattenedItem = flattenItem(props.modular_content[props.modular_content[component].elements.contentcomponent__contentitem.value]);

//return <Stringify title="Banner" props={flattenedItem.commoncontent__mainimage} />

        return(<>
            <h1>{flattenedItem.commoncontent__title}</h1>
            <img width="300" height="300" src={flattenedItem.commoncontent__mainimage[0].url} alt={flattenedItem.commoncontent__mainimage[0].name} />
            <p>{flattenedItem.commoncontent__description}</p>
        </>)
}

export default CmsBannerComponent;