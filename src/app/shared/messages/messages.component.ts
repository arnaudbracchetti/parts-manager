import {MessagesService} from './messages.service';
import {trigger, state, transition, animate, style} from '@angular/animations';
import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'ab-error',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    animations: [
        trigger('state', [

            transition(':enter', [
                style({transform: 'scaleY(0)', opacity: 0}),
                animate(200, style({transform: 'scaleY(1)', opacity: 1}))
            ]),
            transition(':leave', [
                style({transform: 'scaleY(1)', opacity: 1}),
                animate(200, style({transform: 'scaleY(0)', opacity: 0}))
            ])

        ])

    ]
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
