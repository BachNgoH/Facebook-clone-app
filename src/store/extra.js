
const base_url = "http://localhost:8003/";


export async function sendRequest(url, method, body, authToken) {

    const response = await fetch(`${base_url}${url}`, {
        method: method ? method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ""
        },
        body: body
    })
    return response
}