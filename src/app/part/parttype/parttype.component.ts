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
}



@Component({
    selector: 'ms-parttype',
    templateUrl: './parttype.component.html',
    styleUrls: ['./parttype.component.css']
})
export class ParttypeComponent implements OnInit {


    private _primeNGTree: PrimeNGTreeNode[];
    private service: PartService;


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


    public setEditMode(node: PrimeNGTreeNode, edit: boolean) {
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
