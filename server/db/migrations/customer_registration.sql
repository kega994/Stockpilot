-- It prevents duplicate email addresses even when letter casing differs.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_unique
ON users (LOWER(email));