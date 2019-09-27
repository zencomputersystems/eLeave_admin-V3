import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/**
 * Admin Invites Page
 * @export
 * @class AdminInvitesPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-admin-invites',
    templateUrl: './admin-invites.component.html',
    styleUrls: ['./admin-invites.component.scss'],
})
export class AdminInvitesPage implements OnInit {

    /**
     *Creates an instance of AdminInvitesPage.
     * @param {Router} router
     * @memberof AdminInvitesPage
     */
    constructor(public router: Router) { }

    ngOnInit() {
    }

}
