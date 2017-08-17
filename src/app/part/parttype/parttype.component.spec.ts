import {PartType} from '../../model/part-type';
import {PartService} from '../services/part.service';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ParttypeComponent, PrimeNGTreeNode} from './parttype.component';

import {TreeModule} from 'primeng/primeng';

import {TreeNode} from 'primeng/primeng';
import {ForOfStatement} from 'typescript';


function getNodeBylabel(root: PrimeNGTreeNode, label: string): PrimeNGTreeNode {

    let ret = null;

    if (root.label === label) {
        ret = root;
    } else {
        for (let item of root.children) {

            ret = getNodeBylabel(item, label);

            if (ret !== null) {
                break;
            }

        }
    }

    return ret;
}

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
        let addButton: HTMLElement;


        // define the addButton
        beforeEach(() => {
            let el: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('p-treenode');
            let NodeCount = el.length;


            el = el[0].querySelectorAll('#addButton');

            addButton = el[0] as HTMLElement;
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




    describe('Delete element in tree', () => {



        it('should call deletePartType() when delete button is clked', () => {

            let el: HTMLElement = fixture.nativeElement.querySelector(`p-treenodetemplateloader[ng-reflect-node=T01]~div #deleteButton`);
            spyOn(component, 'deletePartType');

            el.click();
            fixture.detectChanges();

            expect(component.deletePartType).toHaveBeenCalledWith(jasmine.any(PrimeNGTreeNode));

        });


        it('should delete an element in tree when there is no children', () => {
            let el: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('p-treenode');
            let NodeCount = el.length;

            let node = getNodeBylabel(component.getPrimeNgTree()[0], 'T01'); // T01 node have no child

            component.deletePartType(node);
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelectorAll('p-treenode').length).toBe(NodeCount - 1);

        });

        it('should not delete an element in tree when there is any children', () => {
            let el: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('p-treenode');
            let NodeCount = el.length;

            let node = getNodeBylabel(component.getPrimeNgTree()[0], 'T02'); // T02 node have children

            component.deletePartType(node);
            fixture.detectChanges();

            expect(fixture.nativeElement.querySelectorAll('p-treenode').length).toBe(NodeCount);

        });

        it('should set error message when there is any children', () => {

            spyOn(component, 'addError');

            let node = getNodeBylabel(component.getPrimeNgTree()[0], 'T02'); // T02 node have children

            component.deletePartType(node);
            fixture.detectChanges();

            expect(component.addError).toHaveBeenCalled();
        });



    });


    describe('Edit mode', () => {

        xit('should restore the initial label if end edit mode with the restore flag set to true', () => {

        });

        xit('should set the restore flag to true if we exit edit mode with escape', () => {

        });

        xit('should set the restore flag to true if we exit edit mode and label is empty', () => {

        });

        xit('should set the restore flag to false if we exit edit mode with enter', () => {

        });

        xit('should set the restore flag to false if we exit edit mode by blur', () => {

        });

        xit('should set error message when we exit edit mode en label si empty', () => {

        });





    });
});

