-- DROP the old subscriptions policies if they exist (they have the old email)
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
DROP POLICY IF EXISTS "Admins can view all receipts." ON storage.objects;

-- Subscriptions: users can see their own, admin can see all
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');
CREATE POLICY "Users can update their own subscription" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR ALL USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');

-- Companies: Admin can see all companies
CREATE POLICY "Admins can view all companies" ON public.companies FOR ALL USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');

-- Receipts Storage
CREATE POLICY "Admins can view all receipts." ON storage.objects FOR SELECT USING (bucket_id = 'receipts' AND auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');
