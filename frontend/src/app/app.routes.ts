import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuditDashboardComponent } from './audit-dashboard/audit-dashboard.component';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { authGuard } from './auth/auth.guard';
import { AuditLogComponent } from './audit-log/audit-log.component';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: NavComponent,
        canActivate: [authGuard],
        children: [
            { path: 'main', component: MainComponent },
            { path: 'audit', component: AuditLogComponent },
            { path: 'dashboard', component: AuditDashboardComponent },
            { path: 'user-manager', component: AuditLogComponent }
        ]
    }
];
