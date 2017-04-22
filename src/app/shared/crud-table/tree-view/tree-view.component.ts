import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

export interface ITreeNode {
    id: number;
    name: string;
    column: string; 
    children?: ITreeNode[];
    isExpanded?: boolean;
    leaf?: boolean;
    parent?: ITreeNode[];
}

@Component({
	selector: 'treeNode',
    templateUrl: './tree-node.component.html',
    styleUrls: ['./tree-node.component.css'],
})
export class TreeNode implements OnInit {

	@Input() node: any;
    @Input() selectedNode: ITreeNode;
    @Input() parentNode: TreeNode;
    @Output() onSelectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();

	ngOnInit() {
        if(this.node !== this.parentNode) {
            this.node.parent = this.parentNode;
        }
	}

	toggle() {
        this.node.isExpanded = !this.node.isExpanded;
	}

    isLeaf() {
        return this.node.leaf == false ? false : !(this.node.children && this.node.children.length);
    }

    onSelectNode(node: ITreeNode) {
        if(this.selectedNode !== node) {
            this.selectedNode = node;
            this.onSelectedChanged.emit(node);
        }
    }

    isSelected() {
        return this.node === this.selectedNode;
    }

}

@Component({
    selector: "tree-view",
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.css'],
})
export class TreeView {

    @Input() nodes: ITreeNode[];
    @Input() selectedNode: ITreeNode;

    @Output() onSelectedChanged: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();
    @Output() onRequestNodes: EventEmitter<ITreeNode> = new EventEmitter<ITreeNode>();

    constructor() { }

    onSelectNode(node: ITreeNode) {
        if(this.selectedNode !== node) {
            this.selectedNode = node;
            this.onSelectedChanged.emit(node);
        }
    }

    onExpand(node: ITreeNode) {

        node.isExpanded = !node.isExpanded;

        if (node.isExpanded && (!node.children || node.children.length === 0)) {
            this.onRequestNodes.emit(node);
        }
    }

    onRequestLocal(node: ITreeNode) {
        this.onRequestNodes.emit(node);
    }
}
