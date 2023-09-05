-- Table: public.recipies

DROP TABLE IF EXISTS public.recipies CASCADE;

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
	
-- Note: Yeild(gallons) of recipe, abv(% alcohol by volume), price(USD) of standard pour (1 pt, or 1/8 of a gallon)
INSERT INTO recipies(recipe_name, yield, abv, price) VALUES('White IPA', 10, 6.2, 6.25);
INSERT INTO recipies(recipe_name, yield, abv, price) VALUES('Sierra Nevada Pale Ale Clone', 5, 5.57, 7.00);
INSERT INTO recipies(recipe_name, yield, abv, price) VALUES('Paulaner Hefe-Weissbier Clone', 8.7, 5.8, 5.50);

SELECT * FROM recipies;