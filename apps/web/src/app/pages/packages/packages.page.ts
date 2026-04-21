import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, type AppPackage, type AppPackagePayload } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-packages-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './packages.page.html',
  styleUrl: './packages.page.scss'
})
export class PackagesPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  readonly packages = signal<AppPackage[]>([]);
  readonly selectedPackageId = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly canDelete = computed(() => this.auth.user()?.role === 'ADMIN');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    category: [''],
    description: [''],
    version: ['1.0.0', [Validators.required]],
    dockerImage: [''],
    defaultPort: [''],
    installMode: ['docker-stack'],
    templatePath: [''],
    isActive: [true]
  });

  constructor() {
    this.loadPackages();
  }

  get isEditing() {
    return !!this.selectedPackageId();
  }

  loadPackages() {
    this.api.getPackages().subscribe({
      next: (packages: AppPackage[]) => this.packages.set(packages),
      error: () => this.errorMessage.set('Unable to load packages.')
    });
  }

  selectPackage(item: AppPackage) {
    this.selectedPackageId.set(item.id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.patchValue({
      name: item.name ?? '',
      slug: item.slug ?? '',
      category: item.category ?? '',
      description: item.description ?? '',
      version: item.version ?? '1.0.0',
      dockerImage: item.dockerImage ?? '',
      defaultPort: item.defaultPort?.toString() ?? '',
      installMode: item.installMode ?? 'docker-stack',
      templatePath: item.templatePath ?? '',
      isActive: item.isActive
    });
  }

  resetForm() {
    this.selectedPackageId.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.reset({
      name: '',
      slug: '',
      category: '',
      description: '',
      version: '1.0.0',
      dockerImage: '',
      defaultPort: '',
      installMode: 'docker-stack',
      templatePath: '',
      isActive: true
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.toPayload();
    const selectedId = this.selectedPackageId();
    const request$ = selectedId
      ? this.api.updatePackage(selectedId, payload)
      : this.api.createPackage(payload);

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set(selectedId ? 'Package updated.' : 'Package created.');
          this.resetForm();
          this.loadPackages();
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage.set(error?.error?.message ?? 'Unable to save package.');
        }
      });
  }

  deletePackage(item: AppPackage) {
    if (!this.canDelete()) {
      this.errorMessage.set('Only admin users can delete packages.');
      return;
    }

    if (!confirm(`Delete package "${item.name}"?`)) {
      return;
    }

    this.api.deletePackage(item.id).subscribe({
      next: () => {
        this.successMessage.set('Package deleted.');
        if (this.selectedPackageId() === item.id) {
          this.resetForm();
        }
        this.loadPackages();
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(error?.error?.message ?? 'Unable to delete package.');
      }
    });
  }

  private toPayload(): AppPackagePayload {
    const value = this.form.getRawValue();

    return {
      name: value.name,
      slug: value.slug,
      category: value.category || null,
      description: value.description || null,
      version: value.version,
      dockerImage: value.dockerImage || null,
      defaultPort: value.defaultPort ? Number(value.defaultPort) : null,
      installMode: value.installMode || null,
      templatePath: value.templatePath || null,
      envSchema: undefined,
      isActive: value.isActive
    };
  }
}
