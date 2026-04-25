-- CreateTable
CREATE TABLE "public"."packets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "engine" TEXT NOT NULL,
    "config" JSONB NOT NULL,

    CONSTRAINT "packets_pkey" PRIMARY KEY ("id")
);

-- Seed default packets
INSERT INTO "public"."packets" ("id", "name", "engine", "config")
VALUES
  (
    1,
    'Web normal',
    'root nginx',
    '{"path":"home/?username/?domain/public_html","other":"?"}'::jsonb
  ),
  (
    2,
    'Docker YII',
    'docker stack Yii framework',
    '{"dockerscript":"?","port":"?","rootNginx":{"serverName":"?"}}'::jsonb
  ),
  (
    3,
    'Docker Full stack (Posgresql,Nodejs + Angular)',
    'docker stack (Posgresql,Nodejs + Angular)',
    '{"dockerscript":"?","port":"?","rootNginx":{"serverName":"?"},"services":["Posgresql","Nodejs","Angular"]}'::jsonb
  )
ON CONFLICT ("id")
DO UPDATE SET
  "name" = EXCLUDED."name",
  "engine" = EXCLUDED."engine",
  "config" = EXCLUDED."config";
