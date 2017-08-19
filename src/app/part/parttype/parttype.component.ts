import {PartType} from '../../model/part-type';
import {PartService} from '../services/part.service';
import {TreeNode} from 'primeng/primeng';
import {Component, OnInit, Input} from '@angular/core';


export class PrimeNGTreeNode {

    public label: string;
    public parent: PrimeNGTreeNode = null;
    public children: PrimeNGTreeNode[] = new Array<PrimeNGTreeNode>();
    public expanded: boolean;
    public editMode: boolean = false;

    constructor() {

    }

    public addSubNode(label: string): PrimeNGTreeNode {
        let newNode: PrimeNGTreeNode = new PrimeNGTreeNode();
        newNode.label = label;
        this.children.push(newNode);
        this.expanded = true;

        return newNode;
    }

    public deleteNode() {

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



@Component({
    selector: 'ms-parttype',
    templateUrl: './parttype.component.html',
    styleUrls: ['./parttype.component.scss']
})
export class ParttypeComponent implements OnInit {


    private _primeNGTree: PrimeNGTreeNode[];
    private service: PartService;
    private _saveEditedLabel: string;


    constructor(service: PartService) {
        this.service = service;

    }

    ngOnInit() {



        this._primeNGTree = [this.transformPartType2PrimeNGTreeNode(this.service.getPartTypeTree())];

    }

    public addSubType(node: PrimeNGTreeNode) {
        let newNode: PrimeNGTreeNode = node.addSubNode('nouveau type');
        this.setEditMode(newNode, true);
    }

    public deletePartType(partType: PrimeNGTreeNode) {

        try {
            if (partType) {
                partType.deleteNode();
            }
        } catch (e) {
            this.addError((e as Error).message);
        }

    }


    public addError(message: string) {

    }

    public cancelEditMode(node: PrimeNGTreeNode) {
        this.setEditMode(node, false, true);
    }

    public validateAndExitEditMode(node: PrimeNGTreeNode) {
        if (!node.label) {
            // error : label can't be empty
            this.addError('Part type can\'t be empty');
            this.setEditMode(node, false, true);
        } else {
            this.setEditMode(node, false);
        }
    }




    /**
     * Manage edit mode for a node
     * param :
     * node : the node to manage
     * edit : edit mode (true: enter edit mode / false: exit edit mode)
     * restoreLabel : set to true to restor initial label when exiting edit mode
     */
    public setEditMode(node: PrimeNGTreeNode, edit: boolean, restoreLabel: boolean = false) {

        if (edit === true) {
            // save label when enter in edit mode
            this._saveEditedLabel = node.label;
        }

        if (edit === false && restoreLabel === true) {
            // need to restore label before exit edit mode
            node.label = this._saveEditedLabel;
        }

        node.editMode = edit;

    }



    /**
     * retourne un tableau contenant la représentation de l'arbre des types de composants (PartTypeTree)
     * au format demandé par le composant Tree de PrimeNG
     */
    public getPrimeNgTree(): PrimeNGTreeNode[] {

        return this._primeNGTree;
    }

    /**
     * Fonction interne effectuant de façon récurcive la tranformation de
     * l'arbre des composants (PartType)
     */
    private transformPartType2PrimeNGTreeNode(toTransform: PartType, parent: TreeNode = null): PrimeNGTreeNode {
        let ret: PrimeNGTreeNode;

        if (toTransform != null) {
            ret = new PrimeNGTreeNode();
            ret.label = toTransform.name;



            if (toTransform.children.length > 0) {
                ret.expanded = true;


                for (let partType of toTransform.children) {
                    let subElem: PrimeNGTreeNode = this.transformPartType2PrimeNGTreeNode(partType, ret);
                    // subElem.parent = ret;

                    ret.children.push(subElem);
                }
            }

        }



        return ret;
    }


}
