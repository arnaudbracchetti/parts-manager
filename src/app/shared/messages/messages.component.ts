import {MessagesService} from './messages.service';
import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'ab-error',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {


    public service: MessagesService;

    constructor(service: MessagesService) {
        this.service = service;
    }

    ngOnInit() {
    }

    public closeMessage(msg: string) {
        this.service.removeMessage(msg);
    }



}
