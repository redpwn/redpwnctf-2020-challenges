(async () => {
    await new Promise((resolve) => {
        window.addEventListener('load', resolve);
    });

    const form = document.getElementById('login');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const res = await fetch('/api/flag', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });
        
        if (res.status !== 200) {
            return;
        }

        const json = await res.json(); 

        if (! json) {
            return;
        }

        if (json.success) {
            alert(json.flag);
            return;
        }

        alert(json.error);
    });
})();
