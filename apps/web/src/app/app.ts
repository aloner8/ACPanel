import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly auth = inject(AuthService);
  readonly isSidebarCollapsed = signal(false);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.auth.initialized() || this.auth.isAuthenticated()) {
        return;
      }

      if (!this.router.url.startsWith('/login')) {
        void this.router.navigateByUrl('/login');
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed.update((collapsed) => !collapsed);
  }
}
