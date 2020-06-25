(async () => {
    await new Promise((resolve) => {
        window.addEventListener('load', resolve);
    });

    const userInfo = await (await fetch('/api/validate')).json();

    if (userInfo.success) {
        window.location = '/pandas/';
    }

    const form = document.getElementById('enter');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const res = await fetch('/api/login', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username}),
        });
        const json = await res.json(); 
        document.cookie = `token=${json.token}`;
        window.location = '/pandas/';
    });
})();
