import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/catch';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

/**
 * authenticate service
 * @export
 * @class AuthService
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    /**
     * main url of server
     * @type {string}
     * @memberof AuthService
     */
    public baseUrl: string = environment.API_URL;

    /**
     * auth for login only
     * @type {string}
     * @memberof AuthService
     */
    public authUrl: string = environment.AUTH_URL;

    /**
     *Creates an instance of AuthService.
     * @param {SessionStorageService} session session storage
     * @param {LocalStorageService} local
     * @param {HttpClient} httpClient
     * @memberof AuthService
     */
    constructor(public session: SessionStorageService, private local: LocalStorageService, private httpClient: HttpClient) { }

    /**
     * this is used to clear anything that needs to be removed
     */
    clear(): void {
        this.local.clear();
    }

    /**
     * check for expiration and if token is still existing or not
     * @return {boolean}
     */
    isAuthenticated(): boolean {
        return this.local.get('access_token') != null && !this.isTokenExpired();
    }

    // simulate jwt token is valid
    // https://github.com/theo4u/angular4-auth/blob/master/src/app/helpers/jwt-helper.ts
    /**
     * return false if token is expired
     * @returns {boolean}
     * @memberof AuthService
     */
    isTokenExpired(): boolean {
        return false;
    }

    /**
     * login to post to endpoint
     * @param {string} email
     * @param {string} password
     * @returns
     * @memberof AuthService
     */
    login(email: string, password: string) {
        return this.httpClient.post<any>(this.authUrl + `/api/auth/login`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.local.set('access_token', JSON.stringify(user.access_token));
                    this.isAuthenticated();
                    setTimeout(() => {
                        this.isTokenExpired();
                        this.isAuthenticated();
                        this.logout();
                    }, user.expires_in * 1000);
                }
                return user;
            }, catchError(error => { return throwError(error) }))
            );
    }

    /**
     * return access token or vice versa
     * @readonly
     * @type {boolean}
     * @memberof AuthService
     */
    public get loggedIn(): boolean {
        return (this.local.get('access_token') !== null);
    }

    /**
     * this is used to clear local storage and also the route to login
     */
    logout(): void {
        this.local.remove('access_token');
    }
}