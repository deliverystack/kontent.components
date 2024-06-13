// simplify the structure of a kontent.ai item
export const flattenItem = (item) => {
    let flat = {};
    
    for (let key in item.elements) {
        flat[key] = item.elements[key].value;
    }

    return flat;
};

// get an the item with the specified codename from kontent.ai
export const getItem = (codename) => {
    const endpoint = 'https://deliver.kontent.ai/<ENVIRONMENT_ID>/items/' + codename + "?depth=2";
    const httpHeaders = new Headers();
    httpHeaders.append('Accept', 'application/json');
    httpHeaders.append('Content-Type', 'application/json');
    const requestOptions = {
        method: 'GET',
        headers: httpHeaders,
        redirect: 'follow',
    };

    // happens twice in dev mode when <React.StrictMode> in index.js
    // console.log(endpoint);

    return fetch(
        endpoint,
        requestOptions
    )
    .catch((error) => {
        //TODO: error management
        console.log(error); 
    });
}