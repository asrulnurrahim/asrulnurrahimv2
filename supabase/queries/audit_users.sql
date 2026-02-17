-- Audit: Check registered users in Supabase Auth
-- Description: 
-- 1. Count total users (Should be 1 for single-admin)
-- 2. List user details (id, email, providers, created_at, last_sign_in_at)

-- 1. Count users
SELECT count(*) as total_users FROM auth.users;

-- 2. List users with specific columns
SELECT 
    id, 
    email, 
    raw_app_meta_data->'provider' as provider,
    created_at, 
    last_sign_in_at
FROM auth.users;
