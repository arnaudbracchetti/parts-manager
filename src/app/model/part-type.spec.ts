
// import {PartType} from './part-type';


import {PartType} from './part-type';


describe('Class PartType', () => {
    let root: PartType, T00: PartType, T01: PartType, T02: PartType, T020: PartType, T021: PartType;
    let T022: PartType, T0210: PartType, T0211: PartType;


    beforeEach(() => {
        root = new PartType('root');              // root
        T00 = root.addSubType('T00');            //   T00
        T01 = root.addSubType('T01');            //   T01
        T02 = root.addSubType('T02');            //   T02
        T020 = T02.addSubType('T020');            //     T020
        T021 = T02.addSubType('T021');            //     T021
        T0210 = T021.addSubType('T0210');          //       T0210
        T0211 = T021.addSubType('T0211');          //       T0211
        T022 = T02.addSubType('T022');            //     T022


    });

    describe('Creation', () => {

        it('should create a partType with an id = "0"', () => {
            let test = new PartType('test');
            expect(test.innerId).toBe('0');
        });

        it('should be initialized with correct name', () => {
            let test = new PartType('test');
            expect(test.name).toBe('test');
        });
    });

    describe('addSubType', () => {
        it('should add child with correct name', () => {
            let root1 = new PartType('test');
            let test = root1.addSubType('child');

            expect(root1.children[0]).toBeTruthy();
            expect(test.name).toBe('child');
        });
    });

    describe('deleteChild', () => {
        it('should delete partType with the specified Id', () => {

            expect(T021.children.length).toBe(2);
            expect(T021.children).toContain(T0211);
            T021.deleteChild(T0211.innerId);
            expect(T021.children.length).toBe(1);
            expect(T021.children).not.toContain(T0211);

        });

        it('should return the deleted partType', () => {
            let deleted = T02.deleteChild(T020.innerId);
            expect(deleted).toBe(T020);
        });

        it('should return null if the specified Id is not prensent', () => {
            let deleted = T02.deleteChild('Unknow id');
            expect(deleted).toBeNull();
        });



    });



    describe('Id management', () => {
        it('should affect a différent Id to each element at same level', () => {

            expect(T00.innerId).not.toBe(T01.innerId);
            expect(T00.innerId).not.toBe(T02.innerId);
            expect(T01.innerId).not.toBe(T02.innerId);

            expect(T020.innerId).not.toBe(T021.innerId);
            expect(T021.innerId).not.toBe(T022.innerId);


        });

        it('should not reuse id form a deleted element', () => {

            root.deleteChild(T02.innerId);
            root.deleteChild(T01.innerId);

            let test = root.addSubType('test');
            expect(test.innerId).not.toBe(T02.innerId);
            expect(test.innerId).not.toBe(T01.innerId);



        });


    });



    describe('compelteId should retrun an id for all the hirarchie', () => {

        it('should return an id whith 1 section if there is no parent', () => {
            let toTest: PartType = new PartType('test');

            expect(toTest.completeId.split('-').length).toBe(1);

        });

        it('should return an id whith 2 sections if there is one level of hirarchie', () => {

            expect(T01.completeId.split('-').length).toBe(2);
            expect(T01.completeId.split('-')[0]).toBe(root.innerId);
            expect(T01.completeId.split('-')[1]).toBe(T01.innerId);
        });



        it('should return a completeId of 0-2-1-0', () => {


            expect(T0210.completeId).toBe('0-2-1-0');
        });



    });

});
