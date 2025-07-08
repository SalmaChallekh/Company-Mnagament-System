import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { DashboardsComponent } from './app/pages/dashboards/dashboards.component';
import { AttendanceCalendarComponent } from './app/pages/attendance-calendar/attendance-calendar.component';
import { UserManagementComponent } from './app/pages/crud/crud';
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
import { KanbanComponent } from './app/pages/kanban/kanban.component';
import { CompleteRegistrationComponent } from './app/complete-registration/complete-registration.component';
import { ProfileComponent } from './app/pages/profile/profile.component';
import { GanttComponent } from './app/pages/gantt/gantt.component';
import { WebcamCheckInComponent } from './app/webcam-check-in/webcam-check-in.component';
import { EvaluationFormComponent } from './app/pages/evaluation/evaluation-form/evaluation-form.component';
import { VendorListComponent } from './app/pages/vendorl-ist/vendorl-ist.component';
import { ClientlistComponent } from './app/pages/clientlist/clientlist.component';
import { CrmDashboardComponent } from './app/crm-dashboard/crm-dashboard.component';
import { PredictionComponent } from './app/pages/prediction/prediction.component';
import { PredictionDashboardComponent } from './app/pages/prediction-dashboard/prediction-dashboard.component';
import { AttendanceCheckinComponent } from './app/pages/attendance-checkin/attendance-checkin.component';

// Routes with Role-Based Access
export const appRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'complete-registration', component: CompleteRegistrationComponent },
    { path: 'crm-dashboard', component: CrmDashboardComponent },
    { path: 'prrediction', component: PredictionComponent },
    { path: 'prediction', component: PredictionDashboardComponent },
    { path: 'profile', component: ProfileComponent },
    {
        path: 'camera-checkin',
        loadComponent: () => import('./app/pages/attendance-checkin/attendance-checkin.component')
            .then(m => m.AttendanceCheckinComponent)
    },
    {
        path: 'create-evaluation',
        component: EvaluationFormComponent
    },

    // App Layout with nested routes
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'dashboard', component: DashboardsComponent, canActivate: [AuthGuard] },
            { path: 'clients', component: ClientlistComponent },
            { path: 'crm-dashboard', component: CrmDashboardComponent },
            { path: 'invoices', component: InvoiceListComponent },
            { path: 'vendors', component: VendorListComponent },

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
                component: UserManagementComponent,
                canActivate: [AuthGuard, RoleGuard],
                data: { role: 'ADMIN' } // Only accessible by Admins
            },
            { path: 'invoices', component: InvoiceListComponent, canActivate: [AuthGuard] },
            // { path: 'clients', component: InvoiceListComponent, canActivate: [AuthGuard] },
            // { path: 'vendors', component: InvoiceListComponent, canActivate: [AuthGuard] },
            { path: 'departments', component: DepartmentListComponent, canActivate: [AuthGuard] },
            { path: 'attendance', component: AttendanceCalendarComponent, canActivate: [AuthGuard] },
            { path: 'payroll', component: PayrollListComponent, canActivate: [AuthGuard] },
            { path: 'leave', component: LeaveRequestComponent, canActivate: [AuthGuard] },
            { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
            { path: 'kanban', component: KanbanComponent },
            { path: 'gantt', component: GanttComponent, canActivate: [AuthGuard] },
        ]
    },

    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
    { path: 'auth/access', component: Access },
    {
        path: 'complete-registration', component: CompleteRegistrationComponent
    }

];
