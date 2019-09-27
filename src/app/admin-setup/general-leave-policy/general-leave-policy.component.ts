import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";

/**
 * main page of General Leave Policy Page 
 * @export
 * @class GeneralLeavePolicyComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-general-leave-policy',
    templateUrl: './general-leave-policy.component.html',
    styleUrls: ['./general-leave-policy.component.scss'],
})
export class GeneralLeavePolicyComponent implements OnInit {

    /**
     *Creates an instance of GeneralLeavePolicyComponent.
     * @param {Router} router
     * @memberof GeneralLeavePolicyComponent
     */
    constructor(private router: Router) { }

    ngOnInit() { }
}