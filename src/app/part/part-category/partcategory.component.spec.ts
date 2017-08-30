import {PartCategory} from '../../model/part-category';
import {MessagesService} from '../../shared/messages/messages.service';
import {FocusDirective} from '../../shared/focus/focus.directive';
import {PartService} from '../services/part.service';
import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {PartCategoryComponent} from './partcategory.component';

import {TreeModule} from 'primeng/primeng';

import {TreeNode} from 'primeng/primeng';
import {ForOfStatement} from 'typescript';

/**
 * Fonctions utilitaire pour les tests du composant
 */
function testUtil_getNodeBylabel(root: PartCategory, label: string): PartCategory {

    let ret = null;

    if (root.label === label) {
        ret = root;
    } else {
        for (let item of root.children) {

            ret = testUtil_getNodeBylabel(item, label);

            if (ret !== null) {
                break;
            }

        }
    }

    return ret;
}

function testUtil_getDeleteButton(fixture: ComponentFixture<PartCategoryComponent>, label: string): HTMLElement {
    return fixture.nativeElement.querySelector(`p-treenodetemplateloader[ng-reflect-node=T01]~div #deleteButton`);
}

function testUtil_getAddButton(fixture: ComponentFixture<PartCategoryComponent>, label: string): HTMLElement {
    return fixture.nativeElement.querySelector(`p-treenodetemplateloader[ng-reflect-node=T01]~div #addButton`);
}

function testUtil_getEditedNodeInput(fixture: ComponentFixture<PartCategoryComponent>): HTMLInputElement {
    return fixture.nativeElement.querySelector(`input#editNode`);
}

function testUtil_getUiNodeCount(fixture: ComponentFixture<PartCategoryComponent>): number {
    return fixture.nativeElement.querySelectorAll('p-treenode').length;
}


/**
 * Début des tests
 */

describe('ParttypeComponent', () => {
    let component: PartCategoryComponent;
    let fixture: ComponentFixture<PartCategoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PartCategoryComponent, FocusDirective],
            imports: [TreeModule, FormsModule],
            providers: [PartService, MessagesService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PartCategoryComponent);
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
        // let addButton: HTMLElement;




        it('should call addSubType() when add button is clicked', () => {

            spyOn(component, 'addSubType');


            testUtil_getAddButton(fixture, 'T02').click();
            fixture.detectChanges();

            expect(component.addSubType).toHaveBeenCalled();


        });

        it('should add a new node when add button is clicked', () => {

            let NodeCount = testUtil_getUiNodeCount(fixture);

            testUtil_getAddButton(fixture, 'T01').click();
            fixture.detectChanges();

            // On doit avoir un noeud de plus
            expect(testUtil_getUiNodeCount(fixture)).toBe(NodeCount + 1, 'We must have one more node');



        });

        it('should set the new element in edit mode', () => {

            testUtil_getAddButton(fixture, 'T02').click();
            fixture.detectChanges();


            let el = testUtil_getEditedNodeInput(fixture);


            expect(el).toBeTruthy('One node must be in edit mode');
        });
    });




    describe('Delete element in tree', () => {



        it('should call deletePartType() when delete button is clked', () => {

            let el: HTMLElement = testUtil_getDeleteButton(fixture, 'T02');
            spyOn(component, 'deletePartType');

            el.click();
            fixture.detectChanges();

            expect(component.deletePartType).toHaveBeenCalledWith(jasmine.any(PartCategory));

        });


        it('should delete an element in tree when there is no children', () => {

            let NodeCount = testUtil_getUiNodeCount(fixture);

            let node = testUtil_getNodeBylabel(component.getPrimeNgTree()[0], 'T01'); // T01 node have no child

            component.deletePartType(node);
            fixture.detectChanges();

            expect(testUtil_getUiNodeCount(fixture)).toBe(NodeCount - 1);

        });

        it('should not delete an element in tree when there is any children', () => {

            let NodeCount = testUtil_getUiNodeCount(fixture);

            let node = testUtil_getNodeBylabel(component.getPrimeNgTree()[0], 'T02'); // T02 node have children

            component.deletePartType(node);
            fixture.detectChanges();

            expect(testUtil_getUiNodeCount(fixture)).toBe(NodeCount);

        });

        it('should set error message when there is any children', () => {

            spyOn(component, 'addError');

            let node = testUtil_getNodeBylabel(component.getPrimeNgTree()[0], 'T02'); // T02 node have children

            component.deletePartType(node);
            fixture.detectChanges();

            expect(component.addError).toHaveBeenCalled();
        });



    });


    describe('Edit mode', () => {

        let input: HTMLInputElement;

        beforeEach(() => {

            testUtil_getAddButton(fixture, 'T02').click();
            fixture.detectChanges();

            input = testUtil_getEditedNodeInput(fixture);

            spyOn(component, 'setEditMode').and.callThrough();
            spyOn(component, 'addError');



        });

        it('should restore the initial label when end edit mode with the restore flag set to true', () => {
            let test: PartCategory = testUtil_getNodeBylabel(component.getPrimeNgTree()[0], 'T01');
            let initialLabel = test.label;


            component.setEditMode(test, true);
            test.label = 'changed';
            component.setEditMode(test, false, true);

            expect(test.label).toBe(initialLabel, 'node label shoulnot change');

        });

        it('should set the restore param to true without error if we exit edit mode with escape', () => {



            input.dispatchEvent(new KeyboardEvent('keyup', {key: 'Escape'}));
            fixture.detectChanges();

            expect(component.setEditMode).toHaveBeenCalledTimes(2);
            expect(component.setEditMode).toHaveBeenCalledWith(jasmine.any(PartCategory), false, true);
            expect(component.addError).not.toHaveBeenCalled();

        });

        it('should set the restore param to true with error if we exit edit mode by hitting enter and label is empty', fakeAsync(() => {


            input.value = '';
            input.dispatchEvent(new Event('input'));
            tick();
            fixture.detectChanges();



            input.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter'}));
            fixture.detectChanges();



            expect(component.setEditMode).toHaveBeenCalledTimes(1);
            expect(component.setEditMode).toHaveBeenCalledWith(jasmine.any(PartCategory), false, true);
            expect(component.addError).toHaveBeenCalled();


        }));

        it('should set the restore param to true with error if we exit edit mode by blur and label is empty', fakeAsync(() => {

            input.value = '';
            input.dispatchEvent(new Event('input'));
            tick();
            fixture.detectChanges();

            input.blur();
            fixture.detectChanges();

            expect(component.setEditMode).toHaveBeenCalledTimes(1);
            expect(component.setEditMode).toHaveBeenCalledWith(jasmine.any(PartCategory), false, true);
            expect(component.addError).toHaveBeenCalled();


        }));

        it('should set the restore param to false without error if we exit edit mode with enter and label not empty', () => {

            input.value = 'new node';
            input.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter'}));
            fixture.detectChanges();

            expect(component.setEditMode).toHaveBeenCalledTimes(1);
            expect(component.setEditMode).toHaveBeenCalledWith(jasmine.any(PartCategory), false);
            expect(component.addError).not.toHaveBeenCalled();

        });

        xit('should set the restore param to false without error if we exit edit mode by blur and label not empty', () => {


            input.value = 'new node';
            input.blur();
            fixture.detectChanges();

            expect(component.setEditMode).toHaveBeenCalledTimes(1);
            expect(component.setEditMode).toHaveBeenCalledWith(jasmine.any(PartCategory), false);
            expect(component.addError).not.toHaveBeenCalled();
        });







    });
});

