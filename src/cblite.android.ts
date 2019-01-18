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
  ArrayList = <any>'java.util.ArrayList',
  Boolean = <any>'java.lang.Boolean',
  String = <any>'java.lang.String',
  Integer = <any>'java.lang.Integer',
  Long = <any>'java.lang.Long',
  Double = <any>'java.lang.Double',
  Short = <any>'java.lang.Short'
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

  static mapToObject(data: any) {
    try {
      const gson = new com.google.gson.Gson();
      const mappedObject = gson.toJson(data);
      return JSON.parse(mappedObject);
    } catch(e) {
      console.error('Failed to convert Object to Map', e.message);
      throw new Error('Failed to convert Object to Map ' + e.message);
    }
  }
}

export class Replicator {

  private replicator: Replication;

  /** Creates a new instance of a replicator */
  constructor(replicator: Replication) {
    this.replicator = replicator;
  }

  /** Starts a replication */
  public start(): void {
    this.replicator.start();
  }

  /** Stops a replication */
  public stop(): void {
    this.replicator.stop();
  }

  /** Check if a replication is running */
  public isRunning(): boolean {
    return this.replicator.isRunning();
  }

  /** Yet to be documented */
  public addReplicationChangeListener(changeListener): void {
    this.replicator.addChangeListener(changeListener);
  }

  /**
   * Setup the authentication parameters to replicate to/from a remote server.
   * @param username Username for the remote server
   * @param password Password for the remote server
   */
  public setAuthenticator(username: string, password: string): void {
    this.replicator.setAuthenticator(
      new com.couchbase.lite.auth.BasicAuthenticator(username, password)
    );
  }

  /**
   * Define if the replication will be continuous or not
   * @param continuous Boolean for continuous replication
   */
  public setContinuous(continuous: boolean): void {
    this.replicator.setContinuous(continuous);
  }

  /**
   * Set a list of documents to replicate. If no list is set, it will replicate every document.
   * @param docs Array of strings containing the IDs of the documents to be replicated
   */
  public setDocumentIds(docs: string[]): void {
    const list = new java.util.ArrayList();
    docs.forEach(doc => list.add(doc));
    this.replicator.setDocIds(list);
  }

  /** Not used yet */
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

  /** Not used yet */
  public deleteCookie(name: string): void {
    this.replicator.deleteCookie(name);
  }
}

export class CBLite extends Common {

  private context: any;
  private database: Database;
  private manager: Manager;

  /**
   * Create a new instance of CBLite
   * @param databaseName Database name
   */
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

  /**
   * Get a document from the local database
   * @param documentId Document ID
   */
  public getDocument(documentId: string): Object {
    const document: Document = this.database.getDocument(documentId);
    try {
      return Utils.mapToObject(document.getProperties());
    } catch (e) {
      console.error('Failed to get document data', e.message);
      throw new Error('Failed to get document data ' + e.message);
    }
  }

  /** List all documents in the local database */
  public listAllDocuments(): string[] {
    const docList: string[] = [];
    const allDocsResult = this.database.getAllDocs(new com.couchbase.lite.QueryOptions().getAllDocsMode());
    for (let prop of allDocsResult.get('rows').toArray())
      docList.push(prop.getDocumentId());
    return docList;
  }

  /** List all replications created */
  public listAllReplications(): string[] {
    // const replicationList: string[] = [];
    const allReplicationsList = this.database.getAllReplications();
    return allReplicationsList;
  }

  /**
   * Add a listener to any changes in the local database
   * @param callback Callback to call after a change
   */
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

  /**
   * Create a document in the local database
   * @param data Data object to be converted to a document
   * @param documentId Document ID to be created
   */
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

  /**
   * Update a document in the local database
   * @param documentId Document ID to be updated
   * @param data Data object to be converted and updated to the document
   */
  public updateDocument(documentId: string, data: any): void {
    let document: Document = this.database.getDocument(documentId);
    let temp: any = Utils.mapToObject(document);
    data._id = temp._id;
    data._rev = temp._rev;
    try {
      document.putProperties(Utils.objectToMap(data));
    } catch (e) {
      console.error('Failed to update document', e.message);
      throw new Error('Failed to update document ' + e.message);
    }
  }

  /**
   * Delete a document in the local database
   * @param documentId Document ID to be deleted
   */
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

  /** Delete the local database */
  public deleteDatabase(): void {
    try {
      this.database.delete();
    } catch (e) {
      console.error('Failed to delete the database', e.message);
      throw new Error('Failed to delete the database ' + e.message);
    }
  }

  /**
   * Create a pull replicator. It will pull documents from the remote server once it is started.
   * @param remoteUrl Remote URL to replicate your documents
   */
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

  /**
   * Create a push replicator. It will push documents to the remote server once it is started.
   * @param remoteUrl Remote URL to replicate your documents
   */
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
