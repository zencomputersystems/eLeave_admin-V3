import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { APIService } from "../../../../../src/services/shared-service/api.service";
import { LeaveApiService } from "../leave-api.service";

/**
 * Node for to-do item
 */
export class TodoItemNode {

    /**
     * Children info
     * @type {TodoItemNode[]}
     * @memberof TodoItemNode
     */
    children: TodoItemNode[];

    /**
     * Name of employee in user list
     * @type {string}
     * @memberof TodoItemNode
     */
    item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {

    /**
     * Name of employee in user list
     * @type {string}
     * @memberof TodoItemFlatNode
     */
    item: string;

    /**
     * Level number in treeview list
     * @type {number}
     * @memberof TodoItemFlatNode
     */
    level: number;

    /**
     * Boolean value of expandable item in treeview list
     * @type {boolean}
     * @memberof TodoItemFlatNode
     */
    expandable: boolean;
}

/**
 * EmployeeList database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 * @export
 * @class AssignCalendarTreeviewService
 */
@Injectable()
export class AssignCalendarTreeviewService {

    /**
     * A subject use to observe value of item & children
     * @memberof AssignCalendarTreeviewService
     */
    public dataChange = new BehaviorSubject<TodoItemNode[]>([]);

    /**
     * Get user list from API
     * @type {*}
     * @memberof AssignCalendarTreeviewService
     */
    public list: any;

    /**
     * Object value for nested tree list
     * @memberof AssignCalendarTreeviewService
     */
    public objectTree = {};

    /**
     * get company name
     * @type {string}
     * @memberof AssignCalendarTreeviewService
     */
    public companyName: string;

    /** 
     * Return data of children and item
     * @readonly
     * @type {TodoItemNode[]}
     * @memberof AssignCalendarTreeviewService
     */
    get data(): TodoItemNode[] { return this.dataChange.value; }

    /**
     *Creates an instance of AssignCalendarTreeviewService.
     * @param {APIService} apiService
     * @param {LeaveApiService} leaveAPI
     * @memberof AssignCalendarTreeviewService
     */
    constructor(private apiService: APIService, private leaveAPI: LeaveApiService) {
        this.apiService.get_user_profile_list().subscribe(
            list => {
                this.list = list;
                for (let i = 0; i < this.list.length; i++) {
                    if (!(this.list[i].companyId in this.objectTree)) {
                        this.objectTree[this.list[i].companyId] = {};
                        this.objectTree[this.list[i].companyId][this.list[i].department] = new Array();
                        this.objectTree[this.list[i].companyId][this.list[i].department].push(this.list[i].employeeName);
                    }
                    else if (this.list[i].companyId in this.objectTree && this.list[i].department in this.objectTree[this.list[i].companyId]) {
                        this.objectTree[this.list[i].companyId][this.list[i].department].push(this.list[i].employeeName);
                    }
                    else {
                        this.objectTree[this.list[i].companyId][this.list[i].department] = new Array();
                        this.objectTree[this.list[i].companyId][this.list[i].department].push(this.list[i].employeeName);
                    }
                }
                this.getCompanyName(Object.keys(this.objectTree));
            });
    }

    /**
     * get company details
     * @param {*} companyId
     * @memberof AssignCalendarTreeviewService
     */
    getCompanyName(companyId) {
        for (let i = 0; i < companyId.length; i++) {
            this.leaveAPI.get_company_details(companyId[i]).subscribe(data => {
                this.objectTree[data.companyName] = this.objectTree[companyId[i]];
                delete this.objectTree[companyId[i]];
                this.initialize();
            })
        }
    }

    /**
     * Initialize builded tree nodes from JSON list
     * @memberof AssignCalendarTreeviewService
     */
    initialize() {
        // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        //     file node as children.
        const data = this.buildFileTree(this.objectTree, 0);

        // Notify the change.
        this.dataChange.next(data);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
        return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
            const value = obj[key];
            const node = new TodoItemNode();
            node.item = key;

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1);
                } else {
                    node.item = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }

}