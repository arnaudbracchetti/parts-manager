import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';

import {MessagesComponent} from './messages.component';
import {MessagesService} from './messages.service';


describe('ErrorComponent', () => {
    let component: MessagesComponent;
    let fixture: ComponentFixture<MessagesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MessagesComponent],
            imports: [BrowserModule],
            providers: [MessagesService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessagesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should dispay error returned by MessageService', () => {

        let service: MessagesService = TestBed.get(MessagesService);

        spyOn<MessagesService>(service, 'getAllMessages').and.returnValue(new Array<string>('message1', 'message2'));
        fixture.detectChanges();

        let errors: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.ab-error');

        expect(errors.length).toBe(2);


    });

    it('should display nothing if there is no message to display', () => {
        spyOn<MessagesService>(component.service, 'getAllMessages').and.returnValue(new Array<string>());

        let display: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('*');

        expect(display.length).toBe(0);



    });


    xit('should remove error when user close it', () => {

    });
});
