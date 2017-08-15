import {PartType} from '../../model/part-type';
import {PartService} from '../services/part.service';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ParttypeComponent, PrimeNGTreeNode} from './parttype.component';

import {TreeModule} from 'primeng/primeng';

import {TreeNode} from 'primeng/primeng';

describe('ParttypeComponent', () => {
    let component: ParttypeComponent;
    let fixture: ComponentFixture<ParttypeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ParttypeComponent],
            imports: [TreeModule, FormsModule],
            providers: [PartService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ParttypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    describe('Convert to PrimeNgTree', () => {

        // let root: PartType, T00: PartType, T01: PartType, T02: PartType, T020: PartType, T021: PartType;
        // let T022: PartType, T0210: PartType, T0211: PartType;

        /*  beforeEach(() => {
              root = new PartType('root');              // root
              T00 = root.addSubType('T00');            //   T00
              T01 = root.addSubType('T01');            //   T01
              T02 = root.addSubType('T02');            //   T02
              T020 = T02.addSubType('T020');            //     T020
              T021 = T02.addSubType('T021');            //     T021
              T0210 = T021.addSubType('T0210');          //       T0210
              T0211 = T021.addSubType('T0211');          //       T0211
              T022 = T02.addSubType('T022');            //     T022
          });*/


        it('Should convert structure of tree', () => {

            let test = component.getPrimeNgTree();

            expect(test[0].children.length).toBe(3);

            expect(test[0].children[0].children.length).toBe(0);
            expect(test[0].children[1].children.length).toBe(0);
            expect(test[0].children[2].children.length).toBe(3);

            expect(test[0].children[2].children[0].children.length).toBe(0);
            expect(test[0].children[2].children[1].children.length).toBe(2);
            expect(test[0].children[2].children[2].children.length).toBe(0);

            expect(test[0].children[2].children[1].children[0].children.length).toBe(0);
            expect(test[0].children[2].children[1].children[1].children.length).toBe(0);

        });

        it('should set the correct parent', () => {
            /**
             * Le parent est positionné par le composant Tree lui même. Toutefois
             * il semble y avoir un bug dans PrimeNG avec le layout="horizontal".
             * j'ai réalisé un pache pour corriger le problème. Je laisse donc le test
             * pour une mise à jour future de primeNG
             */


            let test: TreeNode[] = component.getPrimeNgTree();

            expect(test[0].parent).not.toBeTruthy();

            expect(test[0].children[0].parent.label).toBe(test[0].label);
            expect(test[0].children[1].parent).toBe(test[0]);
            // ...
            expect(test[0].children[2].children[0].parent).toBe(test[0].children[2]);
            // ...
        });

        it('should maintain the name of the partType', () => {
            let test = component.getPrimeNgTree();

            expect(test[0].label).toBe('root');


            expect(test[0].children[0].label).toBe('T00');
            expect(test[0].children[1].label).toBe('T01');
            expect(test[0].children[2].label).toBe('T02');

            expect(test[0].children[2].children[0].label).toBe('T020');
            expect(test[0].children[2].children[1].label).toBe('T021');
            expect(test[0].children[2].children[2].label).toBe('T022');

            // ...
        });



    });



    describe('Add new element in tree', () => {
        let addButton: HTMLButtonElement;

        // define the addButton
        beforeEach(() => {
            let el: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('p-treenode');
            let NodeCount = el.length;


            el = el[0].querySelectorAll('button#addNode');

            addButton = el[0] as HTMLButtonElement;
        });

        it('should call addSubType() when add button is clicked', () => {

            spyOn(component, 'addSubType');



            addButton.click();
            fixture.detectChanges();

            expect(component.addSubType).toHaveBeenCalled();


        });

        it('should add a new node when add button is clicked', () => {
            let el: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('p-treenode');
            let NodeCount = el.length;


            addButton.click();
            fixture.detectChanges();

            // On doit avoir un noeud de plus
            el = fixture.nativeElement.querySelectorAll('p-treenode');
            expect(el.length).toBe(NodeCount + 1, 'We must have one more node');



        });

        it('should set the new element in edit mode', () => {

            addButton.click();
            fixture.detectChanges();

            let el = fixture.nativeElement.querySelectorAll('input#editNode');

            expect(el.length).toBe(1, 'One node must be in edit mode');
        });
    });
});

