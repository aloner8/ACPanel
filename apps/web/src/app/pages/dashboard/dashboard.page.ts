import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, map, of } from 'rxjs';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPageComponent {
  private readonly api = inject(ApiService);

  readonly vm = toSignal(
    combineLatest([
      this.api.getDashboardSummary(),
      this.api.getQuickLinks()
    ]).pipe(
      map(([summary, quickLinks]) => ({
        ...summary,
        quickLinks,
        error: ''
      })),
      catchError(() =>
        of({
          health: {
            status: 'offline',
            database: 'disconnected',
            service: 'acpanel-api'
          },
          counts: {
            customers: 0,
            domains: 0,
            packages: 0,
            logs: 0
          },
          customers: [],
          domains: [],
          packages: [],
          logs: [],
          quickLinks: [],
          error: 'API is not reachable yet. Start the backend to see live dashboard data.'
        })
      )
    ),
    {
      initialValue: {
        health: {
          status: 'loading',
          database: 'connecting',
          service: 'acpanel-api'
        },
        counts: {
          customers: 0,
          domains: 0,
          packages: 0,
          logs: 0
        },
        customers: [],
        domains: [],
        packages: [],
        logs: [],
        quickLinks: [],
        error: ''
      }
    }
  );
}
