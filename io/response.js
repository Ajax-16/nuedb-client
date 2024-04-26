export function parseResponseHeaders(headers) {
    const headersObject = {};
    for (const header of headers) {
        const [key, value] = header.split("=").map(item => item.trim());
        headersObject[key] = value;
    }
    return headersObject;
}

export function parseResponse(responseString) {
    let [headers, body] = responseString.split("\r\n\r\n");
    [, ...headers] = headers.split("\r\n");

    headers = parseResponseHeaders(headers);
    if (body) {
        body = JSON.parse(body);
    }

    return {headers, body}

}