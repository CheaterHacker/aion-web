# Angular 2 CRUD table using Yii 2 REST

CRUD table component for Angular 2 using Yii 2 REST backend and Bootstrap 3 CSS.

### Configuration
```typescript
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CrudTableModule} from './crud-table';

import {AppComponent} from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CrudTableModule
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
```

### Sample
```typescript
import {Component}  from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<crud-table [columns]="columns" [settings]="settings"></crud-table>`
})

export class PlayersComponent {

    public columns: Array < any > = [
        { title: 'Id', name: 'id', sortable: true, filter: true },
        { title: 'Name', name: 'name', sortable: true, filter: true }, 
        {
            title: 'Race',
            name: 'race',
            sortable: true,
            filter: true,
            options: [
                { id: 'ASMODIANS', name: 'ASMODIANS' },
                { id: 'ELYOS', name: 'ELYOS' },
            ]
        }, 
        {
            title: 'Gender',
            name: 'gender',
            sortable: true,
            filter: true,
            options: [
                { id: 'MALE', name: 'MALE' },
                { id: 'FEMALE', name: 'FEMALE' },
            ]
        },
        { title: 'Exp', name: 'exp', sortable: true, filter: true },
    ];
    public settings: any = {
        api: 'http://host3/players',
        crud: true,
        pageHeader: 'Players',
        primaryKey: 'id',
    };

}
```

You will need bootstrap styles

```
<!-- index.html -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
```

## Features
* Filtering
* Sorting
* Pagination
* Modal
* Create/Update/Delete
* Loading indicator
* MultiSelect
