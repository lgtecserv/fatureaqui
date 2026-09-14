-- Allow admins to view clients, products, and documents for activity metrics
CREATE POLICY "Admins can view all clients" ON public.clients FOR SELECT USING (auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com'));

CREATE POLICY "Admins can view all products" ON public.products FOR SELECT USING (auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com'));

CREATE POLICY "Admins can view all documents" ON public.documents FOR SELECT USING (auth.jwt() ->> 'email' IN ('lgtecserv@gmail.com', 'lgtecserv.com@gmail.com'));
