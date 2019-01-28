# NativeScript CB-Lite

A plugin for Couchbase Lite on NativeScript. 

Yet under development

## Installation

```javascript
tns plugin add nativescript-cblite
```

## Usage 

First you need to import the main class
```typescript
import { CBLite } from 'nativescript-cblite';
```

Then you need to instantiate the `CBLite` class
```typescript
const cblite = new CBLite('databaseName');
```

Creating a local document
```typescript
cblite.createDocument({name: 'John Doe', age: 99}, 'myDocumentId');
```

Reading a local document
```typescript
// It will return a JSON object or false if the document does not exist
cblite.getDocument('myDocumentId');
```

Updating local document
```typescript
cblite.updateDocument('myDocumentId', {newData: 'My new data string'});
```

## Replicating your documents with a SyncGateway server
First you need to import the proper classes
```typescript
import { CBLite, Replicator } from 'nativescript-cblite';
```
Then you need to instantiate those classes
```typescript
const cblite = new CBLite('databaseName');
const pushReplicator: Replicator = cblite.createPushReplication('myRemoteUrl');
const pullReplicator: Replicator = cblite.createPullReplication('myRemoteUrl');
```
Setting up the replication
```typescript
pushReplicator.setContinuous(true);
pushReplicator.setAuthenticator('username', 'password');
pushReplicator.start();

pullReplicator.setContinuous(true);
pullReplicator.setAuthenticator('username', 'password');
pullReplicator.start();
```

# API Reference

#### Class CBLite
| Method name | Parameters | Return type |
| - | - | - |
| getDocument | documentId | Object |
| listAllDocuments | - | string[] |
| listAllReplications | - | string[] |
| addDatabaseChangeListener | callback | void |
| createDocument | data, documentId | string |
| updateDocument | documentId, data | void |
| deleteDocument | documentId | boolean |
| createPullReplication | remoteUrl | Replicator |
| createPushReplication | remoteUrl | Replicator |

#### Class Replicator
| Method name | Parameters | Return type |
| - | - | - |
| start | - | void |
| stop | -  | void |
| isRunning | - | boolean |
| addReplicationChangeListener | changeListenerCallback | void |
| setAuthenticator | username, password | void |
| setContinuous | continuous | void |
| setDocumentIds | docIds | void |
| setCookie | name, value, path, expirationDate, secure, httpOnly | void |
| deleteCookie | name | void |

#### More documentation incoming soon
## License

Apache License Version 2.0, January 2004
