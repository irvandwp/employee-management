import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './services/notification.service';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  notification$ = this.notificationService.notifications$;

  constructor(private notificationService: NotificationService) {}

  onClose(): void {
    this.notificationService.clear();
  }
}