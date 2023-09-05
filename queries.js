// Note: See implimentation details (i.e., parameters, DB effects, & returns) in Teams Documentation/ProjectPlanning.docx
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '05102003',
    port: 5432,
})

// TODO: ALEX
// ----------- CRUD Functions for Brews ----------- //
// Create New Brew (date formatted as YYYY-MM-DD)
async function CreateBrew(recipe_id, date, quantity) {
    return await client.query("INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (" + recipe_id + ", '" + date + "', " + quantity + ")");
}
// View all Brewes
async function ReadBrews() {
    return await client.query("SELECT * FROM brews ORDER BY batch_id ASC");
}
// View Brew by ID
async function ReadBrew(batch_id){
    return await client.query("SELECT * FROM brews WHERE batch_id ="+ batch_id);
}
// Update Recipe
async function UpdateBrewRecipe(batch_id, recipe_id) {
    return await client.query("UPDATE brews SET recipe_id = " + recipe_id + " WHERE batch_id = " + batch_id);
}
// Update Date
async function UpdateBrewDate(batch_id, date) {
    return await client.query("UPDATE brews SET date = '" + date + "' WHERE batch_id = " + batch_id);
}
// Update Quantity
async function UpdateBrewRecipeScale(batch_id, recipe_scale) {
    return await client.query("UPDATE brews SET recipe_scale = " + recipe_scale + " WHERE batch_id = " + batch_id);
}
// Delete Brew
async function DeleteBrew(batch_id) {
    return await client.query("DELETE FROM brews WHERE batch_id = " + batch_id);
}


// TODO: Cameron & Conner
// --------------- CRUD Functions for Recipes -------- //
// Create New Recipe
async function CreateRecipe(recipe_name, total_yield, ABV, beer_price) {
    return await client.query("INSERT INTO recipies(recipe_name, yield, ABV, price) VALUES (" + recipe_name + ", '" + total_yield + "', " + ABV + " , "+ beer_price+")");
}
async function CreateRecipeIngredient(recipe_id, ingredient_id, quantity) {
    return await client.query(`INSERT INTO recipies_ingredients(recipe_id, ingredient_id, quanity) VALUES (${recipe_id}, ${ingredient_id}, ${quantity})`);
}
// Update ABV
async function UpdateABV(ABV, recipe_id) {
    return await client.query("UPDATE recipies SET ABV = " + ABV + " WHERE recipe_id = " + recipe_id);
}
// Update Beer Price
async function UpdateBeerPrice(beer_price, recipe_id) {
    return await client.query("UPDATE recipies SET price = " + beer_price + " WHERE recipe_id = " + recipe_id);
}

// Update add ingredient and quantity to recipe
async function UpdaterRecipeIngredient(recipe_id, ingredient_id, quantity) {
    return await client.query(`UPDATE recipies_ingredients SET quantity = ${quantity} WHERE ingredient_id = ${ingredient_id} AND recipe_id = ${recipe_id}`);
}

// Delete Recipe
async function DeleteRecipe(recipe_id) {
    return await client.query("DELETE FROM recipies WHERE recipe_id = " + recipe_id);
}
async function DeleteAllIngredientsFromRecipe(recipe_id) {
    return await client.query(`DELETE FROM recipies_ingredients WHERE recipe_id = ${recipe_id}`);
}
// Delete ingredient from recipe
async function DeleteRecipeIngredient(recipe_id, ingredient_id) {
    return await client.query(`DELETE FROM recipies_ingredients WHERE ingredient_id = ${ingredient_id} AND recipe_id = ${recipe_id}`);
}

// View all recipes
async function ViewallRecipies() {
    return await client.query("SELECT * FROM recipies");
}
async function ViewAllRecipeIngredient() {
    return await client.query(`SELECT * FROM recipies_ingredients`);
}
// View Recipe by ID
async function ViewallRecipies(recipe_id) {
    return await client.query("SELECT * FROM recipies WHERE recipe_id = " + recipe_id);
}
async function ViewAllRecipeIngredient(recipe_id) {
    return await client.query(`SELECT * FROM recipies_ingredients WHERE recipe_id = ${recipe_id}`);
}

// TODO: Thinh (Tim)
// ---------- CRUD Functions for Ingredients ---------- //
// Create New Ingredient
async function CreateIngredient(name, supplier_id, unit_price, unit, stock) {
    return await client.query(`INSERT INTO ingredients(ingredient_name, supplier_id, unit_price, unit, stock) VALUES ('${name}', ${supplier_id}, ${unit_price}, '${unit}', ${stock}) RETURNING *`);
}
// Update Supplier
async function UpdateIngredientSupplier(ingredient_id, new_supplier_id) {
    return await client.query(`UPDATE ingredients SET supplier_id = ${new_supplier_id} WHERE ingredient_id = ${ingredient_id}`);
}
// Update Name
async function UpdateIngredientName(ingredient_id, new_name) {
    return await client.query(`UPDATE ingredients SET ingredient_name = '${new_name}' WHERE ingredient_id = ${ingredient_id}`);
}
// Update Unit Price
async function UpdateIngredientUnitPrice(ingredient_id, new_unit_price) {
    return await client.query(`UPDATE ingredients SET unit_price = ${new_unit_price} WHERE ingredient_id = ${ingredient_id}`);
}
// Update Unit
async function UpdateIngredientUnit(ingredient_id, new_unit) {
    return await client.query(`UPDATE ingredients SET unit = '${new_unit}' WHERE ingredient_id = ${ingredient_id}`);
}
// Update Quantity
async function UpdateIngredientStock(ingredient_id, new_stock) {
    return await client.query(`UPDATE ingredients SET stock = ${new_stock} WHERE ingredient_id = ${ingredient_id}`);
}
// Delete Ingredient
async function DeleteIngredient(ingredient_id) {
    return await client.query(`DELETE FROM ingredients WHERE ingredient_id = ${ingredient_id}`);
}
// View All Ingredients
async function GetAllIngredients() {
    return await client.query(`SELECT * FROM ingredients`);
}
// View Ingredient by ID
async function GetIngredientById(ingredient_id) {
    return await client.query(`SELECT * FROM ingredients WHERE ingredient_id = ${ingredient_id}`);
}

// TODO: Lauren (Ren)
// ----------- CRUD Functions for Suppliers ----------- //
// Create New Supplier
async function CreateSupplier(supplier_name, number) {
    // INSERT INTO supplier(supplier_name, number) VALUES ('Brew Supply Haus', '(979) 721-9463');
    return await client.query("INSERT INTO supplier(supplier_name, number) VALUES ("+ "'" + supplier_name + "'" + ","  + "'" + number + "'" + ")");
}
// Update Name
async function UpdateSupplierName(supplier_id, supplier_name) {
    return await client.query("UPDATE supplier SET supplier_name = " +"'"+ supplier_name +"'" + " WHERE supplier_id = " + supplier_id);
}
// Update Phone
async function UpdateSupplierPhone(supplier_id, number) {
    return await client.query("UPDATE supplier SET number = " + "'" + number + "'" + " WHERE supplier_id = " + supplier_id);
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

// View all Suppliers
async function ReadSuppliers() {
    return await client.query("SELECT * FROM supplier ORDER BY supplier_id ASC");
}
// View Supplier by ID
async function ReadSupplier(supplier_id){
    return await client.query("SELECT * FROM supplier WHERE supplier_id ="+ supplier_id);
}

// --------------------- Reports  --------------------- //
// Get quantity made of each recipe (all batches)
async function getRecipeUsageReport() {
    return await client.query(
        "SELECT recipies.recipe_name, COUNT(recipe_name) AS brew_count, SUM(yield) AS total_yield FROM brews\
        JOIN recipies ON recipies.recipe_id = brews.recipe_id\
        GROUP BY recipies.recipe_name");
}
// Get profitability of all beer on hand (cost of all batches - amount produced * sell price by beer)
async function getBeerProfitabiltyReport() {
    return await client.query(
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
        GROUP BY (recipe_name, profit_per_batch);");
}
// Get total cost of each recipe
async function getRecipeCostReport() {
    return await client.query(
        "SELECT recipies.recipe_name, ROUND(SUM(recipies_ingredients.ingredient_quanity * unit_price), 2) AS batch_cost\
         FROM recipies_ingredients\
         JOIN ingredients ON ingredients.ingredient_id = recipies_ingredients.ingredient_id\
         JOIN recipies ON recipies.recipe_id = recipies_ingredients.recipe_id\
         GROUP BY (recipies.recipe_name);"
    );
}
// View all incredients by supplier
async function getSupplierIngredientsReport() {
    return await client.query("SELECT supplier_name, ingredient_name FROM supplier JOIN ingredients ON supplier.supplier_id = ingredients.supplier_id ORDER BY supplier_name ASC");
}
// View total cost of incredients
async function getIngredientCostReport() {
    return await client.query("SELECT ingredient_name, unit_price * stock AS total_value FROM ingredients ORDER BY ingredient_id ASC");
}

async function testBrewQueries() {
    var result = await CreateBrew(1, "2020-04-20", 69);
    console.log(result.rows);
    var result = await ReadBrews();
    console.log(result.rows);
    var result = await ReadBrew(1);
    console.log(result.rows);
    var result = await UpdateBrewRecipe(3, 2);
    console.log(result.rows);
    var result = await UpdateBrewDate(2, "2027-01-23");
    console.log(result.rows);
    var result = await UpdateBrewRecipeScale(3, 0.1);
    console.log(result.rows);
    var result = await DeleteBrew(4);
    console.log(result.rows);
}

async function testIngredientsQueries() {
    // Create a new ingredient
    var result = await CreateIngredient('Ingredient1', 1, 10, 'kg', 100);
    console.log(result.rows);
    // Update supplier of the new ingredient
    await UpdateIngredientSupplier(10, 2);
    result = await GetIngredientById(10);
    console.log(result.rows);  // Show the updated supplier
    // Update name of the new ingredient
    await UpdateIngredientName(10, 'Ingredient2');
    result = await GetIngredientById(10);
    console.log(result.rows);  // Should show the updated name
    // Update unit price of the new ingredient
    await UpdateIngredientUnitPrice(10, 20);
    result = await GetIngredientById(10);
    console.log(result.rows);  // Show the updated unit price
    // Update unit of the new ingredient
    await UpdateIngredientUnit(10, 'g');
    result = await GetIngredientById(10);
    console.log(result.rows);  // Show the updated unit
    // Update quantity of the new ingredient
    await UpdateIngredientStock(10, 200);
    result = await GetIngredientById(10);
    console.log(result.rows);  // Show the updated quantity
    // Delete the new ingredient
    await DeleteIngredient(10);
    result = await GetIngredientById(10);
    console.log(result.rows);  // Empty because the ingredient was deleted
    // View all ingredients
    result = await GetAllIngredients();
    console.log(result.rows);
    // View a specific ingredient by ID
    result = await GetIngredientById(1);
    console.log(result.rows);
}

async function testReports() {
    var result = await getRecipeUsageReport();
    console.log(result.rows);
    var result = await getBeerProfitabiltyReport();
    console.log(result.rows);
    var result = await getRecipeCostReport();
    console.log(result.rows);
    var result = await getSupplierIngredientsReport();
    console.log(result.rows);
    var result = await getIngredientCostReport();
    console.log(result.rows);
}

//Testing Suppliers Entity:
async function testSuppliersQuery(){
    // var result = await CreateSupplier('Cheddars', '(555) 555-5555');
    // console.log(result.rows);
    // var result = await UpdateSupplierName(1, 'Supplier1');
    // console.log(result.rows);
    // var result = await UpdateSupplierPhone(2, '(555) 555-5858');
    // console.log(result.rows);
    // var result = await DeleteSupplier(1);
    // console.log(result.rows);
    // var result = await ReadSuppliers();
    // console.log(result.rows);
    // var result = await ReadSupplier(3);
    // console.log(result.rows);

}

async function viewAllSuppliers() {
    var result = await client.query("SELECT * FROM supplier;");
    console.log(result.rows);
}

async function reset() {
    const filePath = path.join(__dirname, 'sql', 'master_delete_create_insert.sql');
        const sql = fs.readFileSync(filePath, 'utf8');
        var result = client.query(sql);
        console.log('Successfully created and populated database');
}

async function connect(client) {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL!');
        await reset();
        //await viewAllSuppliers();
        //await testBrewQueries();
        //await testSuppliersQuery();
        //await testIngredientsQueries();
        //await queryTestbench();
        //await testReports();
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
    } finally {
        await client.end();
        console.log('Disconnected from PostgreSQL.');
    }
}

connect(client);