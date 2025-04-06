CREATE TABLE "cropInfo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fieldId" uuid NOT NULL,
	"cropName" varchar(50) NOT NULL,
	"cropType" varchar(50),
	"maturityDay" numeric NOT NULL,
	"sowing" timestamp NOT NULL,
	"harvesting" timestamp,
	"soilType" varchar(30),
	"soilMoist" numeric,
	"surfaceTemp" numeric,
	"ndvi" numeric,
	"ndwi" numeric,
	"lai" numeric,
	"editedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(25) NOT NULL,
	"area" numeric NOT NULL,
	"geojson" jsonb NOT NULL,
	"image" text DEFAULT '',
	"editedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "cropInfo" ADD CONSTRAINT "cropInfo_fieldId_fields_id_fk" FOREIGN KEY ("fieldId") REFERENCES "public"."fields"("id") ON DELETE cascade ON UPDATE no action;