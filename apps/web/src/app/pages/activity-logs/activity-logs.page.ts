import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-activity-logs-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './activity-logs.page.html',
  styleUrl: './activity-logs.page.scss'
})
export class ActivityLogsPageComponent {
  private readonly api = inject(ApiService);

  readonly logs = toSignal(
    this.api.getActivityLogs().pipe(catchError(() => of([]))),
    { initialValue: [] }
  );
}
