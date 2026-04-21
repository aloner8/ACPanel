import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  ApiService,
  type AppPackage,
  type Customer,
  type DeploymentJob,
  type DeploymentPayload,
  type Domain
} from '../../core/api/api.service';

@Component({
  selector: 'app-deployments-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './deployments.page.html',
  styleUrl: './deployments.page.scss'
})
export class DeploymentsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);

  readonly customers = signal<Customer[]>([]);
  readonly domains = signal<Domain[]>([]);
  readonly packages = signal<AppPackage[]>([]);
  readonly jobs = signal<DeploymentJob[]>([]);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly filteredDomains = computed(() => {
    const customerId = this.form.controls.customerId.value;

    return this.domains().filter((domain) => !customerId || domain.customer?.id === customerId || domain.customerId === customerId);
  });

  readonly form = this.fb.nonNullable.group({
    customerId: ['', [Validators.required]],
    domainId: ['', [Validators.required]],
    appPackageId: ['', [Validators.required]],
    jobType: ['deploy', [Validators.required]],
    scriptType: ['docker-stack', [Validators.required]],
    requestedVersion: [''],
    runtime: ['docker-stack'],
    notes: ['']
  });

  constructor() {
    this.loadAll();
  }

  loadAll() {
    this.api.getCustomers().subscribe({
      next: (customers: Customer[]) => this.customers.set(customers)
    });

    this.api.getDomains().subscribe({
      next: (domains: Domain[]) => this.domains.set(domains)
    });

    this.api.getPackages().subscribe({
      next: (packages: AppPackage[]) => this.packages.set(packages.filter((item: AppPackage) => item.isActive))
    });

    this.api.getDeployments().subscribe({
      next: (jobs: DeploymentJob[]) => this.jobs.set(jobs),
      error: () => this.errorMessage.set('Unable to load deployment jobs.')
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.toPayload();

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.api.createDeployment(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Deployment job queued.');
          this.form.patchValue({
            domainId: '',
            appPackageId: '',
            requestedVersion: '',
            notes: ''
          });
          this.loadAll();
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage.set(error?.error?.message ?? 'Unable to queue deployment.');
        }
      });
  }

  private toPayload(): DeploymentPayload {
    const value = this.form.getRawValue();

    return {
      customerId: value.customerId,
      domainId: value.domainId,
      appPackageId: value.appPackageId,
      jobType: value.jobType,
      scriptType: value.scriptType,
      requestedVersion: value.requestedVersion || null,
      runtime: value.runtime || null,
      notes: value.notes || null
    };
  }
}
