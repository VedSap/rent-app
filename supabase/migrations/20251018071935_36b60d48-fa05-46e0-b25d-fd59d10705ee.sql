-- Create update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rent_amount NUMERIC NOT NULL,
  move_in_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
CREATE POLICY "Users can view their own tenants"
ON public.tenants FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own tenants"
ON public.tenants FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own tenants"
ON public.tenants FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own tenants"
ON public.tenants FOR DELETE
USING (auth.uid() = owner_id);

-- Create trigger for updated_at on tenants
CREATE TRIGGER update_tenants_updated_at
BEFORE UPDATE ON public.tenants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create rent_payments table
CREATE TABLE public.rent_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  amount_paid NUMERIC NOT NULL,
  date_paid TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'paid',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rent_payments
CREATE POLICY "Users can view their own rent payments"
ON public.rent_payments FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own rent payments"
ON public.rent_payments FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own rent payments"
ON public.rent_payments FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own rent payments"
ON public.rent_payments FOR DELETE
USING (auth.uid() = owner_id);

-- Create trigger for updated_at on rent_payments
CREATE TRIGGER update_rent_payments_updated_at
BEFORE UPDATE ON public.rent_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create profiles view (alias for user_profiles for compatibility)
CREATE VIEW public.profiles AS
SELECT * FROM public.user_profiles;