CREATE TABLE "country" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"numeric_code" varchar(10),
	"phone_code" varchar(20),
	"currency_code" varchar(10),
	"currency_name" varchar(255),
	"currency_symbol" varchar(20),
	"nationality" varchar(255)
);
