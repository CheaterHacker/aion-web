import { Component, OnInit, ViewChild, Input, ViewEncapsulation, ElementRef, Renderer, AfterViewInit, OnDestroy  } from '@angular/core';

import { YiiService } from './services/yii.service';
import { OrdsService } from './services/ords.service';
import { DemoService } from './services/demo.service';
import { ModalComponent } from './modal/modal.component';
import { Column, Filter, Settings, ICrudService } from './types/interfaces';

@Component({
    selector: 'crud-table',
    templateUrl: './crud-table.component.html',
    styleUrls: ['./crud-table.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [YiiService, OrdsService, DemoService]
})

export class CrudTableComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('childModal')
    public readonly childModal: ModalComponent;
    @ViewChild('selectFilter') selectFilter: any;

    @Input() public columns: Column[];
    @Input() public settings: Settings;

    items: any[];
    item: any;
    selectedItem: any;
    newItem: boolean;
    errors: any;
    onDetailView: boolean = false;

    public loading: boolean = false;

    public itemsPerPage: number = 10;
    public totalItems: number = 0;
    public currentPage: number = 1;

    public filters: Filter = {};
    public sortField: string;
    public sortOrder: number;
    private service: ICrudService;

    public scrollHeight: number = 380;
    public tableWidth: number = 820;
    @ViewChild('dataTable') dataTable: ElementRef;
    listenFunc: Function;
    headerLockedWidth: number;
    headerWrapWidth: number;
    contentLockedWidth: number;
    contentWidth: number;
    contentLockedHeight: number;
    contentHeight: number;

    frozenColumns: Column[];
    scrollableColumns: Column[];
    frozenWidth: number = 0;
    scrollableColumnsWidth: number = 0;
    scrollBarWidth: number;

    constructor(private renderer: Renderer, private yiiService: YiiService, private ordsService: OrdsService, private demoService: DemoService) {}

    ngOnInit() {
        this.initService();
        this.initColumns();
        this.initTableSize() ;
        this.getItems();
    }

    ngAfterViewInit() {
        this.initScrolling();
    }

    ngOnDestroy() {
        // Removes "listen" listener
        this.listenFunc();
    }

    initColumns(): void {
        this.setColumnDefaults(this.columns);
       
        this.scrollableColumns = [];
        this.columns.forEach((column) => {
            if(column.frozen) {
                this.frozenColumns = this.frozenColumns||[];
                this.frozenColumns.push(column);
                this.frozenWidth = this.frozenWidth + column.width;
            } 
            else {
                this.scrollableColumns.push(column);
                this.scrollableColumnsWidth = this.scrollableColumnsWidth + column.width;
            }
        });
    }

    initTableSize() {
    	this.scrollHeight = this.settings.scrollHeight || this.scrollHeight;
     	this.tableWidth = this.settings.tableWidth || this.tableWidth;
        this.scrollBarWidth = this.calculateScrollbarWidth();
        this.headerLockedWidth = this.frozenWidth + 40;
        this.headerWrapWidth = this.tableWidth - this.headerLockedWidth ;
        this.contentLockedWidth = this.headerLockedWidth;
        this.contentWidth = this.headerWrapWidth + this.scrollBarWidth;
        this.contentLockedHeight = this.scrollHeight;
        this.contentHeight = this.contentLockedHeight + this.scrollBarWidth;
    }

    initScrolling() {
        let rcBody = this.dataTable.nativeElement.querySelector('.k-grid-content');
        let fcBody = this.dataTable.nativeElement.querySelector('.k-grid-content-locked');
        let rcHead = this.dataTable.nativeElement.querySelector('.k-grid-header-wrap');
        this.listenFunc = this.renderer.listen(rcBody, 'scroll', (event) => {
            fcBody.scrollTop = rcBody.scrollTop;
            rcHead.scrollLeft = rcBody.scrollLeft;
            this.selectFilter.hide();
        });
    }

    initService() {
        if (this.settings.type === 'yii') {
          this.service = this.yiiService;
        } else if (this.settings.type === 'ords') {
          this.service = this.ordsService;
        } else if (this.settings.type === 'demo') {
          this.service = this.demoService;
        } else {
          this.service = this.yiiService;
        }
        this.service.url = this.settings.api;
        this.service.primaryKey = (this.settings.primaryKey) ? this.settings.primaryKey.toLowerCase() : 'id';
    }

    loadingShow() {
        this.loading = true;
    }

    loadingHide() {
        this.loading = false;
    }

    getItems() {
        this.loadingShow();
        this.errors = null;
        this.service.getItems(this.currentPage, this.filters, this.sortField, this.sortOrder)
            .then(data => {
                this.loadingHide();
                this.items = data.items;
                this.totalItems = data._meta.totalCount;
                this.itemsPerPage = data._meta.perPage;
            })
            .catch(error => {
                this.loadingHide();
                this.errors = error;
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event;
        this.getItems();
    }

    save() {
        this.loadingShow();
        this.errors = null;
        if (this.newItem) {
            this.service
                .post(this.item)
                .then(item => {
                    this.loadingHide();
                    this.item = item;
                    this.items.push(this.item);
                })
                .catch(error => {
                    this.loadingHide();
                    this.errors = error;
                });
        } else {
            this.service
                .put(this.item)
                .then(item => {
                    this.loadingHide();
                    this.items[this.findSelectedItemIndex()] = item;
                })
                .catch(error => {
                    this.loadingHide();
                    this.errors = error;
                });
        }
        this.childModal.hide();
    }

    delete() {
        this.loadingShow();
        this.errors = null;
        this.service
            .delete(this.item)
            .then(res => {
                this.loadingHide();
                this.items.splice(this.findSelectedItemIndex(), 1);
                this.item = null;
                this.onDetailView = false;
            })
            .catch(error => {
                this.loadingHide();
                this.errors = error;
            });
        this.childModal.hide();
    }

    onRowSelect(item: any) {
        this.newItem = false;
        this.item = this.cloneItem(item);
    }

    cloneItem(item: any) {
        let clone = Object.assign({}, item);
        this.selectedItem = Object.assign({}, item);
        return clone;
    }

    findSelectedItemIndex(): number {
        let obj = this.items.find(x => JSON.stringify(x) === JSON.stringify(this.selectedItem));
        let index = this.items.indexOf(obj);
        return index;
    }

    createItem() {
        this.newItem = true;
        this.item = {};
        this.childModal.show();
    }

    updateItem(item: any) {
        this.newItem = false;
        this.item = this.cloneItem(item);
        this.childModal.show();
    }

    deleteItem(item: any) {
        this.item = this.cloneItem(item);
        this.delete();
    }

    viewDetails(item: any) {
        this.errors = null;
        this.item = this.cloneItem(item);
        this.onDetailView = true;
    }

    closeDetails() {
        this.onDetailView = false;
    }

    filter(event) {
    	this.filters = event;
        this.getItems();
    }

    sort(event) {
        this.sortField = event.field;
        this.sortOrder = event.order;
        this.getItems();
    }

    modalTitle() {
        return (this.newItem) ? 'Добавить' : 'Редактировать';
    }

    format(value: any, column: Column) {
        if(column.format &&  column.format === 'date') {
            let d = new Date(value*1000);
            value = d.toLocaleString('ru');
        }
        return value;
    }

    calculateScrollbarWidth(): number {
        let scrollDiv = document.createElement("div");
        scrollDiv.className = "scrollbar-measure";
        document.body.appendChild(scrollDiv);

        let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        
        return scrollbarWidth;
    }

    showColumnMenu(event) {
        this.selectFilter.show(200, event.top, event.left, event.column);
    }

    setColumnDefaults(columns: Column[]): Column[] {
        if (!columns) return;

        let result = columns.map(function(column) {

            if (!column.hasOwnProperty('sortable')) {
                column.sortable = true;
            }
            if (!column.hasOwnProperty('filter')) {
                column.filter = true;
            }
            if (!column.hasOwnProperty('width')) {
                column.width = 150;
            }
            if (!column.hasOwnProperty('frozen')) {
                column.frozen = false;
            }
            return column;

        });
        return result;
    }

    columnsTotalWidth(columns: Column[]): number {
        let totalWidth = 0;
        for (let column of columns) {
            totalWidth = totalWidth + column.width;
        }
        return totalWidth;
    }

}
