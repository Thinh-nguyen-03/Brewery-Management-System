
-- Clear out all old tables
DROP TABLE IF EXISTS public.brews;
DROP TABLE IF EXISTS public.recipies_ingredients;
DROP TABLE IF EXISTS public.recipies;
DROP TABLE IF EXISTS public.ingredients;
DROP TABLE IF EXISTS public.supplier;


-- Table: public.supplier

CREATE TABLE IF NOT EXISTS public.supplier
(
    supplier_id serial NOT NULL,
    supplier_name text COLLATE pg_catalog."default" NOT NULL,
    number text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT supplier_pkey PRIMARY KEY (supplier_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.supplier
    OWNER to postgres;

-- Table: public.ingredients

CREATE TABLE IF NOT EXISTS public.ingredients
(
    ingredient_id serial NOT NULL,
    supplier_id integer NOT NULL,
    ingredient_name text NOT NULL,
    unit_price numeric NOT NULL,
    unit text NOT NULL,
    stock numeric NOT NULL,
    CONSTRAINT ingredients_pkey PRIMARY KEY (ingredient_id),
	CONSTRAINT ingredient_has_supplier FOREIGN KEY (supplier_id)
        REFERENCES public.supplier (supplier_id)
		NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ingredients
    OWNER to postgres;

-- Table: public.recipies

CREATE TABLE IF NOT EXISTS public.recipies
(
    recipe_id serial NOT NULL,
    recipe_name text NOT NULL,
    yield numeric NOT NULL,
    abv numeric NOT NULL,
    price numeric NOT NULL,
    CONSTRAINT recipies_pkey PRIMARY KEY (recipe_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.recipies
    OWNER to postgres;

-- Table: public.recipies_ingredients

CREATE TABLE IF NOT EXISTS public.recipies_ingredients
(
    recipe_id serial NOT NULL,
    ingredient_id integer NOT NULL,
    ingredient_quanity integer NOT NULL,
    CONSTRAINT recipe_id_fkey FOREIGN KEY (recipe_id)
        REFERENCES public.recipies (recipe_id)
		NOT VALID,
    CONSTRAINT ingredient_id_fkey FOREIGN KEY (ingredient_id)
        REFERENCES public.ingredients (ingredient_id)
        NOT VALID 
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.recipies_ingredients
    OWNER to postgres;
	
-- Table: public.brews

CREATE TABLE IF NOT EXISTS public.brews
(
    batch_id serial NOT NULL,
    recipe_id integer NOT NULL,
    date date NOT NULL,
    recipe_scale numeric NOT NULL,
    CONSTRAINT brews_pkey PRIMARY KEY (batch_id),
    CONSTRAINT recipe_id_fkey FOREIGN KEY (recipe_id)
        REFERENCES public.recipies (recipe_id)
		NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.brews
    OWNER to postgres;
	

-- Populate with example data

INSERT INTO supplier(supplier_name, number) VALUES ('Brew Supply Haus', '(979) 721-9463');
INSERT INTO supplier(supplier_name, number) VALUES ('Costco', '(979) 321-6550');

-- Note: unit is the measurment system of ingredient, unit_price is cst in USD per unit, stock is amount on hand, measured in units	
--		 e.g.: Hops costs $35.14/kg and we have 10.2kg on hand
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'German Wheat Malt', 2.14, 'kg', 10.2);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'Hallertau Mittelfruh Hops', 0.051, 'g', 400);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(2, 'Yeast Nutrient', 0.032, 'g', 500.0);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'US Pale Grain', 1.20, 'kg', 194);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'Cascade Hops', 0.10, 'g', 123);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(2, 'Brewer''s Yeast', 0.54, 'g', 5.4);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(2, 'Whirlfloc Tablet', 0.29, 'each', 341);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(2, 'Coriander', 0.005, 'g', 600);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'German Pilsner Malt', 0.98, 'kg', 25.4);

-- Note: Yeild is final volume in gallons produced by recipe, abv is % alcohol by volume (typically 3-10%), price is sell price in USD of standard pour (1 pt, or 1/8 of a gallon)
INSERT INTO recipies(recipe_name, yield, abv, price) VALUES('White IPA', 10, 6.2, 6.25);
INSERT INTO recipies(recipe_name, yield, abv, price) VALUES('Sierra Nevada Pale Ale Clone', 5, 5.57, 7.00);
INSERT INTO recipies(recipe_name, yield, abv, price) VALUES('Paulaner Hefe-Weissbier Clone', 8.7, 5.8, 5.50);

-- Note: Quantity is amount measured with unit ingredeint.unit)
INSERT INTO recipies_ingredients VALUES (1, 1, 5.6);
INSERT INTO recipies_ingredients VALUES (1, 2, 50);
INSERT INTO recipies_ingredients VALUES (1, 3, 20);
INSERT INTO recipies_ingredients VALUES (1, 6, 5);
INSERT INTO recipies_ingredients VALUES (2, 4, 4.5);
INSERT INTO recipies_ingredients VALUES (2, 5, 40);
INSERT INTO recipies_ingredients VALUES (2, 6, 7.5);
INSERT INTO recipies_ingredients VALUES (2, 7, 1);
INSERT INTO recipies_ingredients VALUES (3, 2, 50);
INSERT INTO recipies_ingredients VALUES (3, 5, 40);
INSERT INTO recipies_ingredients VALUES (3, 8, 25);
INSERT INTO recipies_ingredients VALUES (3, 9, 6.2);

-- Note: Recipe_scale represents multiple of Recipe quantities (i.e. 2 is a double-batch)
INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (1, '2023-7-20', 1);
INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (2, '2023-7-25', 3);
INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (3, '2023-7-25', 1.5);
INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (2, '2023-7-30', 2);