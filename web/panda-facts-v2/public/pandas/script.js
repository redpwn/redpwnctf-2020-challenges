(async () => {
    await new Promise((resolve) => {
        window.addEventListener('load', resolve);
    });

    try {
        const userInfo = await (await fetch('/api/validate')).json();

        if (!userInfo.success) {
            window.location = '../';
            return;
        }
    } catch (error) {
        window.location = '../';
        return;
    }

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
            alert("You are not an member");
        }
    });
})();
