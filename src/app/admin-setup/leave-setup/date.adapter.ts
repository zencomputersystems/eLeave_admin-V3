import { NativeDateAdapter } from "@angular/material";

/**
 * Date format configuration
 * @export
 * @class AppDateAdapter
 * @extends {NativeDateAdapter}
 */
export class AppDateAdapter extends NativeDateAdapter {

    /**
     * parse date string to number
     * @param {*} value
     * @returns {(Date | null)}
     * @memberof AppDateAdapter
     */
    parse(value: any): Date | null {
        if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
            const str = value.split('/');
            const year = Number(str[2]);
            const month = Number(str[1]) - 1;
            const date = Number(str[0]);
            return new Date(year, month, date);
        }
        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? null : new Date(timestamp);
    }

    /**
     * date format to display in date input
     * @param {Date} date
     * @param {string} displayFormat
     * @returns {string}
     * @memberof AppDateAdapter
     */
    format(date: Date, displayFormat: string): string {
        if (displayFormat == "input") {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
        } else if (displayFormat == "inputMonth") {
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return date.toLocaleString('en-us', { month: "short" }) + ' ' + year;
        } else {
            return date.toDateString();
        }
    }

    /**
     * two digit allow in day and month format
     * @private
     * @param {number} n
     * @returns
     * @memberof AppDateAdapter
     */
    private _to2digit(n: number) {
        return ('00' + n).slice(-2);
    }
}

/**
 * display date format for angular datepicker
 * @export
 * @constant APP_DATE_FORMATS
 */
export const APP_DATE_FORMATS =
{
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
    },
    display: {
        dateInput: 'input',
        monthYearLabel: 'inputMonth',
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
    }
}