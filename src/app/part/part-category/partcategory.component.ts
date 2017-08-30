

import {MessagesService} from '../../shared/messages/messages.service';
import {PartService} from '../services/part.service';
import {TreeNode} from 'primeng/primeng';
import {Component, OnInit, Input} from '@angular/core';
import {PartCategory} from '../../model/part-category';






@Component({
    selector: 'pm-partcategory',
    templateUrl: './partcategory.component.html',
    styleUrls: ['./partcategory.component.scss']
})
export class PartCategoryComponent implements OnInit {


    private _partCategoryTree: PartCategory[];
    private service: PartService;
    private _msgService: MessagesService;
    private _saveEditedLabel: string;


    constructor(service: PartService, msgService: MessagesService) {
        this.service = service;
        this._msgService = msgService;

    }

    ngOnInit() {



        this._partCategoryTree = [this.service.getPartCategoryRoot()];

    }

    public addSubType(node: PartCategory) {
        let newNode: PartCategory = node.addSubCategory('nouveau type');
        this.setEditMode(newNode, true);
    }

    public deletePartType(partType: PartCategory) {

        try {
            if (partType) {
                partType.deleteCategory();
            }
        } catch (e) {
            this.addError((e as Error).message);
        }

    }


    public addError(message: string) {
        this._msgService.addMessage(message);

    }

    public cancelEditMode(node: PartCategory) {
        this.setEditMode(node, false, true);
    }

    public validateAndExitEditMode(node: PartCategory) {
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
    public setEditMode(node: PartCategory, edit: boolean, restoreLabel: boolean = false) {

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
    public getPrimeNgTree(): PartCategory[] {

        return this._partCategoryTree;
    }

    /**
     * Fonction interne effectuant de façon récurcive la tranformation de
     * l'arbre des composants (PartType)
     */
    /*  private transformPartType2PrimeNGTreeNode(toTransform: PartType, parent: TreeNode = null): PartCategory {
          let ret: PartCategory;

          if (toTransform != null) {
              ret = new PartCategory();
              ret.label = toTransform.name;



              if (toTransform.children.length > 0) {
                  ret.expanded = true;


                  for (let partType of toTransform.children) {
                      let subElem: PartCategory = this.transformPartType2PrimeNGTreeNode(partType, ret);
                      // subElem.parent = ret;

                      ret.children.push(subElem);
                  }
              }

          }



          return ret;
      }
  */

}
