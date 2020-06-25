(async () => {
    if ((await getId()).success) {
        window.location.replace('/store/');
    }
    await load; 
    const tabs = {
        'Login': document.getElementById('login-tab'),
        'Register': document.getElementById('register-tab')
    }
    let currentTab = 'Login';
    for (const tab in tabs) {
        tabs[tab].addEventListener('click', () => {
            currentTab = tab;
            for (const tab in tabs) {
                tabs[tab].classList.remove('active');
            }
            tabs[tab].classList.add('active');
            document.getElementById('form-header').textContent = tab;
        })
    }
    const form = document.getElementById('login-register');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const body = {
            'username': data.get('username'),
            'password': data.get('password')
        }
        const result = await request(currentTab === 'Login' ? '/api/login' : '/api/register', 'POST', body);
        if (result.success) {
            window.location.href = '/store/';
        } else {
            alert(result.error);
        }
    });
})();
