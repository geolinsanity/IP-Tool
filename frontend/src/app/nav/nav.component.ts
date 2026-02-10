import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule}  from '@angular/material/list';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiService, UserModel } from '../services/api.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  user: UserModel = { userID: '', username: '', userRole: 1 };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getUser().subscribe({
      next: (res: UserModel) => {
        this.user = res;
      },
      error: (err) => {
        console.error('Unable to load user', err);
      }
    })
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        console.log('Logout successful');
      },
      error: (err) => {
        console.error('Logout failed');
      }
    })
  }
}
