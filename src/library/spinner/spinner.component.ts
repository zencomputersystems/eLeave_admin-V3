import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

    @Input() width = '40';
    @Input() height = '100';
    @Input() name = 'lines';
    @Input() color = 'primary';

    constructor() { }

    ngOnInit() {

    }
}