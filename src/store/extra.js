
export const base_url = "http://localhost:8000/";
export const base_ws_url = "127.0.0.1:8000/"

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