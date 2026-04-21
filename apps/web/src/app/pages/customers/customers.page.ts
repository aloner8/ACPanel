import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.page.html',
  styleUrl: './customers.page.scss'
})
export class CustomersPageComponent {
  private readonly api = inject(ApiService);

  readonly customers = toSignal(
    this.api.getCustomers().pipe(catchError(() => of([]))),
    { initialValue: [] }
  );
}
