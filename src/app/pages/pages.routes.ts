import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
//import { CreateUserComponent } from './admin/create-user/create-user.component';
import { Empty } from './empty/empty';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { DepartmentListComponent } from './department-list/department-list.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    //{ path: 'create-user', component: CreateUserComponent },
    {path: 'projects',component: ProjectManagementComponent,data: { breadcrumb: 'Projects' }},
    {path: 'employees',component: ProjectManagementComponent,data: { breadcrumb: 'Employees' }},
    {path: 'invoices',component: InvoiceListComponent,data: { breadcrumb: 'Invoices' }},
    {path: 'departments',component: DepartmentListComponent,data: { breadcrumb: 'Departments' }},
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
