-- Table: public.brews

DROP TABLE IF EXISTS public.brews;

CREATE TABLE IF NOT EXISTS public.brews
(
    batch_id serial NOT NULL,
    recipe_id integer NOT NULL,
    date date NOT NULL,
    recipe_scale numeric NOT NULL,
    CONSTRAINT brews_pkey PRIMARY KEY (batch_id),
    CONSTRAINT brews_recipe_id_fkey FOREIGN KEY (recipe_id)
        REFERENCES public.recipies (recipe_id)
		NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.brews
    OWNER to postgres;
	
INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (1, '2023-7-20', 1);
INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (2, '2023-7-25', 3);
INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (3, '2023-7-25', 1.5);
INSERT INTO brews(recipe_id, date, recipe_scale) VALUES (2, '2023-7-30', 2);
	
SELECT * FROM brews