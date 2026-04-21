import { Routes } from '@angular/router';
import { DashboardPageComponent } from './pages/dashboard/dashboard.page';
import { CustomersPageComponent } from './pages/customers/customers.page';
import { DomainsPageComponent } from './pages/domains/domains.page';
import { PackagesPageComponent } from './pages/packages/packages.page';
import { ActivityLogsPageComponent } from './pages/activity-logs/activity-logs.page';
import { SettingsPageComponent } from './pages/settings/settings.page';
import { LoginPageComponent } from './pages/login/login.page';
import { authGuard, guestGuard } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [guestGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    component: DashboardPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    component: CustomersPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'domains',
    component: DomainsPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'packages',
    component: PackagesPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'activity-logs',
    component: ActivityLogsPageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [authGuard]
  }
];
