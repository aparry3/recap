// lib/fontawesome.js
import { findIconDefinition, icon, library } from '@fortawesome/fontawesome-svg-core';
import { faGift, faQrcode, faFileZipper, faPhotoFilm, faCircleVideo, faDownload, faShareNodes, faLink } from '@fortawesome/pro-solid-svg-icons';

// Add any icons you want here
library.add(faGift, faQrcode, faFileZipper, faPhotoFilm, faCircleVideo, faDownload, faShareNodes, faLink);


const download = findIconDefinition({ prefix: 'fas', iconName: 'download' })
export const downloadIcon = icon(download)

const zip = findIconDefinition({ prefix: 'fas', iconName: 'file-zipper' })
export const zipIcon = icon(zip)

const photoFilm = findIconDefinition({ prefix: 'fas', iconName: 'photo-film' })
export const photoFilmIcon = icon(photoFilm)

const circleVideo = findIconDefinition({ prefix: 'fas', iconName: 'circle-video' })
export const circleVideoIcon = icon(circleVideo)

const shareNodes = findIconDefinition({ prefix: 'fas', iconName: 'share-nodes' })
export const shareNodesIcon = icon(shareNodes)

const link = findIconDefinition({ prefix: 'fas', iconName: 'link' })
export const linkIcon = icon(link)

const qrcode = findIconDefinition({ prefix: 'fas', iconName: 'qrcode' })
export const qrcodeIcon = icon(qrcode)


