
import { useState } from 'react';
import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
import { TenantsManager } from './TenantsManager';
import { PaymentsManager } from './PaymentsManager';
import { Settings } from './Settings';

export const MainApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tenants':
        return <TenantsManager />;
      case 'payments':
        return <PaymentsManager />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main content */}
      <div className="lg:pl-64">
        <main className="p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
