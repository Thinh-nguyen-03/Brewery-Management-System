-- Table: public.supplier

DROP TABLE IF EXISTS public.supplier CASCADE;

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
	
INSERT INTO supplier(supplier_name, number) VALUES ('Brew Supply Haus', '(979) 721-9463');
INSERT INTO supplier(supplier_name, number) VALUES ('Costco', '(979) 321-6550');

SELECT * FROM supplier