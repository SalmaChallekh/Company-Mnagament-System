import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../pages/service/auth.service';
@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">

                <img src="./assets/layout/images/strategya log.jpg" alt="Strategya2AI Logo" width="40" />
                <span>Strategya2Ai</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

<!-- Sakai-style Icon Button -->
<div class="relative group">
  <button
    class="flex items-center justify-center h-10 w-10 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-shadow shadow-md"
    [routerLink]="['/camera-checkin']"
  >
    📷
  </button>
</div>
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <div class="relative">
    <button class="layout-topbar-action flex align-items-center gap-2" (click)="toggleProfileDropdown()">
        <i class="pi pi-user "></i>
        <span class="hidden md:inline">{{ user.username }}</span>

    </button>

    <div
        class="profile-dropdown absolute right-0 mt-2 w-64 p-3 shadow-lg border-round bg-white z-5"
        *ngIf="showProfileDropdown"
    >
        <!-- Header -->
        <div class="flex align-items-center gap-2 mb-3 border-bottom pb-2">
            <div>
                <div class="font-bold">{{ user.username }}</div>
                <small class="text-sm text-gray-500">{{ user.role }}</small>
            </div>
        </div>
        <!-- Menu Items -->
        <div class="flex flex-column gap-2 text-sm">
            <a routerLink="/profile" class="flex align-items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
        <i class="pi pi-user"></i> Profile
    </a>
            <a routerLink="/settings" class="flex align-items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                <i class="pi pi-cog"></i> Settings
            </a>

            <a (click)="logout()" class="flex align-items-center gap-2 cursor-pointer p-1 hover:bg-red-50 rounded text-red-600">
                <i class="pi pi-sign-out"></i> Logout
            </a>
        </div>
    </div>
</div>



                </div>
            </div>
        </div>
    </div>`,
    styles: [`
        .profile-dropdown {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            width: 260px;
            z-index: 100;
        }

        .profile-dropdown a {
            transition: background-color 0.2s ease-in-out;
        }

        .profile-dropdown a:hover {
            background-color: #f5f5f5;
        }

        .profile-dropdown .text-red-600 {
            color: #ef4444;
        }

        .profile-dropdown .hover\\:bg-red-50:hover {
            background-color: #fef2f2;
        }

        .profile-dropdown .cursor-pointer {
            cursor: pointer;
        }

        .rounded-full {
            border-radius: 9999px;
        }

        .font-bold {
            font-weight: 600;
        }

        .text-sm {
            font-size: 0.875rem;
        }

        .text-gray-500 {
            color: #6b7280;
        }

        .text-blue-500 {
            color: #3b82f6;
        }

        .border-bottom {
            border-bottom: 1px solid #e5e7eb;
        }

        .border-blue-500 {
            border-color: #3b82f6;
        }

        .border-bottom-2 {
            border-bottom-width: 2px;
        }

        .p-1 {
            padding: 0.25rem;
        }

        .p-3 {
            padding: 0.75rem;
        }

        .gap-2 {
            gap: 0.5rem;
        }

        .gap-3 {
            gap: 0.75rem;
        }

        .flex {
            display: flex;
        }

        .flex-column {
            flex-direction: column;
        }

        .align-items-center {
            align-items: center;
        }

        .justify-between {
            justify-content: space-between;
        }

        .ml-auto {
            margin-left: auto;
        }

        .w-64 {
            width: 16rem;
        }

        .mt-2 {
            margin-top: 0.5rem;
        }

        .absolute {
            position: absolute;
        }

        .right-0 {
            right: 0;
        }

        .z-5 {
            z-index: 5;
        }

        .shadow-lg {
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .bg-white {
            background-color: #fff;
        }
    `]
})
export class AppTopbar {
    items!: MenuItem[];

    user: any = {
        username: '',
        role: '',
        email:'',
        departmentId:0
    };

    showProfileDropdown = false;

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.authService.getCurrentUser().subscribe({
            next: (data) => {
                this.user.username = data.username;
                this.user.role = data.role;
                this.user.email=data.email;
                this.user.departmentId=data.departmentId
            },
            error: (err) => {
                console.error('Failed to load user data:', err);
            }
        });
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    toggleProfileDropdown() {
        this.showProfileDropdown = !this.showProfileDropdown;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}

