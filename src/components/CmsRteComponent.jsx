import Handlebars from "handlebars";
import { flattenItem } from '../lib.js';

const CmsRteComponent = ({ props, component }) => {
    // the codename of the item that contains the RTE field that may contain handlebars templates
    const rteTemplateItemCode = props.modular_content[component].elements.rtetemplate.value[0];
  
    // the value of the RTE field in that item that may contain handlebars templates
    const handlebarsTemplate = props.modular_content[rteTemplateItemCode].elements.rtetemplate.value;

    // the codename of the content item for handlebars templates to process
    const contentItemCode = props.modular_content[component].elements.contentcomponent__contentitem.value[0];

    // that content item in a simplified structure for handlebars templates to process
    const flattenedItem = flattenItem(props.modular_content[contentItemCode]);

    // compile and apply the handlebars template to the content item
    // this is only unsafe if we don't trust our CMS users
    // in which case we're already hosed
    return (<div dangerouslySetInnerHTML={ {__html: Handlebars.compile(handlebarsTemplate)(flattenedItem)} } />);
}

export default CmsRteComponent;