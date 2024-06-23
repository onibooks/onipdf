import type { WorkerContext } from '../worker.js'

export const getMetaData = (context: WorkerContext) => () => {
  const { Document } = context.mupdf

  return Object.entries({
    author: Document.META_INFO_AUTHOR,
    creationDate: Document.META_INFO_CREATIONDATE,
    creator: Document.META_INFO_CREATOR,
    keywords: Document.META_INFO_KEYWORDS,
    modificationDate: Document.META_INFO_MODIFICATIONDATE,
    producer: Document.META_INFO_PRODUCER,
    subject: Document.META_INFO_SUBJECT,
    title: Document.META_INFO_TITLE
  }).reduce((metadata, [metadataKey, metaInfoKey]) => {
    (metadata as any)[metadataKey] = context.document.getMetaData(metaInfoKey) || ''

    return metadata
  }, {})
}