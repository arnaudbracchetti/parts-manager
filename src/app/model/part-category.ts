
import { Injectable } from '@angular/core';



export abstract class PartCategoryDecorator {
    protected _decorated: PartCategory;



    constructor() {
    }

    set decorated(val: PartCategory) { this._decorated = val; }

    public abstract setPercistency(key: string): void;
    public abstract unsetPercistency(): void;
    public abstract isPercistent(): boolean;

    public abstract load(): void;
    public abstract save(): void;
    public abstract remove(): void;

    public abstract attachParent(): void;
    public abstract detachParent(): void;

}

export abstract class PartCategoryFactory {
    public abstract create(key?: string);
}

export class PartCategory {


    public _decorator: PartCategoryDecorator;

    private _id: string;
    private _label: string;
    private _parent: PartCategory = null;
    private _children: PartCategory[] = new Array<PartCategory>();
    public expanded: boolean;
    public editMode: boolean = false;


    constructor(decorator: PartCategoryDecorator, key?: string, ) {

        this._decorator = decorator;
        this._decorator.decorated = this;

        if (key) {
            this._decorator.setPercistency(key);
        } else {
            this.label = '<Undefined>';
        }


    }



    get id(): string { return this._id; }
    set id(val: string) { this._id = val; }

    get label(): string { return this._label; }
    set label(val: string) {
        this._label = val;
        if (this._decorator.isPercistent()) { this._decorator.save(); }
    }

    get parent(): PartCategory { return this._parent; }
    set parent(val: PartCategory) {
        if (this._parent !== val) {
            if (this._parent && this._decorator.isPercistent()) { this._decorator.detachParent(); }
            this._parent = val;
            if (this._parent && this._decorator.isPercistent()) { this._decorator.attachParent(); }
        }
    }

    get children(): PartCategory[] { return this._children; }



    public addSubCategory(child: PartCategory) {


        //XXX: en cas de ratachement d'un element non lié à la percistance il faut positionner la percistance de façon recurcive



        if (!this.children.find((val) => val.id === child.id)) { // on ajoute uniquement si l'élément n'est pas déja present

            if (this._decorator.isPercistent() && !child._decorator.isPercistent()) {
                // Le "save()" permet de rentre le fils percistent s'il ne l'était pas encore
                child._decorator.save();
            }


            this.children.push(child);
            child.parent = this;
            this.expanded = true;

        } else {
            throw (new Error('You can\'t add add same element twice in chid list'));
        }




    }

    public deleteCategory() {

        if (this.children.length === 0) {
            if (this.parent) {
                this._decorator.remove();

                let index = this.parent.children.indexOf(this);

                if (index !== -1) {

                    this.parent.children.splice(index, 1);
                    this.parent = undefined;
                }
            }
        } else {
            throw new Error();
        }
    }

    toString() {
        return this.label;
    }

}


