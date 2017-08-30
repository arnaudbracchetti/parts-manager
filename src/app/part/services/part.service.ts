import {Part} from '../../model/part';
import {PartCategory} from '../../model/part-category';
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

    public getPartCategoryRoot(): PartCategory {
        let root: PartCategory, T00: PartCategory, T01: PartCategory, T02: PartCategory, T020: PartCategory, T021: PartCategory;
        let T022: PartCategory, T0210: PartCategory, T0211: PartCategory;


        root = new PartCategory('root');              // root
        T00 = root.addSubCategory('T00');            //   T00
        T01 = root.addSubCategory('T01');            //   T01
        T02 = root.addSubCategory('T02');            //   T02
        T020 = T02.addSubCategory('T020');            //     T020
        T021 = T02.addSubCategory('T021');            //     T021
        T0210 = T021.addSubCategory('T0210');          //       T0210
        T0211 = T021.addSubCategory('T0211');          //       T0211
        T022 = T02.addSubCategory('T022');            //     T022

        return root;

    }

}
