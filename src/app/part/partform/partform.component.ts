import {Part} from '../../model/part';
import {PartService} from '../services/part.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';





@Component({
  selector: 'app-partform',
  templateUrl: './partform.component.html',
  styleUrls: ['./partform.component.css']
})
export class PartformComponent implements OnInit {

  protected newPart: Part;
  protected service: PartService;
  protected router: Router;

  constructor(service: PartService, router: Router) {
    this.newPart = new Part();
    this.newPart.count = 1;
    this.service = service;
    this.router = router;
  }

  ngOnInit() {
  }

  public save() {
    this.service.addPart(this.newPart);
    this.router.navigate(['/']);
  }

}
