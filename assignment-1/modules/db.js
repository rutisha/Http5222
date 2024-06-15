const mongoose = require("mongoose");
const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}`;

//MONGODB FUNCTIONS
async function connect() {
    await mongoose.connect(dbUrl); 
}

//Creating schema of rpoduct
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    color: String,
    category: String,
    image: String
  });
const Product = mongoose.model("products", ProductSchema);

//Function to get data from database
async function getProducts() {
    await connect();
    return await Product.find({}); //return array for find all
}

//Function to initialize the database
async function initializeProducts() {
    const productList = [
      {
        name: "Crop Tee",
        price: 80,
        color: "White",
        category: "Tops",
        //https://www.rockerylandscapes.com/merchandise/womans-crop-t-sh
        image: "/images/crop-tee.jpg"
      },
      {
        name: "Crop Sweatshirt",
        price: 100,
        color: "Black",
        category: "Tops",
        //https://www.msfitqueen.com/products/no-excuses-crop-sweatshirt
        image: "/images/crop-sweatshirt.jpg"
      },
      {
        name: "Ruffled Dress",
        price: 135,
        color: "Black",
        category: "Dresses",
        //https://www2.hm.com/en_ca/productpage.1217066003.html
        image: "/images/ruffled-dress.jpg"
      },
    ];
    await Product.insertMany(productList);
  }

  //Function to add a new product 
async function addProduct(productName, productPrice, productColor, productCategory, productImage) {
    let newProduct = new Product({
        name: productName,
        price: productPrice,
        color: productColor,
        category: productCategory,
        image: productImage
    })
    newProduct.save();
  }
  
module.exports = {
   getProducts,
   initializeProducts,
   addProduct
  }
  
  
