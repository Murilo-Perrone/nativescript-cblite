import { Common } from './cblite.common';

interface Document {
  delete(): any;
  getCurrentRevision(): any;
  getCurrentRevisionId(): any;
  getDatabase(): any;
  getId(): any;
  getProperties(): any;
  getProperty(key: string): any;
  isDeleted(): any;
  putProperties(data: any): any;
}

interface Replication {
  addChangeListener(changeListener: any): any;
  deleteCookie(name: string): any;
  getAuthenticator(): any;
  getRemoteUrl(): any;
  getStatus(): any;
  isContinuous(): any;
  isPull(): any;
  isRunning(): any;
  restart(): any;
  setAuthenticator(authenticator: any): any;
  setCookie(name: string, value: string, path: string, expirationDate: any, secure: boolean, httpOnly: boolean): any;
  setContinuous(continuous: boolean): any;
  setDocIds(docIds: any): any;
  start(): any;
  stop(): any;
}

interface Database {
  addChangeListener(listener: any): any;
  close(): any;
  createDocument(): any;
  createPullReplication(url: any): any;
  createPushReplication(url: any): any;
  delete(): any;
  exists(): any;
  getAllDocs(options: any): any;
  getAllReplications(): any;
  getDocument(documentId: string): any;
  getDocumentCount(): any;
  getExistingDocument(documentId: string): any;
  getExistingLocalDocument(documentId: string): any;
}

interface Manager {
  allOpenDatabases(): any;
  forgetDatabase(): any;
  getAllDatabaseNames(): any;
  getContext(): any;
  getDatabase(name: string, mustExist?: boolean): any;
}

export declare class Utils {
  static getApplicationContext(): any;
  static objectToMap(data: Object): any;
  static mapToObject(data: any, recursive?: boolean): Object;
}

export declare class Replicator {
  constructor(replicator: Replication);
  start(): void;
  stop(): void;
  isRunning(): boolean;
  addReplicationChangeListener(changeListener: any): void;
  setAuthenticator(username: string, password: string): void;
  setContinuous(continuous: boolean): void;
  setDocumentIds(docs: string[]): void;
  setCookie(name: string, value: string, path: string, expirationDate: Date, secure: boolean, httpOnly: boolean): void;
  deleteCookie(name: string): void;
}

export declare class CBLite extends Common {
  constructor(databaseName: string);
  getDocument(documentId: string): Object;
  listAllDocuments(): string[];
  listAllReplications(): string[];
  addDatabaseChangeListener(callback: any): void;
  createDocument(data: Object, documentId?: string): string;
  updateDocument(documentId: string, data: any): void;
  deleteDocument(documentId: string): boolean;
  deleteDatabase(): void;
  createPullReplication(remoteUrl: string): Replicator;
  createPushReplication(remoteUrl: string): Replicator;
}