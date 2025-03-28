CREATE TABLE "fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(25) NOT NULL,
	"polygon" jsonb NOT NULL,
	"image" text DEFAULT '',
	"croptype" varchar(50) DEFAULT 'Add Crop' NOT NULL,
	"editedat" timestamp DEFAULT now()
);
