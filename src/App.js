import React, { useEffect, useState } from 'react';
import CmsComponents from './components/CmsComponents.jsx';
import Stringify from './components/Stringify.jsx';
import UseCmsItem from './components/UseCmsItem.jsx';
import { getItem } from "./lib";

function App() {
    // handle async API call to get item
    const [data, setData] = useState([]);
    
    useEffect(() => {
        getData();
    }, []);
    
    // make item JSON available to client-side logic
    // example:
    // const UseCmsEntry = () => {
    //     useEffect(() => {
    //         if (window.cmsPageItem.item !== undefined)
    //             console.log(window.cmsPageItem);
    //         }, [])
    // 
    //     return(<></>)
    // }
    useEffect(() => {
        window.cmsPageItem = data;
    }, [data]);

    const getData = async () => {
        try {
            // reduce requested URL path to last segment
            // which should be a the codename of a Kontent.ai item.
            var pagecode = window.location.pathname.split('/').pop() || 'home'
            const response = await getItem(pagecode);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.log(error); //TODO: error management
        }
    };
  
    // this will happen until the fetch returns the Kontent.ai item JSON
    if (data.length < 1) {
        return <>Loading...</>;
    }

    // if no such item exists in Kontent.ai
    if (data["error_code"] === 100 || data["error_code"] === 1 || !data.item) {
        return <>Handle HTTP 404 - {window.location.pathname.split('/').pop() || 'home'} (last segment of URL path) does not specify a valid Kontent.ai item codename. Replace &lt;ENVIRONMENT_ID&gt; in /src/lib.js if needed.
        <pre>{JSON.stringify(data, null, 2)};</pre></>
    }

    return (<>
        <div className="App">
            <CmsComponents componentsField="pagecontent__maincomponents" props={data}/>
        </div>
        <UseCmsItem />
        <Stringify props={data} />
    </>);
}

export default App;
