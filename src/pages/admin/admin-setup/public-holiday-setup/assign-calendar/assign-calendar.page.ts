import { Component, OnInit, ViewChild, Injectable } from "@angular/core";
import { APIService } from "src/services/shared-service/api.service";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from "@angular/forms";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listYear from '@fullcalendar/list';
import { EventInput } from "@fullcalendar/core";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarNotificationPage } from "../snackbar-notification/snackbar-notification";
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { EmployeeListDatabase, TodoItemNode, TodoItemFlatNode } from "./assign-calendar-treeview.service";

/**
 * Assign Calendar Page
 * Admin assign employee's calendar profile in this page
 * @export
 * @class AssignCalendarPage
 * @implements {OnInit}
 */
@Component({
    selector: 'app-assign-calendar',
    templateUrl: './assign-calendar.page.html',
    styleUrls: ['./assign-calendar.page.scss'],
    providers: [EmployeeListDatabase]
})
export class AssignCalendarPage implements OnInit {

    /**
      * This is local property for Full Calendar Component
      * @type {FullCalendarComponent}
      * @memberof CalendarViewPage
      */
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    /**
     * Calendar profile list that show in options of selection
     * @type {*}
     * @memberof AssignCalendarPage
     */
    public calendarList: any;

    /**
   * Users list that show in options of selection
   * @type {*}
   * @memberof AssignCalendarPage
   */
    public userList: any;

    /**
     * Array list of selected employees ID
     * @type {any[]}
     * @memberof AssignCalendarPage
     */
    public employeeList: any[] = [];

    /**
     * Value of selected ID
     * @type {string}
     * @memberof AssignCalendarPage
     */
    public selectedCalendarId: string;

    /**
     * Track value and validity of user and calendar select input
     * @type {FormGroup}
     * @memberof AssignCalendarPage
     */
    public assignCalendarForm: FormGroup;

    /**
     * Show/hide loading spinner
     * @type {boolean}
     * @memberof ManageHolidayPage
     */
    public showSpinner: boolean = false;

    /**
     * This is input property for plugins of Full Calendar Component
     * @memberof CalendarViewPage
     */
    public calendarPlugins = [dayGridPlugin, timeGrigPlugin, listYear];

    /**
     * Events that show in Calendar
     * @type {EventInput[]}
     * @memberof AssignCalendarPage
     */
    public events: EventInput[];

    public showTreeDropdown: boolean = false;

    public showSelectedTree: boolean = false;

    dataChange = new BehaviorSubject<TodoItemNode[]>([]);

    get data(): TodoItemNode[] { return this.dataChange.value; }

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

    treeControl: FlatTreeControl<TodoItemFlatNode>;

    treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

    dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

    /**
     *Creates an instance of AssignCalendarPage.
     * @param {APIService} apiService
     * @param {MatSnackBar} snackBar
     * @memberof AssignCalendarPage
     */

    constructor(private apiService: APIService, private snackBar: MatSnackBar, private database: EmployeeListDatabase, private fb: FormBuilder) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
    }

    ngOnInit() {
        this.assignCalendarForm = this.fb.group({
            user: this.fb.array([]),
            calendar: ['', Validators.required]
        });
        this.apiService.get_user_profile_list().subscribe(
            data => {
                this.userList = data;
            });
        this.apiService.get_calendar_profile_list().subscribe(
            data => {
                this.calendarList = data;
            });
        setTimeout(() => {
            let calendar = this.calendarComponent.getApi();
            calendar.render();
        }, 100);
    }

    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: TodoItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.item === node.item
            ? existingNode
            : new TodoItemFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;
        flatNode.expandable = !!node.children;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        // console.log('select', this.checklistSelection);
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        this.checkAllParentsSelection(node);
        // console.log('main', node, this.checklistSelection);
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
        // console.log('inner', node, this.checklistSelection);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TodoItemFlatNode): void {
        let parent: TodoItemFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: TodoItemFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    /* Get the parent node of a node */
    getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    /**
     * To get selected calendar ID
     * Show events in calendar
     * @param {*} calendarId
     * @memberof AssignCalendarPage
     */
    calendarSelected(calendarId) {
        this.showSpinner = true;
        this.selectedCalendarId = calendarId;
        this.apiService.get_personal_holiday_calendar(calendarId).subscribe(
            (data: any) => {
                this.events = data.holiday;
                for (let i = 0; i < this.events.length; i++) {
                    this.events['allDay'] = true;
                    this.events["backgroundColor"] = "#c2185b";
                    this.events["borderColor"] = "#c2185b";
                }
                this.showSpinner = false;
            })
    }

    /**
     * check ID exist or not in array list
     * @param {*} array
     * @param {*} obj
     * @returns
     * @memberof AssignCalendarPage
     */
    checkIdExist(array: any, obj: any) {
        for (let j = 0; j < array.length; j++) {
            if (array[j].employeeName === obj) {
                return j;
            }
        }
        return 0;
    }

    /**
     * To assign calendar profile of selected employee to API
     * @memberof AssignCalendarPage
     */
    submitData() {

        for (let i = 0; i < this.assignCalendarForm.controls.user.value.length; i++) {
            if (this.checkIdExist(this.userList, this.assignCalendarForm.controls.user.value[i]) != 0) {
                const index: number = this.checkIdExist(this.userList, this.assignCalendarForm.controls.user.value[i]);
                this.employeeList.push(this.userList[index].id);
            }
        }
        const body = {
            "user_guid": this.employeeList,
            "calendar_guid": this.selectedCalendarId
        }
        this.apiService.patch_assign_calendar_profile(body).subscribe(
            response => {
                this.assignCalendarForm.reset();
                this.events = [];
                this.showSelectedTree = false;
                this.checklistSelection.clear();
                this.openSnackBar('successfully');
            }, error => {
                this.openSnackBar('unsuccessfully');
                window.location.href = '/login';
            }
        );
    }

    /**
     * Display message after submitted calendar profile
     * @param {string} message
     * @memberof AssignCalendarPage
     */
    openSnackBar(message: string) {
        this.snackBar.openFromComponent(SnackbarNotificationPage, {
            duration: 2500,
            data: message
        });
    }

    outside(event) {
        if (!event.target.className.includes("inputDropdown") && !event.target.className.includes("material-icons") && !event.target.className.includes("mat-form-field-infix")) {
            this.showTreeDropdown = false;
            this.showSelectedTree = true;
            for (let i = 0; i < this.checklistSelection.selected.length; i++) {
                if (this.checklistSelection.selected[i].level == 1) {
                    if (this.assignCalendarForm.controls.user.value.indexOf(this.checklistSelection.selected[i].item) === -1) {
                        this.assignCalendarForm.controls.user.value.push(this.checklistSelection.selected[i].item);
                    }
                }
            }
            if (this.checklistSelection.selected.length === 0) {
                this.assignCalendarForm.controls.user.value.length = 0;
            }
        }
    }
}