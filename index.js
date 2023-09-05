const express = require('express'); //Import the express dependency;
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { emitWarning } = require('process');
const app = express();              //Instantiate an express app, the main work horse of this server
const port = 5000;                  //Save the port number where your server will be listening

const dbUser = process.argv[2];
const dbPass = process.argv[3];

// Create client for PostgreSQL
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: dbUser,
    password: dbPass,
    port: 5432,
})

// Middleware for handling JSON data
app.use(express.json());

// Recreate the database schema and populate it
async function reset() {
    // Load SQL script from file
    const filePath = path.join(__dirname, 'sql', 'master_delete_create_insert.sql');
    const sql = fs.readFileSync(filePath, 'utf8');
    // Execute SQL script
    var result = client.query(sql);
    console.log('Successfully created and populated database');
}

// Connect to the database
async function connect(client) {
    try {
        await client.connect();
        await reset();  // Reset the database schema and populate it
        return 'Connected to PostgreSQL!';
    } catch (error) {
        return error;
    }
}

// Disconnect from the database
async function disconnect(client) {
    try {
        await client.end();
        return 'Disconnected from PostgreSQL!';
    } catch (error) {
        return error;
    }
}

// Brew queries
async function CreateBrew(recipe_id, date, quantity) {
    var result = await client.query("INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (" + recipe_id + ", '" + date + "', " + quantity + ")");
    return result.rows;
}
// View all Brewes
async function ReadBrews() {
    var result = await client.query("SELECT batch_id, recipies.recipe_id, recipe_name, date, recipe_scale FROM brews JOIN recipies ON recipies.recipe_id = brews.recipe_id ORDER BY batch_id ASC");
    return result.rows;
}
// View Brew by ID
async function ReadBrew(batch_id){
    var result = await client.query("SELECT batch_id, recipies.recipe_id, recipe_name, date, recipe_scale FROM brews JOIN recipies ON recipies.recipe_id = brews.recipe_id WHERE batch_id =" + batch_id + " ORDER BY batch_id ASC");
    return result.rows;
}
// Update Brew
async function UpdateBrew(batch_id, recipe_id, date, recipe_scale) {
    var result = await client.query("UPDATE brews SET recipe_id = " + recipe_id + ", date = '" + date + "', recipe_scale = " + recipe_scale + " WHERE batch_id = " + batch_id);
    return result.rows;
}
// Update Recipe
async function UpdateBrewRecipe(batch_id, recipe_id) {
    var result = await client.query("UPDATE brews SET recipe_id = " + recipe_id + " WHERE batch_id = " + batch_id);
    return result.rows;
}
// Update Date
async function UpdateBrewDate(batch_id, date) {
    var result = await client.query("UPDATE brews SET date = '" + date + "' WHERE batch_id = " + batch_id);
    return result.rows;
}
// Update Quantity
async function UpdateBrewRecipeScale(batch_id, recipe_scale) {
    var result = await client.query("UPDATE brews SET recipe_scale = " + recipe_scale + " WHERE batch_id = " + batch_id);
    return result.rows;
}
// Delete Brew
async function DeleteBrew(batch_id) {
    var result = await client.query("DELETE FROM brews WHERE batch_id = " + batch_id);
    return result.rows;
}

// Brew API routes
app.get('/brew', async (req, res) => {
    const result = await ReadBrews();
    res.send(result);
})
app.get('/brew/:brewId', async (req, res) => {
    res.send(await ReadBrew(req.params.brewId));
})
app.delete('/brew/:brewId', async (req, res) => {
    res.send(await DeleteBrew(req.params.brewId));
})
app.post('/brew', async (req, res) => {
    res.send(await CreateBrew(req.query.recipeId, req.query.date, req.query.recipeScale));
})
// I'm going to do a batch update rather than allowing independant updates for MVP, need to pass in parameters in the URL
app.put('/brew', async (req, res) => {
    if (!req.query.brewId) {
        console.log("Missing brewId argument");
    }
    if (req.query.recipeId) {
        await UpdateBrewRecipe(req.query.brewId, req.query.recipeId);
    }
    if (req.query.date) {
        await UpdateBrewDate(req.query.brewId, req.query.date);
    }
    if (req.query.recipeScale) {
        await UpdateBrewRecipeScale(req.query.brewId, req.query.recipeScale);
    }
    res.send("Updated");
})

//Supplier Queries
async function viewAllSuppliers() {
    var result = await client.query("SELECT * FROM supplier;");
    return result.rows;
}
async function ReadSupplier(supplier_id){
    return (await client.query("SELECT * FROM supplier WHERE supplier_id ="+ supplier_id)).rows;
}
// Delete Supplier
async function DeleteSupplier(supplier_id) {
    //TODO: need to add confirm delete function to ensure that user knows that this is a cascade delete and will affect both ingredients and recipe_ingredients
    const referencedIngredients = await client.query(
        "SELECT ingredient_id FROM ingredients WHERE supplier_id = " + supplier_id)

    if(referencedIngredients.rowCount > 0){
        //delete the referenced recipes ingredients that are in the referenced ingredients
        for (const ingredient of referencedIngredients.rows) {
            await client.query("DELETE FROM recipies_ingredients WHERE ingredient_id = " + ingredient.ingredient_id);
        }
        
          //now delete the ingredients
        await client.query("DELETE FROM ingredients WHERE supplier_id = " + supplier_id);
    }

    return await client.query("DELETE FROM supplier WHERE supplier_id = " + supplier_id);
}
async function CreateSupplier(supplier_name, number) {
    // INSERT INTO supplier(supplier_name, number) VALUES ('Brew Supply Haus', '(979) 721-9463');
    var result =  await client.query("INSERT INTO supplier(supplier_name, number) VALUES ("+ "'" + supplier_name + "'" + ","  + "'" + number + "'" + ")");
    return result.rows;
}
//batch update...
async function UpdateSupplier(supplier_id,supplier_name, number) {
    var result = await client.query("UPDATE supplier SET supplier_name = " + "'" + supplier_name + "'" + ", number = '"  + number + "'" + " WHERE supplier_id = " + supplier_id);
    return result.rows;
}
async function UpdateSupplierName(supplier_id, supplier_name) {
    var result = await client.query("UPDATE supplier SET supplier_name = " +"'"+ supplier_name +"'" + " WHERE supplier_id = " + supplier_id);
    return result.rows;
}
// Update Phone
async function UpdateSupplierPhone(supplier_id, number) {
    result =  await client.query("UPDATE supplier SET number = " + "'" + number + "'" + " WHERE supplier_id = " + supplier_id);
    return result.rows;
}

// Establish connection with the database
app.get('/connect', async (req, res) => {
    await connect(client);
    res.send("{\"Status\":\"Connected\"}");
})
// Terminate connection with the database
app.get('/disconnect', async (req, res) => {
    await disconnect(client);
    res.send("{\"Status\":\"Disconnected\"}");
})
//TODO: supplier api routes
app.get('/supplier', async (req, res) => {
    res.send(await viewAllSuppliers());
})
app.get('/supplier/:supplierId', async (req, res) => {
    res.send(await ReadSupplier(req.params.supplierId));
})
app.delete('/supplier/:supplierId', async (req, res) => {
    res.send(await DeleteSupplier(req.params.supplierId));
})
//TODO: create supplier
app.post('/supplier', async (req, res) => {
    res.send(await CreateSupplier(req.query.supplier_name,req.query.supplier_number));
})
//TODO: update supplier
app.put('/supplier', async (req, res) => {
    const supplier_id = req.query.supplier_Id;
    const supplier_name = req.query.supplier_name;
    const number = req.query.supplier_number;
    if (!supplier_id) {
        console.log("Missing supplier_id argument");
    }
    if (supplier_name) {
        await UpdateSupplierName(supplier_id, supplier_name);
    }
    if (number) {
        await UpdateSupplierPhone(supplier_id, number);
    }
    res.send("Updated");

    // res.send(await UpdateSupplier(supplier_id, supplier_name, number));
});

// Ingredients Queries
// Create a new ingredient in the database
async function CreateIngredient(name, supplier_id, unit_price, unit, stock) {
    const result = await client.query(`INSERT INTO ingredients(ingredient_name, supplier_id, unit_price, unit, stock) VALUES ('${name}', ${supplier_id}, ${unit_price}, '${unit}', ${stock}) RETURNING *`);
    return result.rows[0];
}
// Update an ingredient's supplier in the database
async function UpdateIngredientSupplier(ingredient_id, new_supplier_id) {
    const result = await client.query(`UPDATE ingredients SET supplier_id = ${new_supplier_id} WHERE ingredient_id = ${ingredient_id}`);
    return result;
}
// Update an ingredient's name in the database
async function UpdateIngredientName(ingredient_id, new_name) {
    const result = await client.query(`UPDATE ingredients SET ingredient_name = '${new_name}' WHERE ingredient_id = ${ingredient_id}`);
    return result;
}
// Update an ingredient's unit price in the database
async function UpdateIngredientUnitPrice(ingredient_id, new_unit_price) {
    const result = await client.query(`UPDATE ingredients SET unit_price = ${new_unit_price} WHERE ingredient_id = ${ingredient_id}`);
    return result;
}
// Update an ingredient's unit in the database
async function UpdateIngredientUnit(ingredient_id, new_unit) {
    const result = await client.query(`UPDATE ingredients SET unit = '${new_unit}' WHERE ingredient_id = ${ingredient_id}`);
    return result;
}
// Update an ingredient's stock in the database
async function UpdateIngredientStock(ingredient_id, new_stock) {
    const result = await client.query(`UPDATE ingredients SET stock = ${new_stock} WHERE ingredient_id = ${ingredient_id}`);
    return result;
}
// Delete an ingredient from the database
async function DeleteIngredient(ingredient_id) {
    // Start a transaction
    await client.query('BEGIN');
    try {
        // Delete the referenced recipes ingredients that are in the referenced ingredients
        await client.query("DELETE FROM recipies_ingredients WHERE ingredient_id = " + ingredient_id);
        // Now delete the ingredient
        await client.query("DELETE FROM ingredients WHERE ingredient_id = " + ingredient_id);
        // If everything was successful, commit the transaction
        await client.query('COMMIT');
    } catch (error) {
        // If there was an error, roll back the transaction
        await client.query('ROLLBACK');
        throw error;
    }
}
// Get all ingredients from the database
async function GetAllIngredients() {
    const result = await client.query(`SELECT * FROM ingredients ORDER BY ingredient_id ASC`);
    return result;  
}
// Get a single ingredient from the database by its ID
async function GetIngredientById(ingredient_id) {
    return (await client.query("SELECT * FROM ingredients WHERE ingredient_id =" + ingredient_id)).rows;
}

// Express routes to create, read, update, and delete individual ingredients, as well as read all ingredients.
app.post('/ingredients', async (req, res) => {
    // Destructure properties from request body
    const { name, supplier_id, unit_price, unit, stock } = req.body;
    // Create ingredient using database function and await for the promise to resolve
    const ingredient = await CreateIngredient(name, supplier_id, unit_price, unit, stock);
    // Send the result as a JSON response
    res.json(ingredient);  
});
app.put('/ingredients/:id/supplier', async (req, res) => {
    const { id } = req.params;
    const { new_supplier_id } = req.body;
    const result = await UpdateIngredientSupplier(id, new_supplier_id);
    result.rowCount > 0
        ? res.json({ message: "Supplier updated successfully"})
        : res.json({ message: "No ingredient found with the given ID"});
});
app.put('/ingredients/:id/name', async (req, res) => {
    const { id } = req.params;
    const { new_name } = req.body;
    const result = await UpdateIngredientName(id, new_name);
    result.rowCount > 0
        ? res.json({ message: "Ingredient name updated successfully"})
        : res.json({ message: "No ingredient found with the given ID"});
});
app.put('/ingredients/:id/unit_price', async (req, res) => {
    const { id } = req.params;
    const { new_unit_price } = req.body;
    const result = await UpdateIngredientUnitPrice(id, new_unit_price);
    result.rowCount > 0
        ? res.json({ message: "Ingredient unit price updated successfully"})
        : res.json({ message: "No ingredient found with the given ID"});
});
app.put('/ingredients/:id/unit', async (req, res) => {
    const { id } = req.params;
    const { new_unit } = req.body;
    const result = await UpdateIngredientUnit(id, new_unit);
    result.rowCount > 0
        ? res.json({ message: "Ingredient unit updated successfully"})
        : res.json({ message: "No ingredient found with the given ID"});
});
app.put('/ingredients/:id/stock', async (req, res) => {
    const { id } = req.params;
    const { new_stock } = req.body;
    const result = await UpdateIngredientStock(id, new_stock);
    result.rowCount > 0
        ? res.json({ message: "Ingredient stock updated successfully"})
        : res.json({ message: "No ingredient found with the given ID"});
});
app.delete('/ingredients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await DeleteIngredient(id);
        res.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the ingredient', error });
    }
});
// Fetch all ingredients.
app.get('/ingredients', async (req, res) => {
    // Fetch all ingredients using database function and await for the promise to resolve
    const result = await GetAllIngredients();
    // Send the result as a JSON response
    res.json(result.rows);  
});
// Fetch a single ingredient specified by its ID in the request parameters.
app.get('/ingredients/:ingredientId', async (req, res) => {
    res.send(await GetIngredientById(req.params.ingredientId));
});

//RECIPES Queries
// Create a new recipe in the database
async function CreateRecipe(name, yield, abv, price) {
    const result = await client.query(`INSERT INTO recipies(recipe_name, yield, abv, price) VALUES ('${name}', ${yield}, ${abv}, ${price}) RETURNING *`);
    return result.rows[0];
}
// Update an recipe's name in the database
async function UpdateRecipeName(recipe_id, new_name) {
    const result = await client.query(`UPDATE recipies SET recipe_name = '${new_name}' WHERE recipe_id = ${recipe_id}`);
    return result;
}
// Update yield
async function UpdateYield(recipe_id, yield) {
    const result =  await client.query(`UPDATE recipies SET yield =  '${yield}'   WHERE recipe_id =   '${recipe_id}' `);
    return result;
}
// Update ABV
async function UpdateABV(recipe_id, abv) {
    const result =  await client.query(`UPDATE recipies SET abv =  '${abv}'   WHERE recipe_id =   '${recipe_id}' `);
    return result;
}
// Update Beer Price
async function UpdateBeerPrice(recipe_id, beer_price) {
    const result =  await client.query(`UPDATE recipies SET price =   '${beer_price}'   WHERE recipe_id = '${recipe_id}'`);
    return result;
}
// Delete an recipe from the database
async function DeleteRecipe(recipe_id) {
    // Start a transaction
    await client.query('BEGIN');
    try {
        //delete the reference recipes from recipies_ingredients
        await client.query("DELETE FROM recipies_ingredients WHERE recipe_id = " + recipe_id);
        //delete the reference recipes from recipies_ingredients
        await client.query("DELETE FROM brews WHERE recipe_id = " + recipe_id);
        // Delete the recipe
        await client.query("DELETE FROM recipies WHERE recipe_id = " + recipe_id);
        // If everything was successful, commit the transaction
        await client.query('COMMIT');
    } catch (error) {
        // If there was an error, roll back the transaction
        await client.query('ROLLBACK');
        throw error;
    }
}
// Get all recipes from the database
async function GetAllRecipies() {
    const result = await client.query("SELECT recipies.recipe_id, recipe_name, yield, abv, price, recipies_ingredients.ingredient_id, ingredients.ingredient_name, recipies_ingredients.ingredient_quanity FROM recipies LEFT JOIN recipies_ingredients ON recipies.recipe_id = recipies_ingredients.recipe_id LEFT JOIN ingredients ON recipies_ingredients.ingredient_id = ingredients.ingredient_id ORDER BY recipe_id ASC");
    return result;  
}
// Get a single recipe from the database by its ID
async function GetRecipeById(recipe_id) {
    const result = await client.query(`SELECT * FROM recipies WHERE recipe_id = ${recipe_id}`);
    return result;
}

// Express routes to create, read, update, and delete individual recipes, as well as read all recipes.
app.post('/recipies', async (req, res) => {
    if(Object.keys(req.body).length > 3) {
        // Destructure properties from request body
        const { name, yield, abv, price } = req.body;
        // Create recipe using database function and await for the promise to resolve
        const recipe = await CreateRecipe(name, yield, abv, price);
        // Send the result as a JSON response
        res.json(recipe);
    } else {
        const r_id = req.query.recipe_num;
        const i_id = req.query.ingredient_num;
        const q = req.query.quantity;
        res.send(await CreateRecipeIngredient(r_id, i_id, q));
    }
});
//route to update Recipe Name
app.put('/recipies/:id/name', async (req, res) => {
    const { id } = req.params;
    const { new_name } = req.body;
    const result = await UpdateRecipeName(id, new_name);
    result.rowCount > 0
        ? res.json({ message: "Recipe name updated successfully"})
        : res.json({ message: "No Recipe found with the given ID"});
});
app.put('/recipies/:id/yield', async (req, res) => {
    const { id } = req.params;
    const { new_yield } = req.body; 
    const result = await UpdateYield(id, new_yield);
    result.rowCount > 0
        ? res.json({ message: "Yield updated successfully"})
        : res.json({ message: "No Yield found with the given ID"});
});
app.put('/recipies/:id/abv', async (req, res) => {
    const { id } = req.params;
    const { new_abv } = req.body;
    const result = await UpdateABV(id, new_abv);
    result.rowCount > 0
        ? res.json({ message: "ABV updated successfully"})
        : res.json({ message: "No ABV found with the given ID"});
});
app.put('/recipies/:id/price', async (req, res) => {
    const { id } = req.params;
    const { new_price } = req.body;
    const result = await UpdateBeerPrice(id, new_price);
    result.rowCount > 0
        ? res.json({ message: "price updated successfully"})
        : res.json({ message: "No price found with the given ID"});
});
app.delete('/recipies/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`id = ${id}`);
    try {
        await DeleteRecipe(id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the recipe', error });
    }
});
// Fetch all recipes.
app.get('/recipies', async (req, res) => {
    // Fetch all ingredients using database function and await for the promise to resolve
    const result = await GetAllRecipies();
    // Send the result as a JSON response
    res.json(result.rows);  
});
// Fetch a recipe by iD.
app.get('/recipies/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Here! id = ${id}`)
    const result = await GetRecipeById(id);
    console.log(result);
    // Send the result as a JSON response
    res.json(result.rows);  
});

async function CreateRecipeIngredient(recipe_id, ingredient_id, quantity) {
    const result = await client.query(`INSERT INTO recipies_ingredients(recipe_id, ingredient_id, ingredient_quanity) VALUES (${recipe_id}, ${ingredient_id}, ${quantity})`);
    return result.rows[0];
}
async function UpdateRecipeIngredient(recipe_id, ingredient_id, quantity) {
    const result = await client.query(`UPDATE recipies_ingredients SET ingredient_quanity = ${quantity} WHERE ingredient_id = ${ingredient_id} AND recipe_id = ${recipe_id}`);
    return result;
}
async function DeleteRecipeIngredient(recipe_id, ingredient_id) {
    const result = await client.query(`DELETE FROM recipies_ingredients WHERE ingredient_id = ${ingredient_id} AND recipe_id = ${recipe_id}`);
    return result;
}
async function ViewAllRecipeIngredient(recipe_id) {
    const result = await client.query(`SELECT * FROM recipies_ingredients WHERE recipe_id = ${recipe_id}`);
    return result;
}

app.get('/recipies/:recipeId', async (req, res) => {
    const { id } = req.params;
    const result = await ViewAllRecipeIngredient(id);
    res.json(result.rows[0]);  
});
app.delete('/recipies', async (req, res) => {
    const r_id = req.query.recipeId2;
    const i_id = req.query.ingredientId2;
    res.send(await DeleteRecipeIngredient(r_id, i_id));
});
app.put('/recipies', async (req, res) => {
    const r_id = req.query.recipe_num;
    const i_id = req.query.ingredient_num;
    const q = req.query.quantity;
    res.send(await UpdateRecipeIngredient(r_id, i_id, q));
});
//TODO recipe_ingredient expressroute accesses for recipe_ingredients

// Generate reports
async function getRecipeUsageReport() {
    const result =  await client.query(
        "SELECT recipies.recipe_name, COUNT(recipe_name) AS brew_count, SUM(yield) AS total_yield FROM brews\
        JOIN recipies ON recipies.recipe_id = brews.recipe_id\
        GROUP BY recipies.recipe_name"
    );
    return result.rows;
}
// Get profitability of all beer on hand (cost of all batches - amount produced * sell price by beer)
async function getBeerProfitabiltyReport() {
    const result =  await client.query(
        "SELECT recipe_name, ROUND(profit_per_batch * sum(batch_count), 2) AS total_brew_profit FROM\
        (\
            SELECT recipies.recipe_name,\
                ROUND(yield * 8 * price - SUM(recipies_ingredients.ingredient_quanity * unit_price), 2) AS profit_per_batch,\
                (recipe_scale) AS batch_count\
            FROM recipies_ingredients\
            JOIN ingredients ON ingredients.ingredient_id = recipies_ingredients.ingredient_id\
            JOIN recipies ON recipies.recipe_id = recipies_ingredients.recipe_id\
            JOIN brews ON recipies.recipe_id = brews.recipe_id\
            GROUP BY (recipies.recipe_name, yield, price, recipe_scale)\
        ) AS profit_report\
        GROUP BY (recipe_name, profit_per_batch);"
    );
    return result.rows;
}
// Get total cost of each recipe
async function getRecipeCostReport() {
    const result =  await client.query(
        "SELECT recipies.recipe_name, ROUND(SUM(recipies_ingredients.ingredient_quanity * unit_price), 2) AS batch_cost\
         FROM recipies_ingredients\
         JOIN ingredients ON ingredients.ingredient_id = recipies_ingredients.ingredient_id\
         JOIN recipies ON recipies.recipe_id = recipies_ingredients.recipe_id\
         GROUP BY (recipies.recipe_name);"
    );
    return result.rows;
}
// View all ingredients by supplier
async function getSupplierIngredientsReport() {
    const result =  await client.query("SELECT supplier_name, ingredient_name FROM supplier JOIN ingredients ON supplier.supplier_id = ingredients.supplier_id ORDER BY supplier_name ASC");
    return result.rows;
}
// View total cost of ingredients
async function getIngredientCostReport() {
    const result =  await client.query("SELECT ingredient_name, unit_price * stock AS total_value FROM ingredients ORDER BY ingredient_id ASC");
    return result.rows;
}

// Routes for reports
app.get('/reports/BeerProfitability', async (req, res) => {
    res.send(await getBeerProfitabiltyReport());
});
app.get('/reports/RecipeCost', async (req, res) => {
    res.send(await getRecipeCostReport());
});
app.get('/reports/SupplierIngredients', async (req, res) => {
    res.send(await getSupplierIngredientsReport());
});
app.get('/reports/IngredientCost', async (req, res) => {
    res.send(await getIngredientCostReport());
});
app.get('/reports/RecipeUsage', async (req, res) => {
    res.send(await getRecipeUsageReport());
});

// Serve static files from the 'public' directory 
app.use(express.static(path.join(__dirname, 'public'))); 

// Start listening for incoming HTTP requests
app.listen(port, () => { 
    console.log(`Now listening on port ${port}`); 
});
