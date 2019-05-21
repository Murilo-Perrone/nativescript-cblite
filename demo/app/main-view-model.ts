import { Observable } from 'tns-core-modules/data/observable';
import { CBLite, Replicator, Utils } from 'nativescript-cblite';

export class HelloWorldModel extends Observable {
  public message: string;

  constructor() {
    super();
    // Do your tests here
    this.message = Utils.startCBLListener();
  }
}
