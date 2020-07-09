import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../src/services/shared-service/auth.service';

/**
 * determine active route or vice versa
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable()
export class AuthGuard implements CanActivate {

  /**
   *Creates an instance of AuthGuard.
   * @param {AuthService} _authService
   * @param {Router} _router
   * @memberof AuthGuard
   */
  constructor(private _authService: AuthService, private _router: Router) {
  }

  /**
   * determine activate route
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof AuthGuard
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.isAuthenticated()) {
      return true;
    } else {
      // navigate to login page
      this._router.navigate(['/login']);
      // you can save redirect url so after authing we can move them back to the page they requested
      return false;
    }



  }

  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   if (localStorage.getItem('access_token')) {
  //     return true;
  //   }

  //   this._router.navigate(['/login']);
  //   return false;
  // }

}