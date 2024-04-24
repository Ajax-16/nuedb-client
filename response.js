export function parseResponseHeaders(headers) {
    const headersObject = {};
    for (const header of headers) {
        const [key, value] = header.split("=").map(item => item.trim());
        headersObject[key] = value;
    }
    return headersObject;
 }
 