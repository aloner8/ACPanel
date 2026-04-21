import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, of } from 'rxjs';
import { API_BASE_URL } from './api.config';

export interface HealthStatus {
  status: string;
  database: string;
  service: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  createdAt?: string;
}

export interface CustomerPayload {
  code: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  taxId?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  district?: string | null;
  province?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export interface Domain {
  id: string;
  customerId?: string;
  fqdn: string;
  rootDomain: string;
  subdomain?: string | null;
  sslStatus?: string | null;
  deploymentStatus?: string | null;
  customer?: Customer;
}

export interface DomainPayload {
  customerId: string;
  rootDomain: string;
  subdomain?: string | null;
  dnsProvider?: string | null;
  bindZoneName?: string | null;
  nginxServerName?: string | null;
  sslStatus?: string | null;
  isPrimary: boolean;
}

export interface AppPackage {
  id: string;
  name: string;
  slug: string;
  version: string;
  category?: string | null;
  installMode?: string | null;
  isActive: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface DashboardSummary {
  health: HealthStatus;
  counts: {
    customers: number;
    domains: number;
    packages: number;
    logs: number;
  };
  customers: Customer[];
  domains: Domain[];
  packages: AppPackage[];
  logs: ActivityLog[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);

  getHealth() {
    return this.http.get<HealthStatus>(`${API_BASE_URL}/health`);
  }

  getCustomers() {
    return this.http.get<Customer[]>(`${API_BASE_URL}/customers`);
  }

  createCustomer(payload: CustomerPayload) {
    return this.http.post<Customer>(`${API_BASE_URL}/customers`, payload);
  }

  updateCustomer(id: string, payload: CustomerPayload) {
    return this.http.put<Customer>(`${API_BASE_URL}/customers/${id}`, payload);
  }

  deleteCustomer(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/customers/${id}`);
  }

  getDomains() {
    return this.http.get<Domain[]>(`${API_BASE_URL}/domains`);
  }

  createDomain(payload: DomainPayload) {
    return this.http.post<Domain>(`${API_BASE_URL}/domains`, payload);
  }

  updateDomain(id: string, payload: DomainPayload) {
    return this.http.put<Domain>(`${API_BASE_URL}/domains/${id}`, payload);
  }

  deleteDomain(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/domains/${id}`);
  }

  getPackages() {
    return this.http.get<AppPackage[]>(`${API_BASE_URL}/packages`);
  }

  getActivityLogs() {
    return this.http.get<ActivityLog[]>(`${API_BASE_URL}/activity-logs`);
  }

  getDashboardSummary() {
    return forkJoin({
      health: this.getHealth(),
      customers: this.getCustomers(),
      domains: this.getDomains(),
      packages: this.getPackages(),
      logs: this.getActivityLogs()
    }).pipe(
      map(({ health, customers, domains, packages, logs }): DashboardSummary => ({
        health,
        counts: {
          customers: customers.length,
          domains: domains.length,
          packages: packages.length,
          logs: logs.length
        },
        customers: customers.slice(0, 5),
        domains: domains.slice(0, 5),
        packages: packages.slice(0, 4),
        logs: logs.slice(0, 6)
      }))
    );
  }

  getQuickLinks() {
    return of([
      'Create customer workspace',
      'Map subdomain to package',
      'Generate nginx config',
      'Queue backup or recreate job'
    ]);
  }
}
