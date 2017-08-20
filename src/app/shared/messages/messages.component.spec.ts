import {async, fakeAsync, tick, flush, ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule, BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MessagesComponent} from './messages.component';
import {MessagesService} from './messages.service';


describe('ErrorComponent', () => {
    let component: MessagesComponent;
    let fixture: ComponentFixture<MessagesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MessagesComponent],
            imports: [
                BrowserAnimationsModule],
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

    it('should dispay message returned by MessageService', () => {

        let service: MessagesService = TestBed.get(MessagesService);

        spyOn<MessagesService>(service, 'getAllMessages').and.returnValue(new Array<string>('message1', 'message2'));
        fixture.detectChanges();

        let errors: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.ab-error');

        expect(errors.length).toBe(2);


    });

    it('should display nothing if there is no message to display', () => {
        spyOn<MessagesService>(component.service, 'getAllMessages').and.returnValue(new Array<string>());
        fixture.detectChanges();

        let display: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('*');

        expect(display.length).toBe(0);



    });


    it('should remove message when user close it', () => {
        let service: MessagesService = TestBed.get(MessagesService);
        service.addMessage('message1');
        service.addMessage('message2');
        fixture.detectChanges();

        let closeEls: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.close');
        expect(closeEls.length).toBe(2);


        closeEls[0].click();
        fixture.detectChanges();

        fixture.whenRenderingDone().then(() => {

            console.log('toto');
            closeEls = fixture.nativeElement.querySelectorAll('.close');
            expect(closeEls.length).toBe(1);

            expect(service.getAllMessages()).not.toContain('message1');
            expect(service.getAllMessages()).toContain('message2');


        });

    });



});
