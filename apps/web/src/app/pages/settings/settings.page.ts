import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss'
})
export class SettingsPageComponent {
  readonly items = [
    {
      title: 'Primary API URL',
      value: '/api via Angular proxy to localhost:3000'
    },
    {
      title: 'Primary domain',
      value: 'alonersoft.com'
    },
    {
      title: 'VPS endpoint',
      value: '194.233.84.216'
    }
  ];
}
