const globals = {};

(async () => {
    // Check if user is logged in
    const login = await getId();
    if (!login.success) {
        window.location.replace('/');
    }
    await load; 
    
    globals.id = login.id;

    updateInfo();

    // List available recipes
    listRecipes();
})();

const updateInfo = async () => {
    // Get user info from id
    const infoResponse = await request('/api/userInfo', 'GET', {'id': globals.id});
    if (!infoResponse.success) {
        // How did we get here
        window.location.replace('/');
    }
    const info = infoResponse.info;
    document.getElementById('username').textContent = info.username;
    document.getElementById('balance').textContent = info.balance;
}

const listRecipes = async () => {
    // Get available recipes
    const recipeResponse = await request('/api/getRecipes', 'GET');
    if (! recipeResponse.success) {
        return;
    }
    const recipes = recipeResponse.recipes;
    const recipeWrapper = document.getElementById('recipe-cards');
    const template = document.getElementById('recipe-card-template');
    for (const recipe of recipes) {
        const card = template.content.cloneNode(true);
        card.querySelector('h2').textContent = recipe.name;
        card.querySelector('p').textContent = recipe.description;

        const button = card.querySelector('button')
        button.textContent = `Purchase (${recipe.price} credits)`
        handleSubmissions(button, recipe.id);
        recipeWrapper.appendChild(card);
    }
}

const handleSubmissions = async (button, id) => {
    button.addEventListener('click', async () => {
        const result = await request('/api/purchaseRecipe', 'POST', {'id': id});
        if (!result) {
            return;
        }
        if (result.success) {
            alert('Purchase successful!');
            updateInfo(id);
            return;
        }
        if (result.error) {
            alert(result.error); 
        }
    });
}
