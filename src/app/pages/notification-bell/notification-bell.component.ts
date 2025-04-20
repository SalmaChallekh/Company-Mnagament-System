import { Component } from '@angular/core';

@Component({
  selector: 'app-notification-bell',
  imports: [],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss',
  template: `
        <p-overlayPanel #op>
            <div class="notification-panel">
                <div *ngFor="let notification of notifications"
                     class="notification-item">
                    <div class="notification-icon">
                        <i [ngClass]="getNotificationIcon(notification.type)"></i>
                    </div>
                    <div class="notification-content">
                        <h6>{{notification.title}}</h6>
                        <p>{{notification.message}}</p>
                        <small>{{notification.time | timeAgo}}</small>
                    </div>
                </div>
            </div>
        </p-overlayPanel>

        <button pButton type="button" icon="pi pi-bell"
               (click)="op.toggle($event)"
               [badge]="unreadCount" badgeClass="p-badge-danger"></button>
    `,
    styles: [`
        .notification-panel {
            width: 350px;
        }
        .notification-item {
            display: flex;
            padding: 0.5rem;
            border-bottom: 1px solid var(--surface-border);
        }
        .notification-icon {
            font-size: 1.5rem;
            margin-right: 1rem;
            color: var(--primary-color);
        }
    `]
})
export class NotificationBellComponent {

}
