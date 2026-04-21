import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, type Customer, type Domain, type DomainPayload } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-domains-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './domains.page.html',
  styleUrl: './domains.page.scss'
})
export class DomainsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  readonly domains = signal<Domain[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly selectedDomainId = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly canDelete = computed(() => this.auth.user()?.role === 'ADMIN');

  readonly form = this.fb.nonNullable.group({
    customerId: ['', [Validators.required]],
    rootDomain: ['', [Validators.required]],
    subdomain: [''],
    dnsProvider: ['BIND9'],
    bindZoneName: [''],
    nginxServerName: [''],
    sslStatus: ['pending'],
    isPrimary: [false]
  });

  constructor() {
    this.loadCustomers();
    this.loadDomains();
  }

  get isEditing() {
    return !!this.selectedDomainId();
  }

  loadCustomers() {
    this.api.getCustomers().subscribe({
      next: (customers: Customer[]) => this.customers.set(customers),
      error: () => this.errorMessage.set('Unable to load customers for domain mapping.')
    });
  }

  loadDomains() {
    this.api.getDomains().subscribe({
      next: (domains: Domain[]) => this.domains.set(domains),
      error: () => this.errorMessage.set('Unable to load domains.')
    });
  }

  selectDomain(domain: Domain) {
    this.selectedDomainId.set(domain.id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.patchValue({
      customerId: domain.customer?.id || domain.customerId || '',
      rootDomain: domain.rootDomain || '',
      subdomain: domain.subdomain || '',
      dnsProvider: 'BIND9',
      bindZoneName: domain.rootDomain || '',
      nginxServerName: domain.fqdn || '',
      sslStatus: domain.sslStatus || 'pending',
      isPrimary: false
    });
  }

  resetForm() {
    this.selectedDomainId.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.reset({
      customerId: '',
      rootDomain: '',
      subdomain: '',
      dnsProvider: 'BIND9',
      bindZoneName: '',
      nginxServerName: '',
      sslStatus: 'pending',
      isPrimary: false
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.toPayload();
    const selectedId = this.selectedDomainId();
    const request$ = selectedId
      ? this.api.updateDomain(selectedId, payload)
      : this.api.createDomain(payload);

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set(selectedId ? 'Domain updated.' : 'Domain created.');
          this.resetForm();
          this.loadDomains();
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage.set(error?.error?.message ?? 'Unable to save domain.');
        }
      });
  }

  deleteDomain(domain: Domain) {
    if (!this.canDelete()) {
      this.errorMessage.set('Only admin users can delete domains.');
      return;
    }

    if (!confirm(`Delete domain "${domain.fqdn}"?`)) {
      return;
    }

    this.api.deleteDomain(domain.id).subscribe({
      next: () => {
        this.successMessage.set('Domain deleted.');
        if (this.selectedDomainId() === domain.id) {
          this.resetForm();
        }
        this.loadDomains();
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(error?.error?.message ?? 'Unable to delete domain.');
      }
    });
  }

  private toPayload(): DomainPayload {
    const value = this.form.getRawValue();

    return {
      customerId: value.customerId,
      rootDomain: value.rootDomain,
      subdomain: value.subdomain || null,
      dnsProvider: value.dnsProvider || null,
      bindZoneName: value.bindZoneName || null,
      nginxServerName: value.nginxServerName || null,
      sslStatus: value.sslStatus || null,
      isPrimary: value.isPrimary
    };
  }
}
