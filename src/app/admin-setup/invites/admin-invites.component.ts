import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
/**
 * Admin Invites Page
 * @export
 * @class AdminInvitesComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-admin-invites',
    templateUrl: './admin-invites.component.html',
    styleUrls: ['./admin-invites.component.scss'],
})
export class AdminInvitesComponent implements OnInit {

    /**
     *Creates an instance of AdminInvitesComponent.
     * @param {Router} router
     * @memberof AdminInvitesComponent
     */
    constructor(public router: Router) { }

    ngOnInit() {
    }

}
