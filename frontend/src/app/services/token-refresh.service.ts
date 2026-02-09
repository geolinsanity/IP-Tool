import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService {
  private refreshThreshold = 5 * 60 * 1000; // Refresh when 5 minutes or less remain
  private lastRefreshTime = 0;
  private minRefreshInterval = 30 * 1000; // Prevent refresh attempts more than every 30 seconds
  private lastStatusCheckTime = 0;

  constructor(private api: ApiService) {}

  /**
   * Check if token is near expiration and refresh if needed
   */
  checkAndRefreshToken(): void {
    const now = Date.now();
    
    // Prevent excessive status checks (every 30 seconds max)
    if (now - this.lastStatusCheckTime < this.minRefreshInterval) {
      return;
    }

    this.lastStatusCheckTime = now;

    // Call backend to check token status (since httpOnly cookies can't be read from JS)
    this.api.checkTokenStatus().subscribe({
      next: (response: any) => {
        const expiresIn = response.expiresIn;
        
        // If token expires in less than 5 minutes AND hasn't been refreshed recently, refresh it
        if (expiresIn < this.refreshThreshold && expiresIn > 0) {
          const timeSinceLastRefresh = now - this.lastRefreshTime;
          if (timeSinceLastRefresh > this.minRefreshInterval) {
            this.refreshToken();
          }
        }
      },
      error: (error: any) => {
        // Token is invalid/expired
      }
    });
  }

  /**
   * Refresh the authentication token
   */
  private refreshToken(): void {
    this.lastRefreshTime = Date.now();
    
    this.api.refreshToken().subscribe({
      next: (response: any) => {
        // Token refreshed successfully
      },
      error: (error: any) => {
        console.error('Token refresh failed:', error);
      }
    });
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    return false;
  }
}
