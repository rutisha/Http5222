const spoonacularBaseUrl = "https://api.spoonacular.com";
const nutritionixBaseUrl = "https://trackapi.nutritionix.com";
const nutritionixEndpoint = "/v2/natural/nutrients";
const foursquareBaseUrl = "https://api.foursquare.com/v3/places/search";

async function getRecipes(query) {
    let reqUrl = `${spoonacularBaseUrl}/recipes/complexSearch?query=${query}&addRecipeInformation=true&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    let response = await fetch(reqUrl);
    return await response.json();
}

async function getNutritionInfo(ingredientname) {
    let response = await fetch(`${nutritionixBaseUrl}${nutritionixEndpoint}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'x-app-id': process.env.NUTRITIONIX_APP_ID,
            'x-app-key': process.env.NUTRITIONIX_API_KEY
        },
        body: JSON.stringify({ query: ingredientname })
    });
    let data = await response.json();
    return data;
}

async function getRecipeById(id) {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `${spoonacularBaseUrl}/recipes/${id}/information?apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        throw error;
    }
}

async function getNearbyStores(location) {
    let response = await fetch(`${foursquareBaseUrl}?query=grocery store&near=${location}&limit=10`, {
        headers: {
            Accept: 'application/json',
            Authorization: process.env.FOURSQUARE_API_KEY
        }
    });
    let data = await response.json();
    return data.results;
}

module.exports = {
    getRecipes,
    getNutritionInfo,
    getNearbyStores,
    getRecipeById
};
