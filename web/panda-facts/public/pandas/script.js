(async () => {
    await new Promise((resolve) => {
        window.addEventListener('load', resolve);
    });

    let userInfo;
    try {
        userInfo = await (await fetch('/api/validate')).json();

        if (!userInfo.success) {
            window.location = '../';
            return;
        }
    } catch (error) {
        window.location = '../';
        return;
    }

    document.getElementById('title').innerText = `Welcome, ${userInfo.token.username}! Here are some panda facts!`;

    const button = document.getElementById('flag');
    button.addEventListener('click', async () => {
        try {
            const result = await (await fetch('/api/flag')).json();
            if (! result.success) {
                if (result.error) {
                    alert(result.error);
                }
                return;
            }
            button.innerText = result.flag;
        } catch (error) {
            alert("You are not a member");
        }
    });
})();
