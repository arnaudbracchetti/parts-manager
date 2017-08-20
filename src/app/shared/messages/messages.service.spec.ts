import {TestBed, inject} from '@angular/core/testing';

import {MessagesService} from './messages.service';

describe('MessageService', () => {

    let service: MessagesService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessagesService]
        });

        service = TestBed.get(MessagesService);
    });




    it('should add message', () => {

        service.addMessage('message1');
        service.addMessage('message2');


        expect(service.getAllMessages()).toContain('message1');
        expect(service.getAllMessages()).toContain('message2');
    });

    it('should remove message', () => {
        service.addMessage('message1');
        service.addMessage('message2');
        service.addMessage('message3');


        service.removeMessage('message2');
        expect(service.getAllMessages()).not.toContain('message2');
        expect(service.getAllMessages()).toContain('message1');
        expect(service.getAllMessages()).toContain('message3');


        service.removeMessage('message3');
        expect(service.getAllMessages()).not.toContain('message3');
        expect(service.getAllMessages()).toContain('message1');

        service.removeMessage('message1');
        expect(service.getAllMessages()).not.toContain('message1');
        expect(service.getAllMessages().length).toBe(0);


    });
});
