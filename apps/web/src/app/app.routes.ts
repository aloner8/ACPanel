import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { CustomersPageComponent } from './pages/customers/customers.page';
import { DomainsPageComponent } from './pages/domains/domains.page';
import { PackagesPageComponent } from './pages/packages/packages.page';
import { ActivityLogsPageComponent } from './pages/activity-logs/activity-logs.page';
import { SettingsPageComponent } from './pages/settings/settings.page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardPageComponent
  },
  {
    path: 'customers',
    component: CustomersPageComponent
  },
  {
    path: 'domains',
    component: DomainsPageComponent
  },
  {
    path: 'packages',
    component: PackagesPageComponent
  },
  {
    path: 'activity-logs',
    component: ActivityLogsPageComponent
  },
  {
    path: 'settings',
    component: SettingsPageComponent
  }
];
