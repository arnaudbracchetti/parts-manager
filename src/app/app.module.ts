import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';


import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';

import { PartServiceFake } from './part/services/fake-part.service';
import { PartService } from './part/services/part.service';
import { AppComponent } from './app.component';
import { FocusDirective } from './shared/focus/focus.directive';
import { MessagesComponent } from './shared/messages/messages.component';
import { PartlistComponent } from './part/partlist.component';
import { PartformComponent } from './part/partform/partform.component';
import { FormsModule } from '@angular/forms';
import { PartCategoryComponent } from './part/part-category/partcategory.component';
import { MessagesService } from './shared/messages/messages.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirebasePartCategoryFactory } from './model/firebasepartcategorydecorator';
import { PartCategoryFactory } from './model/part-category';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// primeNG
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';





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
        SharedModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule, // imports firebase/database, only needed for database features
        AngularFireAuthModule, // imports firebase/auth, only needed for auth features

    ],
    providers: [
        { provide: PartService, useClass: PartServiceFake },
        { provide: PartCategoryFactory, useClass: FirebasePartCategoryFactory }, // utilisation de la percistence Firebase
        MessagesService],
    bootstrap: [AppComponent]
})
export class AppModule { }
