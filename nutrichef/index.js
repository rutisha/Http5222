const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const api = require('./modules/api');

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Home route with search form
app.get('/', async(req, res) => {
    let query = 'healthy';
    let recipes = await api.getRecipes(query);
    recipes = recipes.results.sort((a, b) => a.calories - b.calories);

    // Take the first three recipes with minimum calories
    let featuredRecipes = recipes.slice(0, 3);

    res.render('index', { title: "Home", featuredRecipes });
});

// Recipes route with search functionality
app.get('/recipes', async (req, res) => {
    let query = req.query.q || 'healthy'; // Default to healthy recipes
    let recipes = await api.getRecipes(query);
    res.render('recipes', { title: "Recipes", recipes: recipes.results, query });
});

app.get('/recipe-detail/:id', async (req, res) => {
    const recipeId = req.params.id;
    try {
        const recipe = await api.getRecipeById(recipeId);
        res.render('recipe-detail', { recipe });
    } catch (error) {
        res.status(500).send('Error fetching recipe details');
    }
});

app.get('/nutrition/:ingredientname', async (req, res) => {
    let nutritionInfo = await api.getNutritionInfo(req.params.ingredientname);
    res.render('nutrition', { title: "Nutrition Information", nutrition: nutritionInfo });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

app.get('/stores', (req, res) => {
    res.render('stores', { title: "Find Nearby Stores" });
});

app.post('/stores', async (req, res) => {
    const { location } = req.body;

    try {
        let stores = await api.getNearbyStores(location);
        res.render('stores', { title: "Store Results", stores });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).render('error', { message: 'An error occurred while fetching data' });
    }
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
