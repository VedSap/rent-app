
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Phone, Mail } from 'lucide-react';

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

interface TenantRowProps {
  tenant: Tenant;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenantId: string) => void;
}

export const TenantRow = ({ tenant, onEdit, onDelete }: TenantRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{tenant.name}</TableCell>
      <TableCell>
        <div className="flex flex-col space-y-1">
          {tenant.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-3 w-3 mr-1" />
              {tenant.email}
            </div>
          )}
          {tenant.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-3 w-3 mr-1" />
              {tenant.phone}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary">
          ${tenant.rent_amount.toFixed(2)}/month
        </Badge>
      </TableCell>
      <TableCell>
        {tenant.move_in_date ? new Date(tenant.move_in_date).toLocaleDateString() : 'N/A'}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(tenant)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(tenant.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
