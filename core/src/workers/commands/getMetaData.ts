import type { WorkerContext } from '../worker.js'

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

export const getMetaData = (context: WorkerContext) => () => {
  const { Document } = context.mupdf

  return Object.entries({
    format: Document.META_FORMAT,
    encryption: Document.META_ENCRYPTION,
    author: Document.META_INFO_AUTHOR,
    title: Document.META_INFO_TITLE,
    subject: Document.META_INFO_SUBJECT,
    keywords: Document.META_INFO_KEYWORDS,
    creator: Document.META_INFO_CREATOR,
    producer: Document.META_INFO_PRODUCER,
    creationDate: Document.META_INFO_CREATIONDATE,
    modificationDate: Document.META_INFO_MODIFICATIONDATE
  }).reduce((metadata, [metadataKey, metaInfoKey]) => {
    (metadata as any)[metadataKey] = context.document.getMetaData(metaInfoKey) || ''

    return metadata
  }, {})
}