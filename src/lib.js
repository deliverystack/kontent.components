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
    //TODO: avoid hard-coding
//    const endpoint = 'https://deliver.kontent.ai/7b7502e3-148e-0051-c8b8-bf5155d8b1e8/items/' + codename + "?depth=2";
    const endpoint = 'https://deliver.kontent.ai/97d53770-a796-0065-c458-d65e6dcfc537/items/' + codename + "?depth=2";
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