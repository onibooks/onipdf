import type { WorkerContext } from '../worker.js';
/**
 * [['format', Document.META_FORMAT, 'encryption', Document.META_ENCRYPTION 'author', Document.META_INFO_AUTHOR, title: Document.META_INFO_TITLE, subject: Document.META_INFO_SUBJECT, ...]]
 * metadataKey: 'author',
 * metaInfoKey: Document.META_INFO_AUTHOR
 
  * metadataKey: 'title',
  * metaInfoKey: Document.META_INFO_TITLE
  
  * metadataKey: 'subject',
  * metaInfoKey: Document.META_INFO_SUBJECT
  
  * ...
*/
export declare const getMetaData: (context: WorkerContext) => () => {};
