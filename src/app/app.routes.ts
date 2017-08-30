import {PartformComponent} from './part/partform/partform.component';
import {PartlistComponent} from './part/partlist.component';
import {PartCategoryComponent} from './part/part-category/partcategory.component';
import {Routes} from '@angular/router';

export const ROUTES: Routes = [
    {path: '', component: PartlistComponent},
    {path: 'form', component: PartformComponent},
    {path: 'part-type', component: PartCategoryComponent},

];
