-- Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aberto', -- aberto, em_progresso, fechado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ticket_messages table
CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Who sent the message (Admin or Client)
  message TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies for tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage all tickets
CREATE POLICY "Admins can view all tickets" ON public.tickets FOR SELECT USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');
CREATE POLICY "Admins can update all tickets" ON public.tickets FOR UPDATE USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');
CREATE POLICY "Admins can insert tickets" ON public.tickets FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');

-- Users can view and manage their own tickets
CREATE POLICY "Users can view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON public.tickets FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view and manage all ticket messages
CREATE POLICY "Admins can view all ticket messages" ON public.ticket_messages FOR SELECT USING (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');
CREATE POLICY "Admins can insert ticket messages" ON public.ticket_messages FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = 'lgtecserv@gmail.com');

-- Users can view and insert messages on their own tickets
CREATE POLICY "Users can view own ticket messages" ON public.ticket_messages FOR SELECT USING (
  ticket_id IN (SELECT id FROM public.tickets WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert own ticket messages" ON public.ticket_messages FOR INSERT WITH CHECK (
  ticket_id IN (SELECT id FROM public.tickets WHERE user_id = auth.uid())
);
