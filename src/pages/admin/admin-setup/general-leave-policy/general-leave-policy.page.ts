import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";

/**
 * main page of General Leave Policy Page 
 * @export
 * @class GeneralLeavePolicyPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-general-leave-policy',
    templateUrl: './general-leave-policy.page.html',
    styleUrls: ['./general-leave-policy.page.scss'],
})
export class GeneralLeavePolicyPage implements OnInit {

    /**
     *Creates an instance of GeneralLeavePolicyPage.
     * @param {Router} router
     * @memberof GeneralLeavePolicyPage
     */
    constructor(private router: Router) { }

    ngOnInit() { }
}