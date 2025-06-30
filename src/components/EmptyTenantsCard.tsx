
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const EmptyTenantsCard = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No tenants yet</h3>
        <p className="text-muted-foreground text-center mb-4">
          Start by adding your first tenant to begin managing your properties.
        </p>
      </CardContent>
    </Card>
  );
};
