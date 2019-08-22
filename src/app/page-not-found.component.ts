import { Component } from '@angular/core';
/**
 * Page Not Found Component
 * @export
 * @class PageNotFoundComponent
 */
@Component({
    selector: 'page-not-found',
    template: `<h2 style="z-index:2"> &nbsp; OOPS! PAGE NOT FOUND</h2><br>
    <img src="assets/icon/404.jpg" style="width: 50%;
    position: absolute;margin-left: 22%;">`,
    styles: [":host{color: #7a8589;top: 48px}"]
})
export class PageNotFoundComponent { }


