import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {RouterModule} from '@angular/router';
import {ROUTES} from './app.routes';

import {PartServiceFake} from './part/services/fake-part.service';
import {PartService} from './part/services/part.service';
import {AppComponent} from './app.component';
import {FocusDirective} from './shared/focus/focus.directive';
import {MessagesComponent} from './shared/messages/messages.component';
import {PartlistComponent} from './part/partlist.component';
import {PartformComponent} from './part/partform/partform.component';
import {FormsModule} from '@angular/forms';
import {PartCategoryComponent} from './part/part-category/partcategory.component';
import {MessagesService} from './shared/messages/messages.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// primeNG
import {DataTableModule, SharedModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {ToolbarModule} from 'primeng/primeng';
import {MenuModule} from 'primeng/primeng';
import {TreeModule} from 'primeng/primeng';





@NgModule({
    declarations: [
        AppComponent,
        PartlistComponent,
        PartformComponent,
        PartCategoryComponent,
        FocusDirective,
        MessagesComponent

    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(ROUTES),
        FormsModule,
        BrowserAnimationsModule,
        DataTableModule,
        ButtonModule,
        MenuModule,
        ToolbarModule,
        TreeModule,
        SharedModule
    ],
    providers: [{provide: PartService, useClass: PartServiceFake},
        MessagesService],
    bootstrap: [AppComponent]
})
export class AppModule {}
