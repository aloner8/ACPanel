import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, map, of } from 'rxjs';
import { ApiService, type DashboardSummary, type DashboardViewModel } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPageComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);
  private readonly fallback: DashboardViewModel = {
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
  };

  readonly vm = toSignal<DashboardViewModel | null>(
    combineLatest([
      this.api.getDashboardSummary(),
      this.api.getQuickLinks()
    ]).pipe(
      map(([summary, quickLinks]: [DashboardSummary, string[]]) => ({
        ...summary,
        quickLinks,
        error: ''
      })),
      catchError((): ReturnType<typeof of<DashboardViewModel>> =>
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
    { initialValue: null }
  );
  readonly data = computed(() => this.vm() ?? this.fallback);

  logout() {
    this.auth.logout();
  }
}
