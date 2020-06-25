(async () => {
    await new Promise((resolve) => {
        window.addEventListener('load', resolve);
    });

    const button = document.getElementById('button');
    button.addEventListener('click', () => {
        const text = document.getElementById('text');
        window.location = 'paste/#' + btoa(text.value);
    });
})();
