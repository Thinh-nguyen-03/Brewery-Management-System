-- Table: public.ingredients

DROP TABLE IF EXISTS public.ingredients CASCADE;

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
	
-- Note: unit (measurment system of ingredient), unit_price (USD per unit), stock (amount on hand in units)	
--		 e.g.: Hops costs $35.14/kg and we have 10.2kg on hand
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'German Wheat Malt', 2.14, 'kg', 10.2);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'Hallertau Mittelfruh Hops', 3.14, 'g', 400);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(2, 'Yeast Nutrient', 0.032, 'g', 500.0);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'US Pale Grain', 1.20, 'kg', 194);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'Cascade Hops', 0.10, 'g', 123);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(2, 'Brewer''s Yeast', 0.54, 'g', 5.4);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(2, 'Whirlfloc Tablet', 0.29, 'each', 813);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(2, 'Coriander', 0.005, 'g', 600);
INSERT INTO ingredients(supplier_id, ingredient_name, unit_price, unit, stock) VALUES(1, 'German Pilsner Malt', 0.98, 'kg', 25.4);
	
SELECT * FROM ingredients