(async () => {
    if (!(await getId()).success) {
        window.location.replace('/');
    }

    await listRecipes();
})();


const listRecipes = async () => {
    // Get available recipes
    const purchasesResponse = await request('/api/getPurchases', 'GET');
    if (! purchasesResponse.success) {
        return;
    }
    const purchases = purchasesResponse.purchases;
    const recipeWrapper = document.getElementById('recipe-cards');
    const template = document.getElementById('recipe-card-template');
    for (const recipe of purchases) {
        const card = template.content.cloneNode(true);
        card.querySelector('h2').textContent = recipe.name;
        card.querySelector('p').textContent = recipe.description;

        const button = card.querySelector('button');
        handleView(button, recipe);
        recipeWrapper.appendChild(card);
    }
}

const handleView = async (button, recipe) => {
    button.addEventListener('click', async () => {
        let card = document.getElementById('content-card'); 
        if (!card) {
            const displayWrapper = document.getElementById('content-wrapper');
            const template = document.getElementById('content-card-template'); 
            displayWrapper.appendChild(template.content.cloneNode(true));
            card = document.getElementById('content-card'); 
        }
        card.innerHTML = recipe.recipe;
    });
}

