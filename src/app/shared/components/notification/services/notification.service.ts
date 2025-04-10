import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning';

export interface Notification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notifications$ = this.notificationSubject.asObservable();

  show(message: string, type: NotificationType = 'success'): void {
    this.notificationSubject.next({ message, type });
    setTimeout(() => this.clear(), 3000);
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}