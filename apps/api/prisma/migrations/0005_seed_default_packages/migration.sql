-- Replace default package rows with fixed IDs
DELETE FROM "AppPackage"
WHERE "id" IN ('1', '2', '3')
   OR "slug" IN ('web-normal', 'docker-yii', 'docker-full-stack');

INSERT INTO "AppPackage" (
  "id",
  "name",
  "slug",
  "version",
  "engine",
  "config",
  "installMode",
  "isActive",
  "createdAt",
  "updatedAt"
)
VALUES
  (
    '1',
    'Web normal',
    'web-normal',
    '1.0.0',
    'root nginx',
    '{"path":"home/?username/?domain/public_html","other":"?"}'::jsonb,
    'root-nginx',
    true,
    NOW(),
    NOW()
  ),
  (
    '2',
    'Docker YII',
    'docker-yii',
    '1.0.0',
    'docker stack Yii fraemwer',
    '{"dockerscript":"?","port":"?","rootNginx":{"serverName":"?"}}'::jsonb,
    'docker-stack',
    true,
    NOW(),
    NOW()
  ),
  (
    '3',
    'Docker Full stack (Posgresql,Nodejs + Angular)',
    'docker-full-stack',
    '1.0.0',
    'docker stack (Posgresql,Nodejs + Angular)',
    '{"dockerscript":"?","port":"?","rootNginx":{"serverName":"?"}}'::jsonb,
    'docker-stack',
    true,
    NOW(),
    NOW()
  );
