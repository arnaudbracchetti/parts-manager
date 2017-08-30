


export class PartCategory {

    public label: string;
    public parent: PartCategory = null;
    public children: PartCategory[] = new Array<PartCategory>();
    public expanded: boolean;
    public editMode: boolean = false;

    constructor(label: string) {
        this.label = label;
    }

    public addSubCategory(label: string): PartCategory {
        let newNode: PartCategory = new PartCategory(label);
        this.children.push(newNode);
        this.expanded = true;

        return newNode;
    }

    public deleteCategory() {

        if (this.children.length === 0) {
            if (this.parent) {
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
