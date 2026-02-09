import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenRefreshService } from './token-refresh.service';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  constructor(private tokenRefreshService: TokenRefreshService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token check for token-status and refresh endpoints to avoid infinite loops
    if (req.url.includes('/auth/token-status') || req.url.includes('/auth/refresh')) {
      return next.handle(req);
    }

    // Check and refresh token before each request
    this.tokenRefreshService.checkAndRefreshToken();

    return next.handle(req);
  }
}
