import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService, type Customer, type CustomerPayload } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';

const DEFAULT_CUSTOMER_TYPES = [
  'ส่วนราชการ',
  'ร้านค้า',
  'โรงพยาบาล',
  'อบต',
  'คลีนิค',
  'สถานศึกษา',
  'บุคคล',
  'ทั่วไป'
] as const;

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customers.page.html',
  styleUrl: './customers.page.scss'
})
export class CustomersPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  readonly customers = signal<Customer[]>([]);
  readonly selectedCustomerId = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly customerTypes = signal<string[]>([...DEFAULT_CUSTOMER_TYPES]);
  readonly canDelete = computed(() => this.auth.user()?.role === 'ADMIN');

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    customerType: [''],
    email: [''],
    phone: [''],
    companyName: [''],
    taxId: [''],
    addressLine1: [''],
    addressLine2: [''],
    district: [''],
    province: [''],
    postalCode: [''],
    country: ['Thailand']
  });

  constructor() {
    this.loadCustomers();
    this.loadCustomerTypes();
  }

  get isEditing() {
    return !!this.selectedCustomerId();
  }

  loadCustomers() {
    this.api.getCustomers().subscribe({
      next: (customers: Customer[]) => this.customers.set(customers),
      error: () => this.errorMessage.set('Unable to load customers.')
    });
  }

  loadCustomerTypes() {
    this.api.getRefValues('customer_type').subscribe({
      next: (values: string[]) => {
        if (values.length) {
          this.customerTypes.set(values);
        }
      },
      error: () => {
        this.customerTypes.set([...DEFAULT_CUSTOMER_TYPES]);
      }
    });
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomerId.set(customer.id);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.patchValue({
      code: customer.code ?? '',
      name: customer.name ?? '',
      customerType: customer.customerType ?? '',
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      companyName: customer.companyName ?? '',
      taxId: '',
      addressLine1: '',
      addressLine2: '',
      district: '',
      province: '',
      postalCode: '',
      country: 'Thailand'
    });
  }

  resetForm() {
    this.selectedCustomerId.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.reset({
      code: '',
      name: '',
      customerType: '',
      email: '',
      phone: '',
      companyName: '',
      taxId: '',
      addressLine1: '',
      addressLine2: '',
      district: '',
      province: '',
      postalCode: '',
      country: 'Thailand'
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.toPayload();
    const selectedId = this.selectedCustomerId();
    const request$ = selectedId
      ? this.api.updateCustomer(selectedId, payload)
      : this.api.createCustomer(payload);

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set(selectedId ? 'Customer updated.' : 'Customer created.');
          this.resetForm();
          this.loadCustomers();
        },
        error: (error: { error?: { message?: string } }) => {
          this.errorMessage.set(error?.error?.message ?? 'Unable to save customer.');
        }
      });
  }

  deleteCustomer(customer: Customer) {
    if (!this.canDelete()) {
      this.errorMessage.set('Only admin users can delete customers.');
      return;
    }

    if (!confirm(`Delete customer "${customer.name}"?`)) {
      return;
    }

    this.api.deleteCustomer(customer.id).subscribe({
      next: () => {
        this.successMessage.set('Customer deleted.');
        if (this.selectedCustomerId() === customer.id) {
          this.resetForm();
        }
        this.loadCustomers();
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage.set(error?.error?.message ?? 'Unable to delete customer.');
      }
    });
  }

  private toPayload(): CustomerPayload {
    const value = this.form.getRawValue();

    return {
      code: value.code,
      name: value.name,
      customerType: value.customerType || null,
      email: value.email || null,
      phone: value.phone || null,
      companyName: value.companyName || null,
      taxId: value.taxId || null,
      addressLine1: value.addressLine1 || null,
      addressLine2: value.addressLine2 || null,
      district: value.district || null,
      province: value.province || null,
      postalCode: value.postalCode || null,
      country: value.country || null
    };
  }
}
