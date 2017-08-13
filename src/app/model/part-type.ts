

export class PartType {
    protected _id: number;
    public name: string;
    protected _children: Array<PartType>;
    protected _parent: PartType;

    private _ChildIdCouter: number;


    /**
     * Crée un élément avec un id unique pour son niveau de hérarchie
     *
     * Le nouvel Id est égal à l'Id max de ce niveau de hérarchie +1
     */

    constructor(name: string, parent: PartType = null) {
        this._children = new Array<PartType>();
        this._parent = parent;
        this._ChildIdCouter = 0;
        this.name = name;

        if (parent != null) {
            this._id = parent._ChildIdCouter++;
        } else {
            this._id = 0;
        }



    }


    get parent() {
        return this._parent;
    }

    /**
     * Retourne un identifiant agrégant les identifiant de l'élement
     * et de tous ces parents
     */
    public get completeId(): string {
        let ret = '';

        if (this._parent === null) {
            return this.innerId;

        } else {
            return this._parent.completeId + '-' + this.innerId;
        }

    }

    /**
     * retourne l'identifiant interne de l'élément
     */
    public get innerId(): string {
        return this._id.toString();

    }

    public get children(): PartType[] {
        return this._children;
    }



    /**
     * Ajoute un fils à la hierarchie et retourne l'élément ajouté
     */
    public addSubType(name: string): PartType {
        let newPartType = new PartType(name, this);
        this._children.push(newPartType);

        return newPartType;
    }

    public deleteChild(id: string): PartType {

        let count = 0;
        let found = false;

        for (let partType of this._children) {
            if (partType.innerId === id) {
                found = true;
                break;
            }

            count++;
        }

        console.log(count);

        if (found) {
            return this._children.splice(count, 1)[0];
        } else {
            return null;
        }



    }




}





