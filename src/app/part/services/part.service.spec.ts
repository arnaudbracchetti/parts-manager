import {TestBed, inject} from '@angular/core/testing';

import {PartService} from './part.service';
import {Part} from '../../model/part';

describe('PartService', () => {
    let service: PartService = null;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PartService]
        });
    });

    beforeEach(inject([PartService], (aService: PartService) => {
        service = aService;

    }));



    it('should be created', () => {
        expect(service).toBeTruthy();
    });






});
