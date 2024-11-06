import React, { useEffect } from 'react';

const UseCmsEntry = (props) => {
    console.log("UseCmsEntry") ;
    console.log(props);
    console.log(JSON.stringify(props));

    useEffect(() => {
        if (window.cmsPageItem !== undefined && window.cmsPageItem !== undefined) {
            document.title = window.cmsPageItem.elements.commoncontent__title.value;
        }
      }, [])

    return(<></>)
}

export default UseCmsEntry;