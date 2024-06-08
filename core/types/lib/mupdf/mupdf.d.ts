export function enableICC(): void;
export function disableICC(): void;
export function setUserCSS(text: any): void;
export namespace Matrix {
    let identity: number[];
    function scale(sx: any, sy: any): any[];
    function translate(tx: any, ty: any): any[];
    function rotate(d: any): number[];
    function invert(m: any): any;
    function concat(one: any, two: any): any[];
}
export namespace Rect {
    let MIN_INF_RECT: number;
    let MAX_INF_RECT: number;
    function isEmpty(rect: any): boolean;
    function isValid(rect: any): boolean;
    function isInfinite(rect: any): boolean;
    function transform(rect: any, matrix: any): any;
}
export class Buffer extends Userdata {
    getLength(): any;
    readByte(at: any): any;
    write(s: any): void;
    writeByte(b: any): void;
    writeLine(s: any): void;
    writeBuffer(other: any): void;
    asUint8Array(): any;
    slice(start: any, end: any): Buffer;
    asString(): any;
}
export namespace Buffer {
    let _drop: any;
}
export class ColorSpace extends Userdata {
    constructor(from: any, name: any);
    getName(): any;
    getType(): string;
    getNumberOfComponents(): any;
    isGray(): boolean;
    isRGB(): boolean;
    isCMYK(): boolean;
    isIndexed(): boolean;
    isLab(): boolean;
    isDeviceN(): boolean;
    isSubtractive(): boolean;
}
export namespace ColorSpace {
    let _drop_1: any;
    export { _drop_1 as _drop };
    export let COLORSPACE_TYPES: string[];
    export let DeviceGray: ColorSpace;
    export let DeviceRGB: ColorSpace;
    export let DeviceBGR: ColorSpace;
    export let DeviceCMYK: ColorSpace;
    export let Lab: ColorSpace;
}
export class Font extends Userdata {
    constructor(name_or_pointer: any, data: any, subfont?: number);
    getName(): any;
    encodeCharacter(uni: any): any;
    advanceGlyph(gid: any, wmode?: number): any;
    isMono(): boolean;
    isSerif(): boolean;
    isBold(): boolean;
    isItalic(): boolean;
}
export namespace Font {
    let _drop_2: any;
    export { _drop_2 as _drop };
    export let SIMPLE_ENCODING: string[];
    export let ADOBE_CNS: number;
    export let ADOBE_GB: number;
    export let ADOBE_JAPAN: number;
    export let ADOBE_KOREA: number;
    export let CJK_ORDERING_BY_LANG: {
        "Adobe-CNS1": number;
        "Adobe-GB1": number;
        "Adobe-Japan1": number;
        "Adobe-Korea1": number;
        "zh-Hant": number;
        "zh-TW": number;
        "zh-HK": number;
        "zh-Hans": number;
        "zh-CN": number;
        ja: number;
        ko: number;
    };
}
export class Image extends Userdata {
    constructor(arg1: any, arg2: any);
    getWidth(): any;
    getHeight(): any;
    getNumberOfComponents(): any;
    getBitsPerComponent(): any;
    getXResolution(): any;
    getYResolution(): any;
    getImageMask(): boolean;
    getColorSpace(): ColorSpace | null;
    getMask(): Image | null;
    toPixmap(): Pixmap;
}
export namespace Image {
    let _drop_3: any;
    export { _drop_3 as _drop };
}
export class StrokeState extends Userdata {
    getLineCap(): any;
    setLineCap(j: any): void;
    getLineJoin(): any;
    setLineJoin(j: any): void;
    getLineWidth(): any;
    setLineWidth(w: any): void;
    getMiterLimit(): any;
    setMiterLimit(m: any): void;
}
export namespace StrokeState {
    let _drop_4: any;
    export { _drop_4 as _drop };
    export let LINE_CAP: string[];
    export let LINE_JOIN: string[];
}
export class Path extends Userdata {
    getBounds(strokeState: any, transform: any): any[];
    moveTo(x: any, y: any): void;
    lineTo(x: any, y: any): void;
    curveTo(x1: any, y1: any, x2: any, y2: any, x3: any, y3: any): void;
    curveToV(cx: any, cy: any, ex: any, ey: any): void;
    curveToY(cx: any, cy: any, ex: any, ey: any): void;
    closePath(): void;
    rect(x1: any, y1: any, x2: any, y2: any): void;
    transform(matrix: any): void;
    walk(_walker: any): void;
}
export namespace Path {
    let _drop_5: any;
    export { _drop_5 as _drop };
}
export class Text extends Userdata {
    getBounds(strokeState: any, transform: any): any[];
    showGlyph(font: any, trm: any, gid: any, uni: any, wmode?: number): void;
    showString(font: any, trm: any, str: any, wmode?: number): any[];
    walk(_walker: any): void;
}
export namespace Text {
    let _drop_6: any;
    export { _drop_6 as _drop };
}
export class DisplayList extends Userdata {
    getBounds(): any[];
    toPixmap(matrix: any, colorspace: any, alpha?: boolean): Pixmap;
    toStructuredText(options?: string): StructuredText;
    run(device: any, matrix: any): void;
    search(needle: any, max_hits?: number): any[][][];
}
export namespace DisplayList {
    let _drop_7: any;
    export { _drop_7 as _drop };
}
export class Pixmap extends Userdata {
    constructor(arg1: any, bbox: any, alpha?: boolean);
    getBounds(): any[];
    clear(value: any): void;
    getWidth(): any;
    getHeight(): any;
    getX(): any;
    getY(): any;
    getStride(): any;
    getNumberOfComponents(): any;
    getAlpha(): any;
    getXResolution(): any;
    getYResolution(): any;
    setResolution(x: any, y: any): void;
    getColorSpace(): ColorSpace | null;
    getPixels(): Uint8ClampedArray;
    asPNG(): any;
    asPSD(): any;
    asPAM(): any;
    asJPEG(quality: any, invert_cmyk: any): any;
    invert(): void;
    invertLuminance(): void;
    gamma(p: any): void;
    tint(black: any, white: any): void;
    convertToColorSpace(colorspace: any, keepAlpha?: boolean): Pixmap;
    warp(points: any, width: any, height: any): Pixmap;
}
export namespace Pixmap {
    let _drop_8: any;
    export { _drop_8 as _drop };
}
export class Shade extends Userdata {
    getBounds(): any[];
}
export namespace Shade {
    let _drop_9: any;
    export { _drop_9 as _drop };
}
export class StructuredText extends Userdata {
    walk(walker: any): void;
    asJSON(scale?: number): any;
    search(needle: any, max_hits?: number): any[][][];
}
export namespace StructuredText {
    let _drop_10: any;
    export { _drop_10 as _drop };
    export let SELECT_CHARS: number;
    export let SELECT_WORDS: number;
    export let SELECT_LINES: number;
}
export class Device extends Userdata {
    fillPath(path: any, evenOdd: any, ctm: any, colorspace: any, color: any, alpha: any): void;
    strokePath(path: any, stroke: any, ctm: any, colorspace: any, color: any, alpha: any): void;
    clipPath(path: any, evenOdd: any, ctm: any): void;
    clipStrokePath(path: any, stroke: any, ctm: any): void;
    fillText(text: any, ctm: any, colorspace: any, color: any, alpha: any): void;
    strokeText(text: any, stroke: any, ctm: any, colorspace: any, color: any, alpha: any): void;
    clipText(text: any, ctm: any): void;
    clipStrokeText(text: any, stroke: any, ctm: any): void;
    ignoreText(text: any, ctm: any): void;
    fillShade(shade: any, ctm: any, alpha: any): void;
    fillImage(image: any, ctm: any, alpha: any): void;
    fillImageMask(image: any, ctm: any, colorspace: any, color: any, alpha: any): void;
    clipImageMask(image: any, ctm: any): void;
    popClip(): void;
    beginMask(area: any, luminosity: any, colorspace: any, color: any): void;
    endMask(): void;
    beginGroup(area: any, colorspace: any, isolated: any, knockout: any, blendmode: any, alpha: any): void;
    endGroup(): void;
    beginTile(area: any, view: any, xstep: any, ystep: any, ctm: any, id: any): any;
    endTile(): void;
    beginLayer(name: any): void;
    endLayer(): void;
    close(): void;
}
export namespace Device {
    let _drop_11: any;
    export { _drop_11 as _drop };
    export let BLEND_MODES: string[];
}
export class DrawDevice extends Device {
    constructor(matrix: any, pixmap: any);
}
export class DisplayListDevice extends Device {
}
export class DocumentWriter extends Userdata {
    constructor(buffer: any, format: any, options: any);
    beginPage(mediabox: any): Device;
    endPage(): void;
    close(): void;
}
export namespace DocumentWriter {
    let _drop_12: any;
    export { _drop_12 as _drop };
}
export class Document extends Userdata {
    static openDocument(from: any, magic: any): Document;
    formatLinkURI(dest: any): any;
    isPDF(): boolean;
    needsPassword(): boolean;
    authenticatePassword(password: any): any;
    hasPermission(perm: any): boolean;
    getMetaData(key: any): any;
    setMetaData(key: any, value: any): void;
    countPages(): any;
    isReflowable(): boolean;
    layout(w: any, h: any, em: any): void;
    loadPage(index: any): PDFPage | Page;
    loadOutline(): {
        title: any;
        uri: any;
        open: boolean;
    }[] | null;
    resolveLink(link: any): any;
    outlineIterator(): OutlineIterator;
}
export namespace Document {
    let _drop_13: any;
    export { _drop_13 as _drop };
    export let META_FORMAT: string;
    export let META_ENCRYPTION: string;
    export let META_INFO_AUTHOR: string;
    export let META_INFO_TITLE: string;
    export let META_INFO_SUBJECT: string;
    export let META_INFO_KEYWORDS: string;
    export let META_INFO_CREATOR: string;
    export let META_INFO_PRODUCER: string;
    export let META_INFO_CREATIONDATE: string;
    export let META_INFO_MODIFICATIONDATE: string;
    export let PERMISSION: {
        print: number;
        copy: number;
        edit: number;
        annotate: number;
        form: number;
        accessibility: number;
        assemble: number;
        "print-hq": number;
    };
    export let LINK_DEST: string[];
}
export class OutlineIterator extends Userdata {
    item(): {
        title: any;
        uri: any;
        open: boolean;
    } | null;
    next(): any;
    prev(): any;
    up(): any;
    down(): any;
    delete(): any;
    insert(item: any): any;
    update(item: any): void;
}
export namespace OutlineIterator {
    let _drop_14: any;
    export { _drop_14 as _drop };
    export let RESULT_DID_NOT_MOVE: number;
    export let RESULT_AT_ITEM: number;
    export let RESULT_AT_EMPTY: number;
}
export class Link extends Userdata {
    getBounds(): any[];
    setBounds(rect: any): void;
    getURI(): any;
    setURI(uri: any): void;
    isExternal(): boolean;
}
export namespace Link {
    let _drop_15: any;
    export { _drop_15 as _drop };
}
export class Page extends Userdata {
    isPDF(): boolean;
    getBounds(): any[];
    getLabel(): any;
    run(device: any, matrix: any): void;
    runPageContents(device: any, matrix: any): void;
    runPageAnnots(device: any, matrix: any): void;
    runPageWidgets(device: any, matrix: any): void;
    toPixmap(matrix: any, colorspace: any, alpha?: boolean, showExtras?: boolean): Pixmap;
    toDisplayList(showExtras?: boolean): DisplayList;
    toStructuredText(options?: string): StructuredText;
    getLinks(): Link[];
    createLink(bbox: any, uri: any): Link;
    deleteLink(link: any): void;
    search(needle: any, max_hits?: number): any[][][];
}
export namespace Page {
    let _drop_16: any;
    export { _drop_16 as _drop };
}
export class PDFDocument extends Document {
    _fromPDFObjectNew(ptr: any): PDFObject;
    _fromPDFObjectKeep(ptr: any): PDFObject;
    _toPDFObject(obj: any): PDFObject;
    _PDFOBJ(obj: any): number;
    getVersion(): any;
    getLanguage(): any;
    setLanguage(lang: any): void;
    countObjects(): any;
    getTrailer(): PDFObject;
    createObject(): PDFObject;
    newNull(): PDFObject;
    newBoolean(v: any): PDFObject;
    newInteger(v: any): PDFObject;
    newReal(v: any): PDFObject;
    newName(v: any): PDFObject;
    newString(v: any): PDFObject;
    newByteString(v: any): PDFObject;
    newIndirect(v: any): PDFObject;
    newArray(cap?: number): PDFObject;
    newDictionary(cap?: number): PDFObject;
    deleteObject(num: any): void;
    addObject(obj: any): PDFObject;
    addStream(buf: any, obj: any): PDFObject;
    addRawStream(buf: any, obj: any): PDFObject;
    newGraftMap(): PDFGraftMap;
    graftObject(obj: any): PDFObject;
    graftPage(to: any, srcDoc: any, srcPage: any): void;
    addSimpleFont(font: any, encoding?: string): PDFObject;
    addCJKFont(font: any, lang: any, wmode?: number, serif?: boolean): PDFObject;
    addFont(font: any): PDFObject;
    addImage(image: any): PDFObject;
    loadImage(ref: any): Image;
    findPage(index: any): PDFObject;
    addPage(mediabox: any, rotate: any, resources: any, contents: any): PDFObject;
    insertPage(at: any, obj: any): void;
    deletePage(at: any): void;
    isEmbeddedFile(ref: any): any;
    addEmbeddedFile(filename: any, mimetype: any, contents: any, created: any, modified: any, checksum?: boolean): PDFObject;
    getEmbeddedFileParams(ref: any): {
        filename: any;
        mimetype: any;
        size: any;
        creationDate: Date;
        modificationDate: Date;
    };
    getEmbeddedFileContents(ref: any): Buffer | null;
    getEmbeddedFiles(): any;
    saveToBuffer(options?: string): Buffer;
    setPageLabels(index: any, style?: string, prefix?: string, start?: number): void;
    deletePageLabels(index: any): void;
    wasRepaired(): boolean;
    hasUnsavedChanges(): boolean;
    countVersions(): any;
    countUnsavedVersions(): any;
    validateChangeHistory(): any;
    canBeSavedIncrementally(): boolean;
    enableJournal(): void;
    getJournal(): {
        position: any;
        steps: any[];
    };
    beginOperation(op: any): void;
    beginImplicitOperation(): void;
    endOperation(): void;
    abandonOperation(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    undo(): void;
    redo(): void;
    isJSSupported(): boolean;
    enableJS(): void;
    disableJS(): void;
    setJSEventListener(_listener: any): void;
    rearrangePages(pages: any): void;
    bake(bakeAnnots?: boolean, bakeWidgets?: boolean): void;
}
export namespace PDFDocument {
    let PAGE_LABEL_NONE: string;
    let PAGE_LABEL_DECIMAL: string;
    let PAGE_LABEL_ROMAN_UC: string;
    let PAGE_LABEL_ROMAN_LC: string;
    let PAGE_LABEL_ALPHA_UC: string;
    let PAGE_LABEL_ALPHA_LC: string;
}
export class PDFPage extends Page {
    constructor(doc: any, pointer: any);
    _doc: any;
    _annots: any[] | null;
    _widgets: any[] | null;
    getObject(): any;
    getTransform(): any[];
    setPageBox(box: any, rect: any): void;
    toPixmap(matrix: any, colorspace: any, alpha?: boolean, showExtras?: boolean, usage?: string, box?: string): Pixmap;
    getWidgets(): any[];
    getAnnotations(): any[];
    createAnnotation(type: any): PDFAnnotation;
    deleteAnnotation(annot: any): void;
    applyRedactions(black_boxes?: number, image_method?: number): void;
    update(): boolean;
}
export namespace PDFPage {
    let BOXES: string[];
    let REDACT_IMAGE_NONE: number;
    let REDACT_IMAGE_REMOVE: number;
    let REDACT_IMAGE_PIXELS: number;
}
export class PDFObject extends Userdata {
    constructor(doc: any, pointer: any);
    _doc: any;
    isNull(): boolean;
    isIndirect(): boolean;
    isBoolean(): boolean;
    isInteger(): boolean;
    isNumber(): boolean;
    isName(): boolean;
    isString(): boolean;
    isArray(): boolean;
    isDictionary(): boolean;
    isStream(): boolean;
    asIndirect(): any;
    asBoolean(): boolean;
    asNumber(): any;
    asName(): any;
    asString(): any;
    asByteString(): any;
    readStream(): Buffer;
    readRawStream(): Buffer;
    writeObject(obj: any): void;
    writeStream(buf: any): void;
    writeRawStream(buf: any): void;
    resolve(): any;
    get length(): any;
    _get(path: any): number;
    get(...path: any[]): any;
    getIndirect(...path: any[]): any;
    getBoolean(...path: any[]): boolean;
    getNumber(...path: any[]): any;
    getName(...path: any[]): any;
    getString(...path: any[]): any;
    getInheritable(key: any): any;
    put(key: any, value: any): any;
    push(value: any): any;
    delete(key: any): void;
    valueOf(): any;
    toString(tight?: boolean, ascii?: boolean): any;
    forEach(fn: any): void;
    asJS(seen: any): any;
}
export namespace PDFObject {
    let _drop_17: any;
    export { _drop_17 as _drop };
    export let Null: PDFObject;
}
export class PDFGraftMap extends Userdata {
    constructor(doc: any, pointer: any);
    _doc: any;
    graftObject(obj: any): any;
    graftPage(to: any, srcDoc: any, srcPage: any): void;
}
export namespace PDFGraftMap {
    let _drop_18: any;
    export { _drop_18 as _drop };
}
export class PDFAnnotation extends Userdata {
    constructor(doc: any, pointer: any);
    _doc: any;
    getObject(): any;
    getBounds(): any[];
    run(device: any, matrix: any): void;
    toPixmap(matrix: any, colorspace: any, alpha?: boolean): Pixmap;
    toDisplayList(): DisplayList;
    update(): boolean;
    getType(): string;
    getLanguage(): any;
    setLanguage(lang: any): void;
    getFlags(): any;
    setFlags(flags: any): any;
    getContents(): any;
    setContents(text: any): void;
    getAuthor(): any;
    setAuthor(text: any): void;
    getCreationDate(): Date;
    setCreationDate(date: any): void;
    getModificationDate(): Date;
    setModificationDate(date: any): void;
    hasRect(): boolean;
    hasInkList(): boolean;
    hasQuadPoints(): boolean;
    hasVertices(): boolean;
    hasLine(): boolean;
    hasInteriorColor(): boolean;
    hasLineEndingStyles(): boolean;
    hasBorder(): boolean;
    hasBorderEffect(): boolean;
    hasIcon(): boolean;
    hasOpen(): boolean;
    hasAuthor(): boolean;
    hasFilespec(): boolean;
    getRect(): any[];
    setRect(rect: any): void;
    getPopup(): any[];
    setPopup(rect: any): void;
    getIsOpen(): boolean;
    setIsOpen(isOpen: any): void;
    getHiddenForEditing(): boolean;
    setHiddenForEditing(isHidden: any): void;
    getIcon(): any;
    setIcon(text: any): void;
    getOpacity(): any;
    setOpacity(opacity: any): void;
    getQuadding(): any;
    setQuadding(quadding: any): void;
    getLine(): any[][];
    setLine(a: any, b: any): void;
    getLineEndingStyles(): {
        start: string;
        end: string;
    };
    setLineEndingStyles(start: any, end: any): any;
    getColor(): any[];
    getInteriorColor(): any[];
    setColor(color: any): void;
    setInteriorColor(color: any): void;
    getBorderWidth(): any;
    setBorderWidth(value: any): any;
    getBorderStyle(): string;
    setBorderStyle(value: any): any;
    getBorderEffect(): string;
    setBorderEffect(value: any): any;
    getBorderEffectIntensity(): any;
    setBorderEffectIntensity(value: any): any;
    getBorderDashCount(): any;
    getBorderDashItem(idx: any): any;
    clearBorderDash(): any;
    addBorderDashItem(v: any): any;
    getBorderDashPattern(): any[];
    setBorderDashPattern(list: any): void;
    getIntent(): string | null;
    setIntent(value: any): any;
    setDefaultAppearance(fontName: any, size: any, color: any): void;
    getDefaultAppearance(): {
        font: any;
        size: any;
        color: any[];
    };
    getFileSpec(): any;
    setFileSpec(fs: any): any;
    getQuadPoints(): any[][];
    clearQuadPoints(): void;
    addQuadPoint(quad: any): void;
    setQuadPoints(quadlist: any): void;
    getVertices(): any[];
    clearVertices(): void;
    addVertex(vertex: any): void;
    setVertices(vertexlist: any): void;
    getInkList(): any[][];
    clearInkList(): void;
    addInkListStroke(): void;
    addInkListStrokeVertex(v: any): void;
    setInkList(inklist: any): void;
    setAppearanceFromDisplayList(appearance: any, state: any, transform: any, list: any): void;
    setAppearance(appearance: any, state: any, transform: any, bbox: any, resources: any, contents: any): void;
    applyRedaction(black_boxes?: number, image_method?: number): void;
}
export namespace PDFAnnotation {
    let _drop_19: any;
    export { _drop_19 as _drop };
    export let ANNOT_TYPES: string[];
    export let LINE_ENDING: string[];
    export let BORDER_STYLE: string[];
    export let BORDER_EFFECT: string[];
    export let INTENT: (string | null)[];
    export let IS_INVISIBLE: number;
    export let IS_HIDDEN: number;
    export let IS_PRINT: number;
    export let IS_NO_ZOOM: number;
    export let IS_NO_ROTATE: number;
    export let IS_NO_VIEW: number;
    export let IS_READ_ONLY: number;
    export let IS_LOCKED: number;
    export let IS_TOGGLE_NO_VIEW: number;
    export let IS_LOCKED_CONTENTS: number;
}
export class PDFWidget extends PDFAnnotation {
    getFieldType(): string;
    isButton(): boolean;
    isPushButton(): boolean;
    isCheckbox(): boolean;
    isRadioButton(): boolean;
    isText(): boolean;
    isChoice(): boolean;
    isListBox(): boolean;
    isComboBox(): boolean;
    getFieldFlags(): any;
    isMultiline(): boolean;
    isPassword(): boolean;
    isComb(): boolean;
    isReadOnly(): boolean;
    getLabel(): any;
    getName(): any;
    getValue(): any;
    setTextValue(value: any): void;
    getMaxLen(): any;
    setChoiceValue(value: any): void;
    getOptions(isExport?: boolean): any[];
    toggle(): void;
}
export namespace PDFWidget {
    let WIDGET_TYPES: string[];
    let FIELD_IS_READ_ONLY: number;
    let FIELD_IS_REQUIRED: number;
    let FIELD_IS_NO_EXPORT: number;
    let TX_FIELD_IS_MULTILINE: number;
    let TX_FIELD_IS_PASSWORD: number;
    let TX_FIELD_IS_COMB: number;
    let BTN_FIELD_IS_NO_TOGGLE_TO_OFF: number;
    let BTN_FIELD_IS_RADIO: number;
    let BTN_FIELD_IS_PUSHBUTTON: number;
    let CH_FIELD_IS_COMBO: number;
    let CH_FIELD_IS_EDIT: number;
    let CH_FIELD_IS_SORT: number;
    let CH_FIELD_IS_MULTI_SELECT: number;
}
export class TryLaterError extends Error {
    constructor(message: any);
}
export class AbortError extends Error {
    constructor(message: any);
}
export class Stream extends Userdata {
    constructor(url: any, contentLength: any, block_size: any, prefetch: any);
}
export namespace Stream {
    let _drop_20: any;
    export { _drop_20 as _drop };
}
declare class Userdata {
    constructor(pointer: any);
    pointer: number;
    destroy(): void;
    toString(): string;
    valueOf(): void;
}
export {};
