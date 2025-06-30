
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rent_amount: number;
  move_in_date: string | null;
  notes: string | null;
  created_at: string;
}

interface TenantFormProps {
  editingTenant: Tenant | null;
  onTenantSaved: () => void;
  onEditingChange: (tenant: Tenant | null) => void;
}

export const TenantForm = ({ editingTenant, onTenantSaved, onEditingChange }: TenantFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rent_amount: '',
    move_in_date: '',
    notes: ''
  });
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const tenantData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        rent_amount: parseFloat(formData.rent_amount),
        move_in_date: formData.move_in_date || null,
        notes: formData.notes || null,
        owner_id: user.id
      };

      if (editingTenant) {
        const { error } = await supabase
          .from('tenants')
          .update(tenantData)
          .eq('id', editingTenant.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Tenant updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('tenants')
          .insert([tenantData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Tenant added successfully"
        });
      }

      setDialogOpen(false);
      onEditingChange(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        rent_amount: '',
        move_in_date: '',
        notes: ''
      });
      onTenantSaved();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (tenant: Tenant) => {
    onEditingChange(tenant);
    setFormData({
      name: tenant.name,
      email: tenant.email || '',
      phone: tenant.phone || '',
      rent_amount: tenant.rent_amount.toString(),
      move_in_date: tenant.move_in_date || '',
      notes: tenant.notes || ''
    });
    setDialogOpen(true);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => {
          onEditingChange(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
            rent_amount: '',
            move_in_date: '',
            notes: ''
          });
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
          </DialogTitle>
          <DialogDescription>
            {editingTenant ? 'Update tenant information' : 'Add a new tenant to your property'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rent_amount">Monthly Rent *</Label>
            <Input
              id="rent_amount"
              type="number"
              step="0.01"
              value={formData.rent_amount}
              onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="move_in_date">Move-in Date</Label>
            <Input
              id="move_in_date"
              type="date"
              value={formData.move_in_date}
              onChange={(e) => setFormData({ ...formData, move_in_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about the tenant..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTenant ? 'Update' : 'Add'} Tenant
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
