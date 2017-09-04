
import {AngularFireDatabase} from 'angularfire2/database';
import * as firebase from 'firebase/app';
//import 'firebase/datbase';

export class PartCategory {

    private _ignioreFirstAddChildNotification: Set<string> = new Set<string>();

    public id: string;
    public label: string;
    public parent: PartCategory = null;
    public children: PartCategory[] = new Array<PartCategory>();
    public expanded: boolean;
    public editMode: boolean = false;

    private _fbDatabase: AngularFireDatabase;


    constructor(keyOrLabel: string, fbDatabase?: AngularFireDatabase) {


        if (fbDatabase) {
            this._fbDatabase = fbDatabase;
            this.id = keyOrLabel;
            this._initFromFb(keyOrLabel);
        } else {
            this.label = keyOrLabel;
        }


    }



    public addSubCategory(child: PartCategory) {


        //XXX: en cas de ratachement d'un element non lié à la percistance il faut positionner la percistance de façon recurcive

        if (child.parent) { // on détache l'element de sa struture d'origine
            child.deleteCategory();
        }

        if (!child._fbDatabase) { // on connect à la percistance si ce n'est pas déja le cas
            this._addChildToFb(child);
        }

        if (!this.children.find((val) => val.id === child.id)) { // on ajoute uniquement si l'élément n'est pas déja present
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
                let index = this.parent.children.indexOf(this);

                if (index !== -1) {
                    this.parent._removeChildFromFb(this.id);
                    this.releaseFbRessource();

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


    private _initFromFb(key: string) {

        this._fbDatabase.database.ref(`/part-category/${key}`)
            .on('value', (snapshot) => this._onInitAttributeFromFb(snapshot));

        this._fbDatabase.database.ref(`/part-category/sub-category-for/${key}`)
            .on('child_added', (child) => this._onAddChildFromFb(child));
        this._fbDatabase.database.ref(`/part-category/sub-category-for/${key}`)
            .on('child_removed', (child) => this._onRemoveChildFromFb(child));


    }

    private _onInitAttributeFromFb(snapshot: firebase.database.DataSnapshot) {

        if (snapshot.val()) {
            this.label = snapshot.val().label || 'Unknow';
            this.id = snapshot.key;
        }

    }

    private _onAddChildFromFb(childSnapshot: firebase.database.DataSnapshot) {

        // on ajoute le "child" uniquement s'il n'est pas dans la liste des ignorées

        if (!this._ignioreFirstAddChildNotification.has(childSnapshot.key)) {
            let newPartCategory: PartCategory = new PartCategory(childSnapshot.key, this._fbDatabase);

            this.addSubCategory(newPartCategory);

        } else {
            this._ignioreFirstAddChildNotification.delete(childSnapshot.key);
        }

    }

    private _onRemoveChildFromFb(childSnapshot: firebase.database.DataSnapshot) {

        // on ajoute le "child" uniquement s'il n'est pas dans la liste des ignorées
        if (!this._ignioreFirstAddChildNotification.has(childSnapshot.key)) {
            let index = this.children.findIndex((item) => item.id === childSnapshot.key);
            this.children[index].releaseFbRessource();
            this.children[index].parent = undefined;
            this.children.splice(index, 1);
        } else {
            this._ignioreFirstAddChildNotification.delete(childSnapshot.key);
        }
    }

    private releaseFbRessource() {
        this._fbDatabase.database.ref(`/part-category/${this.id}`)
            .off('value', (snapshot) => this._onInitAttributeFromFb(snapshot));

        this._fbDatabase.database.ref(`/part-category/sub-category-for/${this.id}`)
            .off('child_added', (child) => this._onAddChildFromFb(child));
        this._fbDatabase.database.ref(`/part-category/sub-category-for/${this.id}`)
            .off('child_removed', (child) => this._onRemoveChildFromFb(child));

        this._fbDatabase = undefined;
    }

    private _removeChildFromFb(key: string) {

        // ajout dans la liste des ignorés de la 1ere notification "add_child" du parent
        // L'element est créé dans cette instance de l'application la notification de FB ne
        // doit donc pas être prise en compte
        this._ignioreFirstAddChildNotification.add(key);



        this._fbDatabase.database.ref(`/part-category/sub-category-for/${this.id}/${key}`).remove();
        this._fbDatabase.database.ref(`/part-category/${key}`).remove();

    }

    private _addChildToFb(child: PartCategory) {
        let newChildRef = this._fbDatabase.database.ref(`/part-category`).push({label: child.label});


        child.id = newChildRef.key;
        child._fbDatabase = this._fbDatabase;
        child._initFromFb(newChildRef.key);

        // ajout dans la liste des ignorés de la 1ere notification "add_child" du parent
        // L'element est créé dans cette instance de l'application la notification de FB ne
        // doit donc pas être prise en compte
        this._ignioreFirstAddChildNotification.add(newChildRef.key);

        newChildRef.parent.child(`/sub-category-for/${this.id}/${newChildRef.key}`).set(true);

    }
}


