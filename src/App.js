import React, { useEffect, useState } from 'react';
import CmsComponents from './components/CmsComponents.jsx';
import Stringify from './components/Stringify.jsx';
import { default as EmbedCmsEntry, default as UseCmsEntry } from './components/UseCmsEntry.jsx';
import { getItem } from "./lib";

function App() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (data) window.cmsPageItem = data;
    }, [data]);

    const getData = async () => {
        try {
            const result = await getItem(window.location.pathname.split('/').pop() || 'home');
            if (!result) {
                setIsNotFound(true); // If no data is returned, treat it as a 404
            } else {
                setData(result);
                setIsNotFound(false);
            }
        } catch (error) {
            console.log("Error fetching data:", error);
            setIsNotFound(true); // Set to true in case of error
        } finally {
            setIsLoading(false); // Stop loading after attempt
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isNotFound) {
        return (
            <div>
                <h1>404 - Content Not Found</h1>
                <p>
                    The content item for the URL path <code>{window.location.pathname}</code> could
                    not be found. Please check the item codename or update the configuration as needed.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="App">
                <CmsComponents componentsField="pagecontent__maincomponents" props={data} />
            </div>
            <UseCmsEntry props={data} />
            <Stringify props={data} />
            <EmbedCmsEntry props={data} />
        </>
    );
}

export default App;
