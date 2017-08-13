import {PartformComponent} from './part/partform/partform.component';
import {PartlistComponent} from './part/partlist.component';
import {ParttypeComponent} from './part/parttype/parttype.component';
import {Routes} from '@angular/router';

export const ROUTES: Routes = [
    {path: '', component: PartlistComponent},
    {path: 'form', component: PartformComponent},
    {path: 'part-type', component: ParttypeComponent},

];
