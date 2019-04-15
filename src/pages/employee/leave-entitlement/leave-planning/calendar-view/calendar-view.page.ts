export interface Holidays {
    day: string;
    start: string;
    end: string;
    title: string;
}

import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { EventInput } from '@fullcalendar/core';

@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.page.html',
    styleUrls: ['./calendar-view.page.scss'],
})
export class CalendarViewPage implements OnInit {

    public calendarPlugins = [dayGridPlugin, timeGrigPlugin];
    public calendarEvents: EventInput[] = [
        { title: 'Wesak Day', start: new Date('05-12-2019'), end: new Date('05-16-2019'), allDay: true }
    ];
    public holidays: Holidays[] = [
        { 'day': 'Monday', 'start': '13-04-19', 'end': '13-04-19', 'title': 'Wesak Day' },
        { 'day': 'Tuesday', 'start': '14-04-19', 'end': '14-04-19', 'title': 'Agong Birthday ' },
        { 'day': 'Monday', 'start': '13-04-19', 'end': '14-04-19', 'title': 'Wesak Day' },
        { 'day': 'Tuesday', 'start': '14-04-19', 'end': '14-04-19', 'title': 'Agong Birthday ' },
        { 'day': 'Monday', 'start': '13-04-19', 'end': '14-04-19', 'title': 'Wesak Day' },
        { 'day': 'Tuesday', 'start': '14-04-19', 'end': '14-04-19', 'title': 'Agong Birthday ' },
        { 'day': 'Monday', 'start': '13-04-19', 'end': '13-04-19', 'title': 'Wesak Day' },
        { 'day': 'Tuesday', 'start': '14-04-19', 'end': '14-04-19', 'title': 'Agong Birthday ' }
    ];

    constructor(
    ) {
    }

    ngOnInit() {
    }

}
