import React, { useEffect } from 'react';

const UseCmsEntry = () => {
    useEffect(() => {
        if (window.cmsPageItem.item !== undefined) {
            document.title = window.cmsPageItem.item.elements.commoncontent__title.value;
            console.log(window.cmsPageItem);
        }

      }, [])

    return(<></>)
}

export default UseCmsEntry;