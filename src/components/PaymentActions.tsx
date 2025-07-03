
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';

interface Payment {
  id: string;
  tenant_id: string;
  amount_paid: number;
  date_paid: string;
  payment_method: string;
  status: string;
  notes: string | null;
  tenants: {
    name: string;
  };
}

interface PaymentActionsProps {
  payment: Payment;
  onEdit: (payment: Payment) => void;
  onDelete: () => void;
}

export const PaymentActions = ({ payment, onEdit, onDelete }: PaymentActionsProps) => {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this payment?')) return;

    try {
      const { error } = await supabase
        .from('rent_payments')
        .delete()
        .eq('id', payment.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Payment deleted successfully"
      });
      
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(payment)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
