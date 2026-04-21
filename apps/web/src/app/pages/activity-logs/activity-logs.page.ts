import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ApiService, type ActivityLog } from '../../core/api/api.service';

@Component({
  selector: 'app-activity-logs-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './activity-logs.page.html',
  styleUrl: './activity-logs.page.scss'
})
export class ActivityLogsPageComponent {
  private readonly api = inject(ApiService);
  readonly logs = signal<ActivityLog[]>([]);

  constructor() {
    this.api.getActivityLogs().subscribe({
      next: (logs: ActivityLog[]) => this.logs.set(logs)
    });
  }
}
