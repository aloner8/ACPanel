-- AlterTable
ALTER TABLE "Customer"
ADD COLUMN "customer_type" TEXT;

-- CreateTable
CREATE TABLE "public"."ref" (
    "id" SERIAL NOT NULL,
    "refname" TEXT NOT NULL,
    "values" JSONB NOT NULL,

    CONSTRAINT "ref_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ref_refname_key" ON "public"."ref"("refname");

-- Seed customer type reference
INSERT INTO "public"."ref" ("refname", "values")
VALUES (
  'customer_type',
  '["ส่วนราชการ","ร้านค้า","โรงพยาบาล","อบต","คลีนิค","สถานศึกษา","บุคคล","ทั่วไป"]'::jsonb
)
ON CONFLICT ("refname")
DO UPDATE SET "values" = EXCLUDED."values";
