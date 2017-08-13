import {Part} from '../model/part';
import {PartService} from './services/part.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';



@Component({
    selector: 'ms-part-list',
    templateUrl: './partlist.component.html',
    styleUrls: ['./partlist.component.css']
})
export class PartlistComponent implements OnInit {

    public parts: Part[];
    public partService: PartService;
    private router: Router;

    constructor(aPartService: PartService, router: Router) {
        this.partService = aPartService;
        this.router = router;

    }

    ngOnInit() {
        this.parts = this.partService.getAllParts();
    }



    public addPart() {
        this.router.navigate(['form']);

    }

}
