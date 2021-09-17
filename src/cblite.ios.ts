import { Common } from './cblite.common';
import * as types from 'tns-core-modules/utils/types';

declare var CBLDatabase,
    CBLMutableDocument,
    CBLURLEndpoint,
    CBLReplicatorConfiguration,
    CBLReplicatorType,
    CBLBasicAuthenticator,
    CBLReplicator,
    CBLQueryExpression,
    CBLQueryOrdering,
    CBLQueryBuilder,
    CBLReplicatorActivityLevel,
    CBLQueryDataSource,
    CBLQuerySelectResult,
    CBLQueryMeta,
    CBLDictionary,
    CBLArray;

export class Utils {
  static startCBLListener(listenPort: number): string {
    console.log("startCBLListener");
    return null;
  }
}
  
export class CBLite extends Common {
  private database: any;//CBLDatabase;

  /**
   * Create a new instance of CBLite
   * @param databaseName Database name
   */
  constructor(databaseName: string) {
    super(databaseName);
    console.log("CBLite constructor");
    this.database = CBLDatabase.alloc().initWithNameError(databaseName);
    console.log(databaseName + ' created successfully !');
    console.log(this.database);
  }

  private static listenerUrl: string;
	public static initCBLite(): string {
		try {
      if (this.listenerUrl == null) {
        // ...
        this.listenerUrl = Utils.startCBLListener(0);
        console.log("initCBLite() completed successfully");
      }
    } catch (e) {
      console.error(e);
    }
    return this.listenerUrl;
  }

  /**
   * Get a document from the local database
   * @param documentId Document ID
   */
  public getDocument(documentId: string): Object {
    const doc: any = this.database.documentWithID(documentId);
    try {
      if (doc) {
        let obj = {};
        const keys = doc.keys;
        const size = keys.count;
        obj['id'] = doc.id;
        for (let i = 0; i < size; i++) {
            const key = keys.objectAtIndex(i);
            const value = doc.valueForKey(key);
            const newValue = {};
            newValue[key] = this.deserialize(value);
            obj = Object.assign(obj, newValue);
        }
        return obj;
      }
      return null;
    } catch (e) {
      console.error('Failed to get document data', e.message);
      throw new Error('Failed to get document data ' + e.message);
    }
  }

  private deserialize(data: any) {
    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean' || typeof data !== 'object') return data;

    if (types.isNullOrUndefined(data)) {
        return data;
    }

    if (data instanceof NSNull) {
        return null;
    }

    if (data instanceof CBLDictionary) {
        const keys = data.keys;
        const length = keys.count;
        const object = {};
        for (let i = 0; i < length; i++) {
            const key = keys.objectAtIndex(i);
            const nativeItem = data.valueForKey(key);
            object[key] = this.deserialize(nativeItem);
        }
        return object;
    }

    if (data instanceof CBLArray) {
        const array = [];
        const size = data.count;
        for (let i = 0; i < size; i++) {
            const nativeItem = data.valueAtIndex(i);
            const item = this.deserialize(nativeItem);
            array.push(item);
        }
        return array;
    }

    return data;
  }

  public hasAttachment(ownerDocumentId: string, attachmentId: string): boolean {
    return false;
    // const document = this.database.getExistingDocument(ownerDocumentId);
    // if (document == null) return false;
    // const currentRevision = document.getCurrentRevision();
    // if (currentRevision == null) return false;
    // const attachment = currentRevision.getAttachment(attachmentId);
    // const length = attachment.getLength();
    // return length > 0;
  }

  /** Returns a ByteArray */
  public getAttachment(ownerDocumentId: string, attachmentId: string): any {
    // const document = this.database.getExistingDocument(ownerDocumentId);
    // if (document == null) return null;
    // const currentRevision = document.getCurrentRevision();
    // if (currentRevision == null) return null;
    // const attachment = currentRevision.getAttachment(attachmentId);
    // const contentStream = attachment.getContent();
    // const content = contentStream.buf;
    // return content;
  }

  /** List all documents in the local database */
  public listAllDocuments(): string[] {
    return null;
    // const docList: string[] = [];
    // const allDocsResult = this.database.getAllDocs(new com.couchbase.lite.QueryOptions().getAllDocsMode());
    // for (let prop of allDocsResult.get('rows').toArray())
    //   docList.push(prop.getDocumentId());
    // return docList;
  }

  /** List all replications created */
  public listAllReplications(): string[] {
    return null;
    // // const replicationList: string[] = [];
    // const allReplicationsList = this.database.getAllReplications();
    // return allReplicationsList;
  }

  /**
   * Add a listener to any changes in the local database
   * @param callback Callback to call after a change
   */
  public addDatabaseChangeListener(callback: any): void {
    try {
      // this.database.addChangeListener(new com.couchbase.lite.Database.ChangeListener({
      //   changed(event) {
      //     let changes: Array<any> = event.getChanges().toArray();
      //     callback(changes);
      //   }
      // }));
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
    return null;
    // let _documentId: string = '';
    // let document: Document;
    // if (documentId == null)
    //   documentId = (<any>data)._id;
    // if (documentId) {
    //   _documentId = documentId;
    //   document = this.database.getDocument(documentId);
    //   if (document.getProperty('_rev'))
    //     return documentId;
    // } else {
    //   document = this.database.createDocument();
    //   _documentId = document.getId();
    // }
    // try {
    //   document.putProperties(Utils.objectToMap(data));
    //   return _documentId;
    // } catch (e) {
    //   console.error('Failed to create document', e.message);
    //   throw new Error('Failed to create document ' + e.message);
    // }
  }

  /**
   * Update a document in the local database
   * @param documentId Document ID to be updated
   * @param data Data object to be converted and updated to the document
   */
  public updateDocument(documentId: string, data: any): void {
    // let document: Document = this.database.getDocument(documentId);
    // // Obtaining document's latest revision to avoid conflicts
    // let temp: any = Utils.mapToObject(document.getProperties());
    // data._id = temp._id;
    // data._rev = temp._rev;
    // try {
    //   document.putProperties(Utils.objectToMap(data));
    // } catch (e) {
    //   console.error('Failed to update document', e.message);
    //   throw new Error('Failed to update document ' + e.message);
    // }
  }

  /**
   * Delete a document in the local database
   * @param documentId Document ID to be deleted
   */
  public deleteDocument(documentId: string): boolean {
    return true;
    // let document: Document = this.database.getDocument(documentId);
    // try {
    //   document.delete();
    // } catch (e) {
    //   console.error('Failed to delete the document', e.message);
    //   throw new Error('Failed to delete the document ' + e.message);
    // }
    // return document.isDeleted();
  }

  /** Delete the local database */
  public deleteDatabase(): void {
    try {
      // this.database.delete();
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
    return null;
    // let replication: Replication;
    // try {
    //   replication = this.database.createPullReplication(new java.net.URL(remoteUrl));
    // } catch (e) {
    //   console.error('Failed to create pull replication', e.message);
    //   throw new Error('Failed to create pull replication: ' + e.message);
    // }
    // return new Replicator(replication);
  }

  /**
   * Create a push replicator. It will push documents to the remote server once it is started.
   * @param remoteUrl Remote URL to replicate your documents
   */
  public createPushReplication(remoteUrl: string): Replicator {
    return null;
    // let replication: Replication;
    // try {
    //   replication = this.database.createPushReplication(new java.net.URL(remoteUrl));
    // } catch (e) {
    //   console.error('Failed to create push replication', e.message);
    //   throw new Error('Failed to create push replication: ' + e.message);
    // }
    // return new Replicator(replication);
  }
}

export class Replicator {

  // private replicator: Replication;

  /** Creates a new instance of a replicator */
  constructor(replicator: Replication) {
    // this.replicator = replicator;
  }

  /** Starts a replication */
  public start(): void {
    // this.replicator.start();
  }

  /** Stops a replication */
  public stop(): void {
    // this.replicator.stop();
  }

  /** Check if a replication is running */
  public isRunning(): boolean {
    return false;
    // return this.replicator.isRunning();
  }

  /** Yet to be documented */
  public addReplicationChangeListener(changeListener): void {
    // this.replicator.addChangeListener(changeListener);
  }

  /**
   * Setup the authentication parameters to replicate to/from a remote server.
   * @param username Username for the remote server
   * @param password Password for the remote server
   */
  public setAuthenticator(username: string, password: string): void {
    // this.replicator.setAuthenticator(
    //   new com.couchbase.lite.auth.BasicAuthenticator(username, password)
    // );
  }

  /**
   * Define if the replication will be continuous or not
   * @param continuous Boolean for continuous replication
   */
  public setContinuous(continuous: boolean): void {
    // this.replicator.setContinuous(continuous);
  }

  /**
   * Set a list of documents to replicate. If no list is set, it will replicate every document.
   * @param docs Array of strings containing the IDs of the documents to be replicated
   */
  public setDocumentIds(docs: string[]): void {
    // const list = new java.util.ArrayList();
    // docs.forEach(doc => list.add(doc));
    // this.replicator.setDocIds(list);
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
    // let date = new java.util.Date(expirationDate.getTime());
    // this.replicator.setCookie(name, value, path, date, secure, httpOnly);
  }

  /** Not used yet */
  public deleteCookie(name: string): void {
    // this.replicator.deleteCookie(name);
  }
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
