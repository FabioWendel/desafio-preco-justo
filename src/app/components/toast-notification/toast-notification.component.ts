import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="fixed top-6 right-6 z-50">
      <div [ngClass]="getTypeClass()" class="px-4 py-2 rounded shadow text-white">
        {{ message }}
      </div>
    </div>
  `,
})
export class ToastNotificationComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'success';

  getTypeClass() {
    switch (this.type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-700';
    }
  }
}
