-- CreateSequence
CREATE SEQUENCE "editeur_code_global_seq"
START WITH 1
INCREMENT BY 1;

-- SeedSequenceFromExistingCodes
WITH max_value AS (
  SELECT COALESCE(MAX((regexp_match("code", '([0-9]+)$'))[1]::bigint), 0) AS value
  FROM "editeurs"
)
SELECT setval(
  'editeur_code_global_seq',
  CASE WHEN (SELECT value FROM max_value) > 0 THEN (SELECT value FROM max_value) ELSE 1 END,
  CASE WHEN (SELECT value FROM max_value) > 0 THEN true ELSE false END
);
