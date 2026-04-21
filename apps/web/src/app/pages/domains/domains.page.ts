import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-domains-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './domains.page.html',
  styleUrl: './domains.page.scss'
})
export class DomainsPageComponent {
  private readonly api = inject(ApiService);

  readonly domains = toSignal(
    this.api.getDomains().pipe(catchError(() => of([]))),
    { initialValue: [] }
  );
}
