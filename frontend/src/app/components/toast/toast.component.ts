import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      <div
        *ngFor="let toast of toasts"
        class="toast"
        [ngClass]="'toast--' + toast.type"
        role="alert"
      >
        <span class="toast__icon material-icons">{{ getIcon(toast.type) }}</span>
        <span class="toast__message">{{ toast.message }}</span>
        <button class="toast__close" (click)="dismiss(toast.id)" aria-label="Dismiss">
          <span class="material-icons">close</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toastService.toasts$.subscribe(t => this.toasts = t);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type] || 'info';
  }
}
