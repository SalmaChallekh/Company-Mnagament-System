import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { ProjectManagementComponent } from './app/pages/project-management/project-management.component';
import { Crud } from './app/pages/crud/crud';
import { InvoiceListComponent } from './app/pages/invoice-list/invoice-list.component';
import { DepartmentListComponent } from './app/pages/department-list/department-list.component';
import { AttendanceCalendarComponent } from './app/pages/attendance-calendar/attendance-calendar.component';
import { PayrollListComponent } from './app/payroll-list/payroll-list.component';
import { LeaveRequestComponent } from './app/pages/leave-request/leave-request.component';
import { ReportsComponent } from './app/pages/reports/reports.component';
import { TasksComponent } from './app/pages/tasks/tasks.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'projects', component: ProjectManagementComponent },
            {path: 'tasks',component: TasksComponent},
            { path: 'employees', component: Crud },
            { path: 'invoices', component: InvoiceListComponent},
            { path: 'departments', component: DepartmentListComponent},
            { path: 'attendance', component: AttendanceCalendarComponent},
            {path: 'payroll',component: PayrollListComponent},
            {path: 'leave',component: LeaveRequestComponent},
            {path: 'reports',component: ReportsComponent},

        ]
    },

    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];

