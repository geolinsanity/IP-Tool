import { inject } from "@angular/core";
import { ApiService } from "../services/api.service";
import { CanActivateFn, Router } from "@angular/router";
import { catchError, map, of } from "rxjs";

export const authGuard: CanActivateFn = () => {
    const api = inject(ApiService);
    const router = inject(Router);

    return api.getUser().pipe(
        map(() => true),
        catchError(() => {
            router.navigate(['/login']);
            return of(false)
        })
    )
}