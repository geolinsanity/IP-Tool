import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuditDashboardComponent } from './audit-dashboard/audit-dashboard.component';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: NavComponent,
        canActivate: [authGuard],
        children: [
            { path: 'home', component: MainComponent },
            { path: 'audit', component: AuditDashboardComponent }
        ]
    }
];
