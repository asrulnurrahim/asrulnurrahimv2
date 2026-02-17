-- Audit: Check RLS Status and Policies
-- Description: 
-- 1. Check if RLS is ENABLED for relevant tables
-- 2. List all active policies for relevant tables

-- 1. Check RLS Status (relrowsecurity = true means ENABLED)
SELECT 
    relname as table_name, 
    CASE WHEN relrowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_class 
WHERE relname IN ('projects', 'technologies', 'project_technologies');

-- 2. List all Policies
SELECT 
    tablename, 
    policyname, 
    cmd as operation, 
    roles, 
    qual as using_expression, 
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename IN ('projects', 'technologies', 'project_technologies')
ORDER BY tablename, policyname;
