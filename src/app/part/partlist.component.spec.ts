import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';


import {PartlistComponent} from './partlist.component';
import {PartService} from './services/part.service';
import {PartServiceFake} from './services/fake-part.service';
import {RouterTestingModule} from '@angular/router/testing';

import {DataTableModule, SharedModule} from 'primeng/primeng';


describe('PartlistComponent', () => {
    let component: PartlistComponent;
    let fixture: ComponentFixture<PartlistComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                DataTableModule,
                SharedModule
            ],
            declarations: [PartlistComponent],
            providers: [{provide: PartService, useClass: PartServiceFake}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PartlistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {

        expect(component).toBeTruthy();
    });

    it('should have part list initialised', () => {
        expect(component.parts.length).toBe(4);
    });

    xit('should display 4 lignes and 3 column', () => {
        expect(fixture.debugElement.queryAll(By.css('clr-dg-row')).length).toBe(4);
        expect(fixture.debugElement.queryAll(By.css('clr-dg-column')).length).toBe(3);
    });

    it('should dispay one button to add part', () => {
        let buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('button#add');
        expect(buttons.length).toBe(1);
        expect(buttons[0].attributes.getNamedItem('label').value).toBe('Add part');
    });


});
