import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/shared-service/auth.service';

@Injectable()
export class RoleGuard implements CanActivate {

  /**
   *Creates an instance of RoleGuard.
   * @param {AuthService} _authService
   * @param {Router} _router
   * @memberof RoleGuard
   */
  constructor(private _authService: AuthService, private _router: Router) {
  }

  /**
   * check role activate
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof RoleGuard
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = this._authService.decode();

    if (user.Role === next.data.role) {
      return true;
    }

    // navigate to not found page
    this._router.navigate(['/404']);
    return false;
  }

}