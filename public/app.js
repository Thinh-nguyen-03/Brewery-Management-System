// Function to convert JSON data to HTML table
var url = "http://localhost:5000";

let isConnected = false;

const setStatus = (status) => {
   const statusIndicator = document.querySelector('.status-indicator');
   const statusText = document.getElementById('status-text');
   
   if (status === 'connected') {
      statusIndicator.classList.remove('disconnected');
      statusIndicator.classList.add('connected');
      statusText.innerText = 'Connected and Reset';
   } else {
      statusIndicator.classList.remove('connected');
      statusIndicator.classList.add('disconnected');
      statusText.innerText = 'Disconnected';
   }
};

async function Connect() {
   var success = await fetch(url + "/connect").then((res) => res.json());
   if (success) {
      setStatus("connected")
      document.getElementById("disconnectBtn").disabled = false;
      document.getElementById("connectBtn").disabled = true;
   }
}
async function Disconnect() {
   var result = await fetch(url + "/disconnect").then((res) => res.json());
   if (result) {
      setStatus("disconnected")
      document.getElementById("disconnectBtn").disabled = true;
   }
}

// View all Suppliers
async function ReadSuppliers() {
   // Fetch all suppliers from the server
   var json = await fetch(url + "/supplier").then((res) => res.json());
   // Log the response
   console.log(json);
   // Create a table from the response and append it to the 'container' element
   await createTableFromJSON(json, "supplierTableContainer");
}

// View Supplier by ID
async function ReadSupplier(){
   var supplier_id = document.getElementById("supplierId");
   console.log(supplier_id.value);
   var json = await fetch(url + "/supplier/" + supplier_id.value, {method:"GET"}).then((res) => res.json());
   supplier_id.value = "";
   console.log(json);
   await createTableFromJSON(json, "supplierIdTableContainer");
}

async function DeleteSupplier() {
   var supplier_id = document.getElementById("supplierId");
   console.log(supplier_id.value);
   var json = await fetch(url + "/supplier/" + supplier_id.value, {method:"DELETE"}).then((res) => res.json());
   supplier_id.value = "";
   console.log(json);
   await ReadSuppliers();
}

// Brews: Frontend functions which query backend API
// Parameters from form data: recipe_id, date, recipe_scale
async function CreateBrew() {
   var recipe_id = document.getElementById("brew_recipeID").value;
   var date = document.getElementById("brew_date").value;
   var recipe_scale = document.getElementById("brew_recipeScale").value;
   await fetch(url + "/brew?recipeId=" + recipe_id + "&date=" + date + "&recipeScale=" + recipe_scale, {method:"POST"});
   await ReadBrews();
}

async function ReadBrews() {
   var json = await fetch(url + "/brew", {method:"GET"}).then((res) => res.json());
   console.log(json);
   if (json)
      await createTableFromJSON(json, "brewTableContainer");
}

// Parameters from form data: brew_id
async function ReadBrew(){
   var brew_id = document.getElementById("brew_ID").value;
   var json = await fetch(url + "/brew/" + brew_id, {method:"GET"}).then((res) => res.json());
   if (json)
      await createTableFromJSON(json, "brewTableContainer");
}

// Parameters from form data: brew_id, recipe_id, date, recipe_scale
async function UpdateBrew() {
   var brew_id = document.getElementById("brew_ID").value;
   var recipe_id = document.getElementById("brew_recipeID").value;
   var date = document.getElementById("brew_date").value;
   var recipe_scale = document.getElementById("brew_recipeScale").value;
   if (!brew_id) {
      return;
   }
   var query = url + "/brew?brewId=" + brew_id;
   if (recipe_id) {
      query += "&recipeId=" + recipe_id;
   }
   if (date) {
      query += "&date=" + date;
   }
   if (recipe_scale) {
      query += "&recipeScale=" + recipe_scale;
   }
   await fetch(query, {method:"PUT"});
   await ReadBrews();
}

// Parameters from form data: brew_id
async function DeleteBrew() {
   var brew_id = document.getElementById("brew_ID").value;
   var json = await fetch(url + "/brew/" + brew_id, {method:"DELETE"});
   await ReadBrews();
}

// Ingredients Frontend Functions
// Create new ingredient
async function createIngredient(name, supplier_id, unit_price, unit, stock) {
   // Send a POST request to the server
   var response = await fetch(url + "/ingredients", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      // Convert the input data to JSON
      body: JSON.stringify({ name, supplier_id, unit_price, unit, stock }),
   });
   // Parse the server's response
   var data = await response.json();
   console.log(data);
}

// Update the supplier of an ingredient
async function updateIngredientSupplier(ingredient_id, new_supplier_id) {
   const response = await fetch(url + "/ingredients/" + ingredient_id + "/supplier", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
   },
      // Convert the input data to JSON
      body: JSON.stringify({ new_supplier_id }),
   });
   const data = await response.json();
   console.log(data);
}

// Update the name of an ingredient
async function updateIngredientName(ingredient_id, new_name) {
   const response = await fetch(url + "/ingredients/" + ingredient_id + "/name", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
   },
      body: JSON.stringify({ new_name }),
   });
   const data = await response.json();
   console.log(data);
}

// Update the unit price of an ingredient
async function updateIngredientUnitPrice(ingredient_id, new_unit_price) {
   const response = await fetch(url + "/ingredients/" + ingredient_id + "/unit_price", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ new_unit_price }),
   });
   const data = await response.json();
   console.log(data);
}

// Update the unit of an ingredient
async function updateIngredientUnit(ingredient_id, new_unit) {
   const response = await fetch(url + "/ingredients/" + ingredient_id + "/unit", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ new_unit }),
   });
   const data = await response.json();
   console.log(data);
}

// Update the stock of an ingredient
async function updateIngredientStock(ingredient_id, new_stock) {
   const response = await fetch(url + "/ingredients/" + ingredient_id + "/stock", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ new_stock }),
   });
   const data = await response.json();
   console.log(data);
}

// Update various fields of an ingredient
async function updateIngredientFields() {
   // Retrieve values from form input fields
   const ingredientId = document.getElementById('ingredient_ID').value;
   const ingredientName = document.getElementById('ingredient_Name').value;
   const supplierId = document.getElementById('supplier_ID').value;
   const unitPrice = document.getElementById('unit_Price').value;
   const unit = document.getElementById('unit').value;
   const stock = document.getElementById('stock').value;

   // Check if each field has a value, and if it does, send an update request to the server
   if (ingredientName) {
      await updateIngredientName(ingredientId, ingredientName);
   }
   if (supplierId) {
      await updateIngredientSupplier(ingredientId, supplierId);
   }
   if (unitPrice) {
      await updateIngredientUnitPrice(ingredientId, unitPrice);
   }
   if (unit) {
      await updateIngredientUnit(ingredientId, unit);
   }
   if (stock) {
      await updateIngredientStock(ingredientId, stock);
   }
}

// Delete an ingredient
async function deleteIngredient(ingredient_id) {
   // Send a DELETE request to the server
   const response = await fetch(url + "/ingredients/" + ingredient_id, {
      method: "DELETE",
   });
   // Parse the server's response
   const data = await response.json();
   console.log(data);
   return data;
}

// View all ingredients
async function getIngredients() {
   // Send a GET request to the server
   var json = await fetch(url + "/ingredients").then((res) => res.json());
   console.log(json);
   // Create a new table with the response data and append it to the container with id "container1"
   await createTableFromJSON(json, "ingredientTableContainer");
}

// Get an ingredient by id
async function getIngredientById() {
   var ingredient_id = document.getElementById("ingredientId");
   console.log(ingredient_id.value);
   var json = await fetch(url + "/ingredients/" + ingredient_id.value, {method:"GET"}).then((res) => res.json());
   ingredient_id.value = "";
   console.log(json);
   // Create a new table with the response data and append it to the container with id "container2"
   await createTableFromJSON(json, "ingredientIdTableContainer");
}

// Source https://www.tutorialspoint.com/how-to-convert-json-data-to-a-html-table-using-javascript-jquery
async function createTableFromJSON(jsonData, tableContainerID) {
   // Get the container element where the table will be inserted
   let container = document.getElementById(tableContainerID);
   if (container.childElementCount > 0)
      container.removeChild(container.firstChild);

   // Clear the container's contents
   container.innerHTML = '';
   
   // Create the table element
   let table = document.createElement("table");
   
   // Get the keys (column names) of the first object in the JSON data
   let cols = Object.keys(jsonData[0]);
   
   // Create the header element
   let thead = document.createElement("thead");
   let tr = document.createElement("tr");
   
   // Loop through the column names and create header cells
   cols.forEach((item) => {
      let th = document.createElement("th");
      th.innerText = item; // Set the column name as the text of the header cell
      tr.appendChild(th); // Append the header cell to the header row
   });
   thead.appendChild(tr); // Append the header row to the header
   table.append(tr) // Append the header to the table
   
   // Loop through the JSON data and create table rows
   jsonData.forEach((item) => {
      let tr = document.createElement("tr");
      
      // Get the values of the current object in the JSON data
      let vals = Object.values(item);
      
      // Loop through the values and create table cells
      vals.forEach((elem) => {
         let td = document.createElement("td");
         td.innerText = elem; // Set the value as the text of the table cell
         tr.appendChild(td); // Append the table cell to the table row
      });
      table.appendChild(tr); // Append the table row to the table
   });
   container.appendChild(table) // Append the table to the container element
}


//Recipe front-end funtions

// Create new recipe
async function createRecipe(name, yield, abv, price) {
   // Send a POST request to the server
   var response = await fetch(url + "/recipies", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      // Convert the input data to JSON
      body: JSON.stringify({ name, yield, abv, price }),
   });
   // Parse the server's response
   var data = await response.json();
   console.log(data);
}

// Update recipe name
async function updateRecipeName(recipe_id, new_name) {
   const response = await fetch(url + "/recipies/" + recipe_id + "/name", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
   },
      // Convert the input data to JSON
      body: JSON.stringify({ new_name }),
   });
   const data = await response.json();
   console.log(data);
}

// Update Yield
async function updateRecipeYield(recipe_id, new_yield) {
   const response = await fetch(url + "/recipies/" + recipe_id + "/yield", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
   },
      // Convert the input data to JSON
      body: JSON.stringify({ new_yield }),
   });
   const data = await response.json();
   console.log(data);
}

// Update abv
async function updateRecipeABV(recipe_id, new_abv) {
   const response = await fetch(url + "/recipies/" + recipe_id + "/abv", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
   },
      // Convert the input data to JSON
      body: JSON.stringify({ new_abv }),
   });
   const data = await response.json();
   console.log(data);
}

// Update price
async function updateRecipePrice(recipe_id, new_price) {
   const response = await fetch(url + "/recipies/" + recipe_id + "/price", {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
   },
      // Convert the input data to JSON
      body: JSON.stringify({ new_price }),
   });
   const data = await response.json();
   console.log(data);
}

// Update various fields of an ingredient
async function updateRecipeFields() {
   // Retrieve values from form input fields
   const recipeId = document.getElementById('recipe_ID').value;
   const recipeName = document.getElementById('recipe_Name').value;
   const recipeYield = document.getElementById('yield').value;
   const recipeABV = document.getElementById('abv').value;
   const recipePrice = document.getElementById('price').value;

   // Check if each field has a value, and if it does, send an update request to the server
   if (recipeName) {
      await updateRecipeName(recipeId, recipeName);
   }
   if (recipeYield) {
      await updateRecipeYield(recipeId, recipeYield);
   }
   if (recipeABV) {
      await updateRecipeABV(recipeId, recipeABV);
   }
   if (recipePrice) {
      await updateRecipePrice(recipeId, recipePrice);
   }
}

// Delete an ingredient
async function deleteRecipe(recipe_id) {
   // Send a DELETE request to the server
   const response = await fetch(url + "/recipies/" + recipe_id, {
      method: "DELETE",
   });
   // Parse the server's response
   const data = await response.json();
   console.log(data);
   return data;
}


// View all recipes
async function getRecipes() {
   // Send a GET request to the server
   var json = await fetch(url + "/recipies").then((res) => res.json());
   console.log(json);
   // Create a new table with the response data and append it to the container with id "container1"
   await createTableFromJSON(json, "recipeTableContainer");
}

// Get an ingredient by id
async function getRecipeById(recipe_id) {
   var json = await fetch(url + "/recipies/" + recipe_id).then((res) => res.json());
   console.log(json);
   // Create a new table with the response data and append it to the container with id "container2"
   createTableFromJSON([json], "recipeIdTableContainer");
}

async function CreateRecipeIngredient() {
   var r_id = document.getElementById("recipe_num").value;
   var i_id = document.getElementById("ingredient_num").value;
   var q = document.getElementById("quantity").value;

   await fetch(url + "/recipies?recipe_num=" + r_id + "&ingredient_num=" + i_id + "&quantity=" + q, { method: "POST" });
   await ViewRecipeIngredient();
}

async function UpdateRecipeIngredient() {
   var r_id = document.getElementById("recipe_num").value;
   var i_id = document.getElementById("ingredient_num").value;
   var q = document.getElementById("quantity").value;

   await fetch(url + "/recipies?recipe_num=" + r_id + "&ingredient_num=" + i_id + "&quantity=" + q, { method: "PUT" });
   await ViewRecipeIngredient();
}

async function ViewRecipeIngredient() {
   // Send a GET request to the server
   var json = await fetch(url + "/recipies").then((res) => res.json());
   console.log(json);
   // Create a new table with the response data and append it to the container with id "container1"
   await createTableFromJSON(json, "recipeTableContainer");
}

async function DeleteRecipeIngredient() {
   var r_id = document.getElementById("recipeId2").value;
   var i_id = document.getElementById("ingredientId2").value;

   await fetch(url + "/recipies?recipeId2=" + r_id + "&ingredientId2=" + i_id, { method: "DELETE" });
   await ViewRecipeIngredient();
}

//TODO: Suppliers Frontend functions which query backend API
// Parameters from form data: Supplier_ID, Supplier_Name, Supplier_Phone

// async function ReadSupplier(){
//    var supplier_id = document.getElementById("supplier_ID").value;

//    var json = await fetch(url + "/supplier/" + supplier_id, {method:"GET"}).then((res) => res.json());
//    await createTableFromJSON(json, "SupplierTableContainer");
// }

// async function ReadSuppliers() {
//    var json = await fetch(url + "/brew", {method:"GET"}).then((res) => res.json());
//    console.log(json);
//    await createTableFromJSON(json, "brewTableContainer");
// }


// Parameters from form data: Supplier_ID, Supplier_Name, Supplier_Phone
async function CreateSupplier() {
   //grabs only from the update/create supplier field
   var supplier_Name = document.getElementById("supplier_Name").value;
   var supplier_Phone = document.getElementById("supplier_Phone").value;
   await fetch(url + "/supplier?supplier_name=" + supplier_Name +"&supplier_number=" + supplier_Phone, {method:"POST"});
   await ReadSuppliers();
}

//update supplier:
async function UpdateSupplier() {
   var supplier_ID = document.getElementById("supplier_ID").value;
   var supplier_Name = document.getElementById("supplier_Name").value;
   var supplier_Phone = document.getElementById("supplier_Phone").value;
   if (!supplier_ID) {
      return;
   }
   var query = url + "/supplier?supplier_Id=" + supplier_ID;
   if (supplier_Name) {
      query += "&supplier_name=" + supplier_Name ;
   }
   if (supplier_Phone) {
      query += "&supplier_number=" + supplier_Phone;
   }

   await fetch(query, {method:"PUT"});
   // document.getElementById("error-text").innerHTML = "";
   // await ReadSuppliers(); 

   // await fetch(url + "/supplier?supplier_Id=" + supplier_ID + "&supplier_name=" + supplier_Name + "&supplier_number=" + supplier_Phone, { method: "PUT" });
   await ReadSuppliers(); 
}

function confirmDelete(elemType) {
   message = "Are you sure you want to delete this " + elemType + "? \nDoing so may delete any associated relationships.";
   if(confirm(message) == true) {
      document.getElementById("confirmInput").value = "True";
   }
   else { 
      document.getElementById("confirmInput").value = "False";
      return 0;
   }          
}

// Generate Reports

async function BeerProfitabiltyReport() {
   var json = await fetch(url + "/reports/BeerProfitability", {method:"GET"}).then((res) => res.json());
   console.log(json);
   await createTableFromJSON(json, "reportTableContainer");
}
async function RecipeCostReport() {
   var json = await fetch(url + "/reports/RecipeCost", {method:"GET"}).then((res) => res.json());
   await createTableFromJSON(json, "reportTableContainer");
}
async function SupplierIngredientsReport() {
   var json = await fetch(url + "/reports/SupplierIngredients", {method:"GET"}).then((res) => res.json());
   await createTableFromJSON(json, "reportTableContainer");
}
async function IngredientCostReport() {
   var json = await fetch(url + "/reports/IngredientCost", {method:"GET"}).then((res) => res.json());
   await createTableFromJSON(json, "reportTableContainer");
}
async function RecipeUsageReport() {
   var json = await fetch(url + "/reports/RecipeUsage", {method:"GET"}).then((res) => res.json());
   await createTableFromJSON(json, "reportTableContainer");
}

