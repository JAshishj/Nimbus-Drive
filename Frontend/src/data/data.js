export const sections = [
  { id: 'drive', label: 'My Drive', icon: 'drive' },
  { id: 'recent', label: 'Recent', icon: 'recent' },
  { id: 'starred', label: 'Starred', icon: 'starred' },
  { id: 'trash', label: 'Trash', icon: 'trash' },
]

export const fileTypeMeta = {
  folder: { label: 'Folder', dot: '#e8b33c', icon: 'folder' },
  doc: { label: 'Document', dot: '#4f86d4', icon: 'doc' },
  sheet: { label: 'Spreadsheet', dot: '#3aa26b', icon: 'sheet' },
  pdf: { label: 'PDF', dot: '#e2654c', icon: 'pdf' },
  code: { label: 'Code', dot: '#8a6fd6', icon: 'code' },
  video: { label: 'Video', dot: '#d0578a', icon: 'video' },
  image: { label: 'Image', dot: '#4bb6b0', icon: 'image' },
  audio: { label: 'Audio', dot: '#f2732c', icon: 'audio' },
  zip: { label: 'Archive', dot: '#c08a3e', icon: 'zip' },
}

const extToType = {
  js: 'code', jsx: 'code', ts: 'code', tsx: 'code', json: 'code',
  py: 'code', html: 'code', css: 'code', java: 'code', c: 'code',
  cpp: 'code', go: 'code', rs: 'code', sh: 'code',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', svg: 'image', webp: 'image',
  mp4: 'video', mov: 'video', avi: 'video', webm: 'video', mkv: 'video',
  mp3: 'audio', wav: 'audio', m4a: 'audio', ogg: 'audio', flac: 'audio', aac: 'audio', opus: 'audio',
  pdf: 'pdf',
  doc: 'doc', docx: 'doc', txt: 'doc', md: 'doc', rtf: 'doc',
  xls: 'sheet', xlsx: 'sheet', csv: 'sheet', ods: 'sheet',
  zip: 'zip', rar: 'zip', tar: 'zip', gz: 'zip', '7z': 'zip',
}

export function typeFromFileName(name) {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  return extToType[ext] || 'doc'
}

export function getFileDisplay(file) {
  const isFolder = file.mime_type ? false: true;
  if (isFolder) return { isFolder, meta: null }
  const typeKey = file.mime_type || file.type
  const meta = fileTypeMeta[typeKey] || fileTypeMeta[typeFromFileName(file.name || '')] || fileTypeMeta.doc
  return { isFolder, meta }
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let i = -1
  let v = bytes
  do {
    v /= 1024
    i++
  } while (v >= 1024 && i < units.length - 1)
  return `${v.toFixed(v >= 100 ? 0 : 1)} ${units[i]}`
}
