import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { DialogService } from '../../shared/dialog.service';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { EvaluationFormComponent } from '../../pages/evaluation/evaluation-form/evaluation-form.component';
import { ClientlistComponent } from '../../pages/clientlist/clientlist.component';
import { CrmDashboardComponent } from '../../pages/crm-dashboard/crm-dashboard.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule,
        AppMenuitem,
        RouterModule,
        DialogModule,
        MenubarModule,
        EvaluationFormComponent],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul>

    <p-dialog
      header="Create Evaluation"
      [(visible)]="showEvaluationDialog"
      [modal]="true"
      [closable]="true"
      [style]="{ width: '50vw' }"
      (onHide)="closeDialog()"
    >
      <app-evaluation-form></app-evaluation-form>
    </p-dialog>`
})
export class AppMenu {
    model: MenuItem[] = [];
    constructor(private dialogService: DialogService) { }

    showEvaluationDialog = false;
    openDialog() {
        console.log('Opening Evaluation Dialog');
        this.showEvaluationDialog = true;
    }

    closeDialog() {
        this.showEvaluationDialog = false;
    }
    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            // {
            //     label: 'Insights',
            //     items: [
            //         // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            //         // { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            //         // { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/uikit/button'] },
            //         // { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            //         // { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            //         // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            //         // { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            //         // { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            //         // { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            //         // { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
            //         // { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            //         // { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            //         // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            //         // { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
            //         // { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
            //     ]
            // },
            {
                label: 'Team',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-users',
                        routerLink: ['/employees'],
                    },
                    {
                        label: 'Projects',
                        icon: 'pi pi-folder',
                        routerLink: ['/projects'],
                    },
                    {
                        label: 'Tasks',
                        icon: 'pi pi-check-square',
                        routerLink: ['/tasks']
                    },
                    {
                                label: 'Departments',
                                icon: 'pi pi-sitemap',
                                routerLink: ['/departments']
                            },
                            {
                                label: 'Reports',
                                icon: 'pi pi-chart-bar',
                                routerLink: ['/reports']
                            },
                    // {
                    //     label: 'Admin',
                    //     icon: 'pi pi-shield',
                    //     items: [
                    //
                    //     ]
                    // },
                    {
                                label: 'Attendance',
                                icon: 'pi pi-calendar-check',
                                routerLink: ['/attendance']
                            },
                            {
                                label: 'Leave Requests',
                                icon: 'pi pi-calendar-times',
                                routerLink: ['/leave']
                            },
                    // {
                    //     label: 'HR',
                    //     icon: 'pi pi-id-card',
                    //     items: [

                    //     ]
                    // },
                    {
                                label: 'Invoices',
                                icon: 'pi pi-file',
                                routerLink: ['/invoices']
                            },
                            {
                                label: 'Payroll',
                                icon: 'pi pi-wallet',
                                routerLink: ['/payroll']
                            },
                            {
                                label: 'Clients',
                                icon: 'pi pi-list',
                                routerLink: ['/clients']
                            },
                            {
                                label: 'Vendors',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/vendors']
                            },
                    // {
                    //     label: 'Finance',
                    //     icon: 'pi pi-money-bill',
                    //     items: [

                    //     ]
                    // },
                    // {
                    //     label: 'Crm',
                    //     items: [
                    //         {
                    //             label: 'Dashboard',
                    //             icon: 'pi pi-file',
                    //             routerLink: ['/crm-dashboard']
                    //         },
                    //     ]
                    // },

                ]
            },
            {
                label: 'Evaluation',
                items: [{
                    label: 'Create Evaluation',
                    icon: 'pi pi-star',
                    command: () => this.openDialog()
                }]
            },

            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2',
            //             icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2',
            //                     icon: 'pi pi-fw pi-bookmark',
            //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
            //                 }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation',
            //             icon: 'pi pi-fw pi-book',
            //             routerLink: ['/documentation']
            //         },
            //         {
            //             label: 'View Source',
            //             icon: 'pi pi-fw pi-github',
            //             url: 'https://github.com/primefaces/sakai-ng',
            //             target: '_blank'
            //         }
            //     ]
            // }
        ];
    }
}
