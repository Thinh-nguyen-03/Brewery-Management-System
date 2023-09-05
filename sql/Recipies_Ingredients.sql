-- Table: public.recipes_ingredients

DROP TABLE IF EXISTS public.recipies_ingredients;

CREATE TABLE IF NOT EXISTS public.recipies_ingredients
(
    recipe_id serial NOT NULL,
    ingredient_id integer NOT NULL,
    ingredient_quanity integer NOT NULL,
    CONSTRAINT recipes_ingredients_ingredient_id_fkey FOREIGN KEY (ingredient_id)
        REFERENCES public.ingredients (ingredient_id)
        NOT VALID,
    CONSTRAINT recipes_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id)
        REFERENCES public.recipies (recipe_id)
		NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.recipes_ingredients
    OWNER to postgres;
	
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

SELECT * FROM recipies_ingredients;