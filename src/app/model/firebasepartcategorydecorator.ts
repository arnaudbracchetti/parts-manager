

import { PartCategoryDecorator, PartCategory } from './part-category';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
//import 'firebase/datbase';



export class FirebasePartCategoryDecorator extends PartCategoryDecorator {

    private _fbDatabase: AngularFireDatabase;
    private _ignioreFirstAddChildNotification: Set<string> = new Set<string>();
    private _percitencyInitialized: boolean = false;

    get parent(): FirebasePartCategoryDecorator {
        if (this._decorated.parent) {
            return this._decorated.parent._decorator as FirebasePartCategoryDecorator;
        } else {
            return undefined;
        }
    }


    constructor(fb: AngularFireDatabase) {
        super();

        this._fbDatabase = fb;
    }


    public setPercistency(key: string): void {
        this._decorated.id = key;
        this._initFromFb(key);
    }
    public unsetPercistency(): void {
        this.releaseFbRessource();
    }
    public isPercistent(): boolean {
        return this._percitencyInitialized;
    }
    public load(): void {
        throw new Error('Method not implemented.');
    }


    public save(): void {

        if (this.isPercistent()) {
            this._fbDatabase.database.ref(`/part-category/${this._decorated.id}`).set({ label: this._decorated.label });
        } else {
            let saved: firebase.database.ThenableReference =
                this._fbDatabase.database.ref(`/part-category/`).push({ label: this._decorated.label });

            this._decorated.id = saved.key;
            this._initFromFb(this._decorated.id);
        }
    }


    public remove(): void {

        if (this.isPercistent()) {
            this.detachParent();

            this._fbDatabase.database.ref(`/part-category/${this._decorated.id}`).remove();
            this._fbDatabase.database.ref(`/part-category/sub-category-for/${this._decorated.id}`).remove();

            this.unsetPercistency();
        }
    }


    public attachParent(): void {

        if (this.isPercistent()) {
            if (this.parent) {
                this._fbDatabase.database.ref(
                    `/part-category/sub-category-for/${this._decorated.parent.id}/${this._decorated.id}`).once('value').then((snapshot) => {
                        if (!snapshot.exists()) {
                            // si l'attachement au parent existe dans la base de données on ne fait rien (on est dans le cas du
                            // chargement intial. il ne faut donc pas genrer d'evt supplèmentaires)
                            this.parent._ignioreFirstAddChildNotification.add(this._decorated.id);
                            this._fbDatabase.database.ref(
                                `/part-category/sub-category-for/${this._decorated.parent.id}/${this._decorated.id}`).set(true);
                        }
                    });

            } else {
                throw new Error(`Parent not defined on PartCategory ${this._decorated.id} `);
            }
        }


    }
    public detachParent(): void {
        if (this.isPercistent()) {
            // ajout dans la liste des ignorés de la 1ere notification "remove_child" du parent
            // L'element est créé dans cette instance de l'application la notification de FB ne
            // doit donc pas être prise en compte
            if (this.parent) {
                this.parent._ignioreFirstAddChildNotification.add(this._decorated.id);
                this._fbDatabase.database.ref(
                    `/part-category/sub-category-for/${this._decorated.parent.id}/${this._decorated.id}`).remove();
            } else {
                throw new Error(`Parent not defined on PartCategory ${this._decorated.id} `);
            }
        }
    }


    /**
     * Met en place les callback permettant le chargement et la mise à jour de l'objet
     * à partir des données de la base firebase
     */
    private _initFromFb(key: string) {

        this._fbDatabase.database.ref(`/part-category/${key}`)
            .on('value', (snapshot) => this._onInitAttributeFromFb(snapshot));

        this._fbDatabase.database.ref(`/part-category/sub-category-for/${key}`)
            .on('child_added', (child) => this._onAddChildFromFb(child));
        this._fbDatabase.database.ref(`/part-category/sub-category-for/${key}`)
            .on('child_removed', (child) => this._onRemoveChildFromFb(child));

        this._percitencyInitialized = true;

        console.log(this._ignioreFirstAddChildNotification);
    }


    /**
     * initialise tous les attributs en réponse à une modification de la base de données
     */
    private _onInitAttributeFromFb(snapshot: firebase.database.DataSnapshot) {

        if (snapshot.val()) {
            this._decorated.label = snapshot.val().label || '';
            this._decorated.id = snapshot.key;
        }

    }

    /**
     * Ajoute un enfant en réponse à une modification de la base de données
     */
    private _onAddChildFromFb(childSnapshot: firebase.database.DataSnapshot) {

        // on ajoute le "child" uniquement s'il n'est pas dans la liste des ignorées

        if (!this._ignioreFirstAddChildNotification.has(childSnapshot.key)) {
            //FIXME: A revoir avec l'injection de dependances
            let newPartCategory: PartCategory = new PartCategory(new FirebasePartCategoryDecorator(this._fbDatabase), childSnapshot.key, );

            this._decorated.addSubCategory(newPartCategory);

        } else {
            this._ignioreFirstAddChildNotification.delete(childSnapshot.key);
        }

    }

    /**
     * Supprime un enfant en réponse à une modification de la base de données
     */
    private _onRemoveChildFromFb(childSnapshot: firebase.database.DataSnapshot) {

        // on ajoute le "child" uniquement s'il n'est pas dans la liste des ignorées
        if (!this._ignioreFirstAddChildNotification.has(childSnapshot.key)) {

            let index = this._decorated.children.findIndex((item) => item.id === childSnapshot.key);
            this._decorated.children[index].deleteCategory();
        } else {
            this._ignioreFirstAddChildNotification.delete(childSnapshot.key);
        }
    }

    private releaseFbRessource() {
        this._fbDatabase.database.ref(`/part-category/${this._decorated.id}`)
            .off('value', (snapshot) => this._onInitAttributeFromFb(snapshot));

        this._fbDatabase.database.ref(`/part-category/sub-category-for/${this._decorated.id}`)
            .off('child_added', (child) => this._onAddChildFromFb(child));
        this._fbDatabase.database.ref(`/part-category/sub-category-for/${this._decorated.id}`)
            .off('child_removed', (child) => this._onRemoveChildFromFb(child));

        this._percitencyInitialized = false;
    }



}

