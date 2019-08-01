import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-general-leave-policy',
    templateUrl: './general-leave-policy.page.html',
    styleUrls: ['./general-leave-policy.page.scss'],
})
export class GeneralLeavePolicyPage implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() { }
}