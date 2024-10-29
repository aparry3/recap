// lib/fontawesome.js
import { findIconDefinition, icon, library } from '@fortawesome/fontawesome-svg-core';
import { faGift, faQrcode, faFileZipper, faPhotoFilm, faCircleVideo, faDownload, faShareNodes } from '@fortawesome/pro-solid-svg-icons';

// Add any icons you want here
library.add(faGift, faQrcode, faFileZipper, faPhotoFilm, faCircleVideo, faDownload, faShareNodes);


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

