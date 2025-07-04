
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const Settings = () => {
  const { user, signOut } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setDeleting(true);
    try {
      console.log('Starting account deletion process for user:', user.id);
      
      // Delete all user data in the correct order (child records first)
      const { error: paymentsError } = await supabase
        .from('rent_payments')
        .delete()
        .eq('tenant_id', user.id);
      
      if (paymentsError) {
        console.error('Error deleting payments:', paymentsError);
      }

      const { error: tenantsError } = await supabase
        .from('tenants')
        .delete()
        .eq('owner_id', user.id);
      
      if (tenantsError) {
        console.error('Error deleting tenants:', tenantsError);
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }
      
      console.log('User data deleted successfully');
      
      toast({
        title: "Account Data Deleted",
        description: "Your account data has been permanently deleted. You will now be signed out."
      });
      
      // Sign out the user (this effectively "deletes" their access to the app)
      await signOut();
      
    } catch (error: any) {
      console.error('Error during account deletion:', error);
      toast({
        title: "Error",
        description: "Failed to delete account data. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">User ID</label>
              <p className="text-sm text-gray-900 font-mono">{user?.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Account Created</label>
              <p className="text-sm text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Information</CardTitle>
          <CardDescription>
            About RentApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">🏠 <strong>RentApp</strong> - Property Management Made Simple</p>
            <p className="text-sm text-gray-600">Version 1.0.0</p>
            <p className="text-sm text-gray-600">
              Built with React, Supabase, and Tailwind CSS
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that will permanently affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your data
                  including tenants, payments, and profile information from our servers.
                  You will be signed out and your account data will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleting ? 'Deleting...' : 'Delete Account Data'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
