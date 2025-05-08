import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { DashboardsComponent } from './app/pages/dashboards/dashboards.component';
import { AttendanceCalendarComponent } from './app/pages/attendance-calendar/attendance-calendar.component';
import { Crud } from './app/pages/crud/crud';
import { DepartmentListComponent } from './app/pages/department-list/department-list.component';
import { InvoiceListComponent } from './app/pages/invoice-list/invoice-list.component';
import { Landing } from './app/pages/landing/landing';
import { LeaveRequestComponent } from './app/pages/leave-request/leave-request.component';
import { Notfound } from './app/pages/notfound/notfound';
import { ProjectManagementComponent } from './app/pages/project-management/project-management.component';
import { ReportsComponent } from './app/pages/reports/reports.component';
import { TasksComponent } from './app/pages/tasks/tasks.component';
import { PayrollListComponent } from './app/payroll-list/payroll-list.component';
import { AuthGuard } from './app/guards/auth.guard';
import { RoleGuard } from './app/guards/role.guard';
import { Access } from './app/pages/auth/access';

// Routes with Role-Based Access
export const appRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    // App Layout with nested routes
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'dashboard', component: DashboardsComponent, canActivate: [AuthGuard] },

            // Role-Based Routes
            {
                path: 'projects',
                component: ProjectManagementComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'ADMIN' } // Only accessible by Admins
            },
            {
                path: 'tasks',
                component: TasksComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'ADMIN' }
            },
            {
                path: 'employees',
                component: Crud,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'ADMIN' } // Only accessible by Admins
            },
            { path: 'invoices', component: InvoiceListComponent, canActivate: [AuthGuard] },
            { path: 'departments', component: DepartmentListComponent, canActivate: [AuthGuard] },
            { path: 'attendance', component: AttendanceCalendarComponent, canActivate: [AuthGuard] },
            { path: 'payroll', component: PayrollListComponent, canActivate: [AuthGuard] },
            { path: 'leave', component: LeaveRequestComponent, canActivate: [AuthGuard] },
            { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] }
        ]
    },

    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
    { path: 'auth/access', component:Access  },
];
