import React, { useEffect } from 'react';

const UseCmsEntry = () => {
    useEffect(() => {
        if (window.cmsPageItem.item !== undefined)
            console.log(window.cmsPageItem);
      }, [])

    return(<></>)
}

export default UseCmsEntry;