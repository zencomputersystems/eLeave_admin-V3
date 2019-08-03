import { TodoItemFlatNode, TodoItemNode, EmployeeListDatabase } from "./assign-calendar-treeview.service";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlattener, MatTreeFlatDataSource } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";

/**
 * Employee Treeview 
 * @export
 * @class EmployeeTreeview
 */
@Injectable({
    providedIn: 'root'
})
export class EmployeeTreeview {
    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

    /**
     * Allow expand/collpase tree for subtree recursively for flattened tree
     * @type {FlatTreeControl<TodoItemFlatNode>}
     * @memberof AssignCalendarPage
     */
    treeControl: FlatTreeControl<TodoItemFlatNode>;

    /**
     * Convert normal node to node with level & children info
     * @type {MatTreeFlattener<TodoItemNode, TodoItemFlatNode>}
     * @memberof AssignCalendarPage
     */
    treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

    /**
     * Data details for tree checkbox list
     * @type {MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>}
     * @memberof AssignCalendarPage
     */
    dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

    /**
     *Creates an instance of EmployeeTreeview.
     * @param {EmployeeListDatabase} database
     * @memberof EmployeeTreeview
     */
    constructor(private database: EmployeeListDatabase) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        database.dataChange.subscribe(data => {
            this.dataSource.data = data;
        });
    }

    /**
    * Get level info
    * @memberof AssignCalendarPage
    */
    getLevel = (node: TodoItemFlatNode) => node.level;

    /**
     * Get explandable boolean value
     * @memberof AssignCalendarPage
     */
    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    /**
     * Get children items
     * @memberof AssignCalendarPage
     */
    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

    /**
     * Get boolean value for hasChild
     * @memberof AssignCalendarPage
     */
    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

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
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
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
}