export const sections = [
  { id: 'drive', label: 'My Drive', icon: 'drive' },
  { id: 'shared', label: 'Shared with me', icon: 'shared' },
  { id: 'recent', label: 'Recent', icon: 'recent' },
  { id: 'starred', label: 'Starred', icon: 'starred' },
  { id: 'trash', label: 'Trash', icon: 'trash' },
]

export const files = [
  {
    id: 1,
    name: 'Design',
    type: 'folder',
    owner: 'me',
    modified: 'Aug 5',
    starred: true,
    color: '#e8b33c',
  },
  {
    id: 2,
    name: 'Quarterly Reports',
    type: 'folder',
    owner: 'me',
    modified: 'Aug 4',
    starred: false,
    color: '#8a9bb5',
  },
  {
    id: 3,
    name: 'Projects',
    type: 'folder',
    owner: 'me',
    modified: 'Aug 3',
    starred: false,
    color: '#6db98a',
  },
  {
    id: 4,
    name: 'Launch Script',
    type: 'code',
    ext: 'js',
    size: '18 KB',
    owner: 'me',
    modified: 'Aug 6',
    starred: true,
  },
  {
    id: 5,
    name: 'Brand Guidelines',
    type: 'pdf',
    ext: 'pdf',
    size: '2.4 MB',
    owner: 'Priya',
    modified: 'Aug 2',
    starred: false,
  },
  {
    id: 6,
    name: 'Roadmap Q4',
    type: 'sheet',
    ext: 'xlsx',
    size: '96 KB',
    owner: 'me',
    modified: 'Jul 30',
    starred: true,
  },
  {
    id: 7,
    name: 'Sprint Notes',
    type: 'doc',
    ext: 'docx',
    size: '44 KB',
    owner: 'Sam',
    modified: 'Jul 28',
    starred: false,
  },
  {
    id: 8,
    name: 'Product Walkthrough',
    type: 'video',
    ext: 'mp4',
    size: '128 MB',
    owner: 'me',
    modified: 'Jul 22',
    starred: false,
  },
  {
    id: 9,
    name: 'Team Offsite',
    type: 'image',
    ext: 'jpg',
    size: '5.1 MB',
    owner: 'Alex',
    modified: 'Jul 18',
    starred: false,
  },
  {
    id: 10,
    name: 'Notes Draft',
    type: 'doc',
    ext: 'md',
    size: '6 KB',
    owner: 'me',
    modified: 'Jul 12',
    starred: false,
  },
  {
    id: 11,
    name: 'Backup Archive',
    type: 'zip',
    ext: 'zip',
    size: '612 MB',
    owner: 'me',
    modified: 'Jul 9',
    starred: false,
  },
]

export const fileTypeMeta = {
  folder: { label: 'Folder', dot: '#e8b33c', icon: 'folder' },
  doc: { label: 'Document', dot: '#4f86d4', icon: 'doc' },
  sheet: { label: 'Spreadsheet', dot: '#3aa26b', icon: 'sheet' },
  pdf: { label: 'PDF', dot: '#e2654c', icon: 'pdf' },
  code: { label: 'Code', dot: '#8a6fd6', icon: 'code' },
  video: { label: 'Video', dot: '#d0578a', icon: 'video' },
  image: { label: 'Image', dot: '#4bb6b0', icon: 'image' },
  zip: { label: 'Archive', dot: '#c08a3e', icon: 'zip' },
}

const extToType = {
  js: 'code', jsx: 'code', ts: 'code', tsx: 'code', json: 'code',
  py: 'code', html: 'code', css: 'code', java: 'code', c: 'code',
  cpp: 'code', go: 'code', rs: 'code', sh: 'code',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', svg: 'image', webp: 'image',
  mp4: 'video', mov: 'video', avi: 'video', webm: 'video', mkv: 'video',
  pdf: 'pdf',
  doc: 'doc', docx: 'doc', txt: 'doc', md: 'doc', rtf: 'doc',
  xls: 'sheet', xlsx: 'sheet', csv: 'sheet', ods: 'sheet',
  zip: 'zip', rar: 'zip', tar: 'zip', gz: 'zip', '7z': 'zip',
}

export function typeFromFileName(name) {
  const ext = name.split('.').pop()?.toLowerCase() || ''
  return extToType[ext] || 'doc'
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

const folderColors = ['#e8b33c', '#8a9bb5', '#6db98a', '#d99a8b']
export const nextId = () => Date.now() + Math.floor(Math.random() * 1000)

export function makeFile(name, sizeBytes) {
  return {
    id: nextId(),
    name,
    type: typeFromFileName(name),
    ext: name.split('.').pop()?.toLowerCase() || '',
    size: formatBytes(sizeBytes),
    owner: 'me',
    modified: 'Just now',
    starred: false,
  }
}

export function makeFolder(name) {
  return {
    id: nextId(),
    name,
    type: 'folder',
    owner: 'me',
    modified: 'Just now',
    starred: false,
    color: folderColors[Math.floor(Math.random() * folderColors.length)],
  }
}
