
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rent_amount DECIMAL(10,2) NOT NULL,
  move_in_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rent_payments table
CREATE TABLE public.rent_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  date_paid DATE NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Tenants policies
CREATE POLICY "Users can view their own tenants" ON public.tenants
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own tenants" ON public.tenants
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own tenants" ON public.tenants
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own tenants" ON public.tenants
  FOR DELETE USING (auth.uid() = owner_id);

-- Rent payments policies
CREATE POLICY "Users can view payments for their tenants" ON public.rent_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE tenants.id = rent_payments.tenant_id 
      AND tenants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create payments for their tenants" ON public.rent_payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE tenants.id = rent_payments.tenant_id 
      AND tenants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update payments for their tenants" ON public.rent_payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE tenants.id = rent_payments.tenant_id 
      AND tenants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete payments for their tenants" ON public.rent_payments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE tenants.id = rent_payments.tenant_id 
      AND tenants.owner_id = auth.uid()
    )
  );

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
