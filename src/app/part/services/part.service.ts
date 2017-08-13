import {Part} from '../../model/part';
import {PartType} from '../../model/part-type';
import {Injectable} from '@angular/core';

@Injectable()
export class PartService {


    public parts: Part[];

    constructor() {
        this.parts = this.loadParts();
    }

    public loadParts(): Part[] {
        this.parts = new Array<Part>();

        return this.parts;
    }

    public getAllParts(): Part[] {
        this.loadParts();

        return this.parts;
    }

    public addPart(part: Part): Part[] {
        this.parts.push(part);
        return this.parts;
    }

    public getPartTypeTree(): PartType {
        let root: PartType, T00: PartType, T01: PartType, T02: PartType, T020: PartType, T021: PartType;
        let T022: PartType, T0210: PartType, T0211: PartType;


        root = new PartType('root');              // root
        T00 = root.addSubType('T00');            //   T00
        T01 = root.addSubType('T01');            //   T01
        T02 = root.addSubType('T02');            //   T02
        T020 = T02.addSubType('T020');            //     T020
        T021 = T02.addSubType('T021');            //     T021
        T0210 = T021.addSubType('T0210');          //       T0210
        T0211 = T021.addSubType('T0211');          //       T0211
        T022 = T02.addSubType('T022');            //     T022

        return root;

    }

}
