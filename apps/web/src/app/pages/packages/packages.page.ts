import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-packages-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packages.page.html',
  styleUrl: './packages.page.scss'
})
export class PackagesPageComponent {
  private readonly api = inject(ApiService);

  readonly packages = toSignal(
    this.api.getPackages().pipe(catchError(() => of([]))),
    { initialValue: [] }
  );
}
