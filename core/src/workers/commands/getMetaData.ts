import type { WorkerContext } from '../worker.js'

/**
 * [['author', Document.META_INFO_AUTHOR, title: Document.META_INFO_TITLE, subject: Document.META_INFO_SUBJECT, ...]]
 * metadataKey: 'author',
 * metaInfoKey: Document.META_INFO_AUTHOR
 
  * metadataKey: 'title',
  * metaInfoKey: Document.META_INFO_TITLE
  
  * metadataKey: 'subject',
  * metaInfoKey: Document.META_INFO_SUBJECT
  
  * ...
*/

export const getMetaData = (context: WorkerContext) => () => {
  const { Document } = context.mupdf

  return Object.entries({ 
    author: Document.META_INFO_AUTHOR,
    title: Document.META_INFO_TITLE,
    subject: Document.META_INFO_SUBJECT,
    keywords: Document.META_INFO_KEYWORDS,
    creator: Document.META_INFO_CREATOR,
    creationDate: Document.META_INFO_CREATIONDATE,
    producer: Document.META_INFO_PRODUCER,
    modificationDate: Document.META_INFO_MODIFICATIONDATE
  }).reduce((metadata, [metadataKey, metaInfoKey]) => {
    (metadata as any)[metadataKey] = context.document.getMetaData(metaInfoKey || '')

    return metadata
  }, {})
}
