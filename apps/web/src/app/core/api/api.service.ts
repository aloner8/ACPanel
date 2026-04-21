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
  description?: string | null;
  version: string;
  category?: string | null;
  dockerImage?: string | null;
  defaultPort?: number | null;
  installMode?: string | null;
  templatePath?: string | null;
  envSchema?: Record<string, unknown>;
  isActive: boolean;
}

export interface AppPackagePayload {
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  version: string;
  dockerImage?: string | null;
  defaultPort?: number | null;
  installMode?: string | null;
  templatePath?: string | null;
  envSchema?: Record<string, unknown>;
  isActive: boolean;
}

export interface DeploymentScript {
  id: string;
  scriptType: string;
  scriptName: string;
  scriptPath: string;
  runtime?: string | null;
  version?: string | null;
  appPackage?: AppPackage | null;
}

export interface DeploymentJob {
  id: string;
  jobType: string;
  status: string;
  resultSummary?: string | null;
  createdAt: string;
  customer?: Customer | null;
  domain?: Domain | null;
  script?: DeploymentScript | null;
  requestedBy?: {
    id: string;
    email: string;
    displayName: string;
    role: string;
  } | null;
}

export interface DeploymentPayload {
  customerId: string;
  domainId: string;
  appPackageId: string;
  jobType: string;
  scriptType: string;
  requestedVersion?: string | null;
  runtime?: string | null;
  envConfig?: Record<string, unknown>;
  notes?: string | null;
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

export interface DashboardViewModel extends DashboardSummary {
  quickLinks: string[];
  error: string;
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

  createPackage(payload: AppPackagePayload) {
    return this.http.post<AppPackage>(`${API_BASE_URL}/packages`, payload);
  }

  updatePackage(id: string, payload: AppPackagePayload) {
    return this.http.put<AppPackage>(`${API_BASE_URL}/packages/${id}`, payload);
  }

  deletePackage(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/packages/${id}`);
  }

  getDeployments() {
    return this.http.get<DeploymentJob[]>(`${API_BASE_URL}/deployments`);
  }

  createDeployment(payload: DeploymentPayload) {
    return this.http.post<DeploymentJob>(`${API_BASE_URL}/deployments`, payload);
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
      map((result: {
        health: HealthStatus;
        customers: Customer[];
        domains: Domain[];
        packages: AppPackage[];
        logs: ActivityLog[];
      }): DashboardSummary => ({
        health: result.health,
        counts: {
          customers: result.customers.length,
          domains: result.domains.length,
          packages: result.packages.length,
          logs: result.logs.length
        },
        customers: result.customers.slice(0, 5),
        domains: result.domains.slice(0, 5),
        packages: result.packages.slice(0, 4),
        logs: result.logs.slice(0, 6)
      }))
    );
  }

  getQuickLinks() {
    return of<string[]>([
      'Create customer workspace',
      'Map subdomain to package',
      'Generate nginx config',
      'Queue backup or recreate job'
    ]);
  }
}
