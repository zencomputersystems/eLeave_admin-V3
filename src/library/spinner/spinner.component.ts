import { Component, Input, OnInit } from '@angular/core';
/**
 * Spinner Component
 * @export
 * @class SpinnerComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

    /**
     * Input property for width
     * @memberof SpinnerComponent
     */
    @Input() width = '40';

    /**
     * Input property for height
     * @memberof SpinnerComponent
     */
    @Input() height = '100';

    /**
     * Input property for spinner style name
     * @memberof SpinnerComponent
     */
    @Input() name = 'lines';

    /**
     * Input property for color
     * @memberof SpinnerComponent
     */
    @Input() color = 'primary';

    /**
     *Creates an instance of SpinnerComponent.
     * @memberof SpinnerComponent
     */
    constructor() { }

    /**
     * initial method
     * @memberof SpinnerComponent
     */
    ngOnInit() {

    }
}