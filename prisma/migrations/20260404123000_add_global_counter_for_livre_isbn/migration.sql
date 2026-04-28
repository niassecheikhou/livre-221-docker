-- CreateSequence
CREATE SEQUENCE "livre_isbn_global_seq"
START WITH 1
INCREMENT BY 1;

-- SeedSequenceFromExistingGeneratedIsbn
WITH max_value AS (
  SELECT COALESCE(MAX(RIGHT("isbn", 5)::bigint), 0) AS value
  FROM "livres"
  WHERE "isbn" ~ '^[A-Za-z]{2}[0-9]{5}$'
)
SELECT setval(
  'livre_isbn_global_seq',
  CASE WHEN (SELECT value FROM max_value) > 0 THEN (SELECT value FROM max_value) ELSE 1 END,
  CASE WHEN (SELECT value FROM max_value) > 0 THEN true ELSE false END
);
