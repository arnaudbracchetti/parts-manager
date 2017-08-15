import {Component} from '@angular/core';
import {MenuItem} from 'primeng/primeng';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'app';

    private menu: MenuItem;

    constructor() {
        this.menu = [{
            label: 'Recherche',
            items: [{label: 'Liste des composants', routerLink: ['/']}]
        },
        {
            label: 'Administration',
            items: [{label: 'gestion des types', routerLink: ['part-type']}]


        }];
    }

}
