export interface Holidays {
    day: string;
    start: string;
    end: string;
    title: string;
}

import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.page.html',
    styleUrls: ['./calendar-view.page.scss'],
})
export class CalendarViewPage implements OnInit {

    @ViewChild('calendar') calendar: FullCalendarComponent;
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, listYear];
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
        setTimeout(() => {
            let calendarView = this.calendar.getApi();
            calendarView.render();
        }, 100);
    }

}
