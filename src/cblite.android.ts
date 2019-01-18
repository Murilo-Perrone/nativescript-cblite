import * as utils from 'tns-core-modules/utils/utils';

import { Common } from './cblite.common';

declare let com: any;
declare let java: any;

export interface Document {
  delete();
  getCurrentRevision();
  getCurrentRevisionId();
  getDatabase();
  getId();
  getProperties();
  getProperty(key: string);
  isDeleted();
  putProperties(data: any);
}

export interface Replication {
  addChangeListener(changeListener: any);
  deleteCookie(name: string);
  getAuthenticator();
  getRemoteUrl();
  getStatus();
  isContinuous();
  isPull();
  isRunning();
  restart();
  setAuthenticator(authenticator: any);
  setCookie(name: string, value: string, path: string, expirationDate: any, secure: boolean, httpOnly: boolean);
  setContinuous(continuous: boolean);
  setDocIds(docIds: any);
  start();
  stop();
}

export interface Database {
  addChangeListener(listener: any);
  close();
  createDocument();
  createPullReplication(url: any);
  createPushReplication(url: any);
  delete();
  exists();
  getAllDocs(options: any);
  getAllReplications();
  getDocument(documentId: string);
  getDocumentCount();
  getExistingDocument(documentId: string);
  getExistingLocalDocument(documentId: string);
}

export interface Manager {
  allOpenDatabases();
  forgetDatabase();
  getAllDatabaseNames();
  getContext();
  getDatabase(name: string, mustExist?: boolean);
}

enum NATIVE_TYPES {
  Document = <any>'com.couchbase.lite.Document',
  HashMap = <any>'java.util.LinkedHashMap',
  ArrayList = <any>'java.util.ArrayList'
}

export class Utils {
  static getApplicationContext(): any {
    return utils.ad.getApplicationContext();
  }

  static objectToMap(data: Object) {
    try {
      const gson = new com.google.gson.Gson()
      return gson.fromJson(JSON.stringify(data), (new java.util.HashMap).getClass());
    } catch (e) {
      console.error('Failed to convert Object to Map', e.message);
      throw new Error('Failed to convert Object to Map ' + e.message);
    }
  }

  static resolveMap(data: any) {
    
  }

  static mapToObject(data: any, recursive?: boolean) {
    const gson = new com.google.gson.Gson()
    return JSON.parse(gson.toJson(JSON.stringify(data), (new java.util.HashMap).getClass()));
    // try {
    //   if (data) {
    //     if (!recursive && !data.getProperties())
    //       return {};
    //     const docContent: Object = {};
    //     const className = data.getClass().getName();
    //     let entrySet;
    //     if (recursive) {
    //       if (className == NATIVE_TYPES.HashMap) {
    //         console.log('ClassType', NATIVE_TYPES.HashMap);
    //         entrySet = data.entrySet();
    //       }
    //       if (className == NATIVE_TYPES.ArrayList) {
    //         console.log('ClassType', NATIVE_TYPES.ArrayList);
    //         entrySet = data;
    //       }
    //     } else {
    //       entrySet = data.getProperties().entrySet();
    //     }
    //     for (let prop of entrySet.toArray()) {
    //       if (prop.getClass().getName() == NATIVE_TYPES.ArrayList) {
    //         let propList = [];
    //         for (let subProp of prop) {
    //           let _subProp;
    //           if (this.isMap(subProp) || this.isArrayList(subProp))
    //             _subProp = this.mapToObject(subProp, true);
    //           propList.push(_subProp);
    //         }
    //         return propList;
    //       }
    //       let key = prop.getKey();
    //       let value = prop.getValue();
    //       if (this.isMap(value) || this.isArrayList(value))
    //         value = this.mapToObject(value, true);
    //       docContent[key] = value;
    //     }
    //     return docContent;
    //   } else {
    //     return {}
    //   }
    // } catch (e) {
    //   console.error('Failed to convert Map to Object', e.message);
    //   throw new Error('Failed to convert Map to Object ' + e.message)
    // }
  }

  static isDocument(data: any): boolean {
    if (!data.getClass())
      return false;
    const className = data.getClass().getName();
    return className == NATIVE_TYPES.Document;
  }

  static isMap(data: any): boolean {
    if (!data.getClass())
      return false;
    const className = data.getClass().getName();
    return className == NATIVE_TYPES.HashMap;
  }

  static isArrayList(data: any): boolean {
    if (!data.getClass())
      return false;
    const className = data.getClass().getName();
    return className == NATIVE_TYPES.ArrayList;
  }
}

export class Replicator {

  private replicator: Replication;

  constructor(replicator: Replication) {
    this.replicator = replicator;
  }

  public start(): void {
    this.replicator.start();
  }

  public stop(): void {
    this.replicator.stop();
  }

  public isRunning(): boolean {
    return this.replicator.isRunning();
  }

  public addReplicationChangeListener(changeListener): void {
    this.replicator.addChangeListener(changeListener);
  }

  public setAuthenticator(username: string, password: string): void {
    this.replicator.setAuthenticator(
      new com.couchbase.lite.auth.BasicAuthenticator(username, password)
    );
  }

  public setContinuous(continuous: boolean): void {
    this.replicator.setContinuous(continuous);
  }

  public setDocumentIds(docs: string[]): void {
    const list = new java.util.ArrayList();
    docs.forEach(doc => list.add(doc));
    this.replicator.setDocIds(list);
  }

  public setCookie(
    name: string,
    value: string,
    path: string,
    expirationDate: Date,
    secure: boolean,
    httpOnly: boolean
  ): void {
    let date = new java.util.Date(expirationDate.getTime());
    this.replicator.setCookie(name, value, path, date, secure, httpOnly);
  };

  public deleteCookie(name: string): void {
    this.replicator.deleteCookie(name);
  }
}

export class CBLite extends Common {

  private context: any;
  private database: Database;
  private manager: Manager;

  constructor(databaseName: string) {
    super(databaseName);
    this.context = Utils.getApplicationContext();
    try {
      this.manager = new com.couchbase.lite.Manager(
        new com.couchbase.lite.android.AndroidContext(this.context),
        null
      );
      this.database = this.manager.getDatabase(databaseName);
    } catch (e) {
      console.error('Failed to create manager', e.message);
      throw new Error('Failed to create manager ' + e.message);
    }
  }

  public getDocument(documentId: string): Object {
    const document: Document = this.database.getDocument(documentId);
    try {
      if (!Utils.isMap(document))
        return {};
      return Utils.mapToObject(document);
    } catch (e) {
      console.error('Failed to get document data', e.message);
      throw new Error('Failed to get document data ' + e.message);
    }
  }

  public listAllDocuments(): string[] {
    const docList: string[] = [];
    const allDocsResult = this.database.getAllDocs(new com.couchbase.lite.QueryOptions().getAllDocsMode());
    for (let prop of allDocsResult.get('rows').toArray())
      docList.push(prop.getDocumentId());
    return docList;
  }

  public listAllReplications(): string[] {
    const replicationList: string[] = [];
    const allReplicationsList = this.database.getAllReplications();
    // for (let prop of allReplicationsList.get('rows').toArray())
    //   replicationList.push(prop);
    return allReplicationsList;
  }

  public addDatabaseChangeListener(callback: any): void {
    try {
      this.database.addChangeListener(new com.couchbase.lite.Database.ChangeListener({
        changed(event) {
          let changes: Array<any> = event.getChanges().toArray();
          callback(changes);
        }
      }));
    } catch (e) {
      console.error('Failed to add database change listener', e.message);
      throw new Error('Failed to add database change listener ' + e.message);
    }
  }

  public createDocument(data: Object, documentId?: string): string {
    let _documentId: string = '';
    let document: Document;
    if (documentId) {
      _documentId = documentId;
      document = this.database.getDocument(documentId);
      if (document.getProperty('_rev'))
        return documentId;
    } else {
      document = this.database.createDocument();
      _documentId = document.getId();
    }
    try {
      document.putProperties(Utils.objectToMap(data));
      return _documentId;
    } catch (e) {
      console.error('Failed to create document', e.message);
      throw new Error('Failed to create document ' + e.message);
    }
  }

  public updateDocument(documentId: string, data: any): void {
    let document: Document = this.database.getDocument(documentId);
    let temp: any = Utils.mapToObject(document);
    // data._id = temp._id;
    // data._rev = temp._rev;
    try {
      document.putProperties(Utils.objectToMap(data));
    } catch (e) {
      console.error('Failed to update document', e.message);
      throw new Error('Failed to update document ' + e.message);
    }
  }

  public deleteDocument(documentId: string): boolean {
    let document: Document = this.database.getDocument(documentId);
    try {
      document.delete();
    } catch (e) {
      console.error('Failed to delete the document', e.message);
      throw new Error('Failed to delete the document ' + e.message);
    }
    return document.isDeleted();
  }

  public deleteDatabase(): void {
    try {
      this.database.delete();
    } catch (e) {
      console.error('Failed to delete the database', e.message);
      throw new Error('Failed to delete the database ' + e.message);
    }
  }

  public createPullReplication(remoteUrl: string): Replicator {
    let replication: Replication;
    try {
      replication = this.database.createPullReplication(new java.net.URL(remoteUrl));
    } catch (e) {
      console.error('Failed to create pull replication', e.message);
      throw new Error('Failed to create pull replication: ' + e.message);
    }
    return new Replicator(replication);
  }

  public createPushReplication(remoteUrl: string): Replicator {
    let replication: Replication;
    try {
      replication = this.database.createPushReplication(new java.net.URL(remoteUrl));
    } catch (e) {
      console.error('Failed to create push replication', e.message);
      throw new Error('Failed to create push replication: ' + e.message);
    }
    return new Replicator(replication);
  }
}
