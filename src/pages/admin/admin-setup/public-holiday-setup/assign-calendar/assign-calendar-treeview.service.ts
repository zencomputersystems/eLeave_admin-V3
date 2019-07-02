import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { APIService } from "src/services/shared-service/api.service";

/**
 * Node for to-do item
 */
export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
    item: string;
    level: number;
    expandable: boolean;
}

/**
 * EmployeeList database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 * @export
 * @class EmployeeListDatabase
 */
@Injectable()
export class EmployeeListDatabase {
    public dataChange = new BehaviorSubject<TodoItemNode[]>([]);
    public list: any;
    public objectTree = {};
    get data(): TodoItemNode[] { return this.dataChange.value; }

    /**
     *Creates an instance of EmployeeListDatabase.
     * @param {APIService} apiService
     * @memberof EmployeeListDatabase
     */
    constructor(private apiService: APIService) {
        this.apiService.get_user_profile_list().subscribe(
            list => {
                this.list = list;
                for (let i = 0; i < this.list.length; i++) {
                    if (this.list[i].department in this.objectTree) {
                        this.objectTree[this.list[i].department].push(this.list[i].employeeName);
                    } else {
                        this.objectTree[this.list[i].department] = new Array();
                        this.objectTree[this.list[i].department].push(this.list[i].employeeName);
                    }
                }
                this.initialize();
            });
    }

    /**
     * Initialize builded tree nodes from JSON list
     * @memberof EmployeeListDatabase
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