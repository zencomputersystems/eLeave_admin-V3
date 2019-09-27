import { Component, OnInit } from '@angular/core';

/**
 * Leave header with router-outlet page 
 * @export
 * @class LeaveSetupComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-leave-setup',
    templateUrl: './leave-setup.component.html',
    styleUrls: ['./leave-setup.component.scss'],
})
export class LeaveSetupComponent implements OnInit {

    /**
     *Creates an instance of LeaveSetupComponent.
     * @memberof LeaveSetupComponent
     */
    constructor() { }

    ngOnInit() {
    }

}