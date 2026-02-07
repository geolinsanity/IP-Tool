import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule}  from '@angular/material/list';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  user: string = 'User';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getUser().subscribe({
      next: (res: any) => {
        this.user = res.username;
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
