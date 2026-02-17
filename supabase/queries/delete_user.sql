-- Delete User
-- Description: Delete a user from auth.users by email.
-- WARNING: This action is irreversible.

-- Replace 'EMAIL_TO_DELETE' with the actual email of the dummy user.
DELETE FROM auth.users 
WHERE email = 'EMAIL_TO_DELETE';

-- Verify deletion (Should return 0 for the deleted email)
SELECT count(*) FROM auth.users WHERE email = 'EMAIL_TO_DELETE';
