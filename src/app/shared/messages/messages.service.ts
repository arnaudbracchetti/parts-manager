import {Injectable} from '@angular/core';

@Injectable()
export class MessagesService {

    private messages: Array<string> = new Array<string>();

    constructor() {}

    public addMessage(msg: string) {
        this.messages.push(msg);

    }

    public getAllMessages(): Array<string> {
        return this.messages;
    }

    public removeMessage(msg: string) {
        let index = this.messages.findIndex((item) => item === msg);
        if (index !== -1) {
            this.messages.splice(index, 1);
        }
    }
}
