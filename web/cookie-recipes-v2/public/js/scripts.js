const load = new Promise((resolve) => {
    window.addEventListener('load', resolve)
})

const request = async (route, requestMethod, requestBody) => {
    try {
        let result;
        if (requestMethod === 'POST') {
            result = await fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
        } else {
            let url = new URL(route, window.location.origin);
            url.search = new URLSearchParams(requestBody);
            result = await fetch(url); 
        }
        return await result.json();
    } catch (error) {
        console.error(error);
        return { 'success': false };
    }
}

const getId = async () => {
    return await request('/api/getId', 'GET')
}
