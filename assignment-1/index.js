const express = require('express');
const path = require('path');
const { title } = require('process');
const dotenv = require("dotenv");

// Initialize Express app
const app = express();
const port = process.env.PORT || "8888";

// Start the server
app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`)
});

// Set views directory and view engine to Pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")))

dotenv.config();

const db = require("./modules/db");

//Page Routes
app.get("/", async (request, response) => {
      let productList = await db.getProducts();
      if (!productList.length) {
        await db.initializeProducts();  
        productList = await db.getProducts(); 
      }
      response.render("index", { products : productList });
});

app.get("/about", (request, response) => {
      response.render("about", { title: "About Fabstyla" });
  });
  
  app.get("/products", async (request, response) => {
      let productList = await db.getProducts();
      response.render("products", { products: productList });
  });
  
  app.get("/admin/add", (request, response) => {
      response.render("add");
  });
  
  // Route to handle form submission for adding a product
  app.post("/admin/add", express.urlencoded({ extended: true }), async (request, response) => {
      const { name, price, color, category, image } = request.body;
      await db.addProduct(name, price, color, category, image);
      response.redirect("/products");
  });


  