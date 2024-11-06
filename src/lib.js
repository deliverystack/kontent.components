
// simplify the structure of a kontent.ai item
export const flattenItem = (item) => {
    let flat = {};
    
    for (let key in item.elements) {
        flat[key] = item.elements[key].value;
    }

    return flat;
};

// get an the item with the specified codename from kontent.ai
export const getItem = async (codename) => {
    const httpHeaders = new Headers();
    const endpoint = `/${codename}.json`;
    httpHeaders.append('Accept', 'application/json');
    httpHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
        method: 'GET',
        headers: httpHeaders,
        redirect: 'follow',
    };

    //TODO: handle 404. etc

    const response = await fetch(endpoint, requestOptions);
    return await response.json();
}