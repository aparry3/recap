// lib/fontawesome.js
import { findIconDefinition, icon, IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { faSquare } from '@fortawesome/pro-regular-svg-icons';
import { faGift, faGear, faQrcode, faFileZipper, faPhotoFilm, faCircleVideo, faDownload, faShareNodes, faLink, faUpload, faGridHorizontal, faHouse, faUser, faBars, faChevronLeft, faX, faCheck, faArrowLeft, faChevronRight, faChevronDown, faChevronUp, faCheckSquare, faTrash, faRectangleHistory } from '@fortawesome/pro-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'
import {Actions} from './actions'

// Add any icons you want here
library.add(faGift, faTrash, faGear, faRectangleHistory, faChevronRight, faChevronDown, faChevronUp, faCheck, faX, faArrowLeft, faChevronLeft, faUser, faBars, faHouse, faGridHorizontal, faUpload,faQrcode, faFileZipper, faPhotoFilm, faCircleVideo, faDownload, faShareNodes, faLink, faCheckSquare, faSquare as IconDefinition, faInstagram as IconDefinition, faFacebook as IconDefinition);


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

const upload = findIconDefinition({ prefix: 'fas', iconName: 'upload' })
export const uploadIcon = icon(upload)

const grid = findIconDefinition({ prefix: 'fas', iconName: 'grid-horizontal' })
export const gridIcon = icon(grid)

const house = findIconDefinition({ prefix: 'fas', iconName: 'house' })
export const houseIcon = icon(house)

const user = findIconDefinition({ prefix: 'fas', iconName: 'user' })
export const userIcon = icon(user)

const menu = findIconDefinition({ prefix: 'fas', iconName: 'bars' })
export const menuIcon = icon(menu)

const left = findIconDefinition({ prefix: 'fas', iconName: 'chevron-left' })
export const leftIcon = icon(left)

const right = findIconDefinition({ prefix: 'fas', iconName: 'chevron-right' })
export const rightIcon = icon(right)

const down = findIconDefinition({ prefix: 'fas', iconName: 'chevron-down' })
export const downIcon = icon(down)

const up = findIconDefinition({ prefix: 'fas', iconName: 'chevron-up' })
export const upIcon = icon(up)

const x = findIconDefinition({ prefix: 'fas', iconName: 'x' })
export const xIcon = icon(x)

const check = findIconDefinition({ prefix: 'fas', iconName: 'check' })
export const checkIcon = icon(check)

const arrowLeft = findIconDefinition({ prefix: 'fas', iconName: 'arrow-left' })
export const arrowLeftIcon = icon(arrowLeft)

const facebook = findIconDefinition({ prefix: 'fab', iconName: 'facebook' })
export const facebookIcon = icon(facebook)

const instagram = findIconDefinition({ prefix: 'fab', iconName: 'instagram' })
export const instagramIcon = icon(instagram)

const checkSquare = findIconDefinition({ prefix: 'fas', iconName: 'check-square' })
export const checkSquareIcon = icon(checkSquare)

const square = findIconDefinition({ prefix: 'far', iconName: 'square' })
export const squareIcon = icon(square)

const trash = findIconDefinition({ prefix: 'fas', iconName: 'trash' })
export const trashIcon = icon(trash)

const album = findIconDefinition({ prefix: 'fas', iconName: 'rectangle-history' })
export const albumIcon = icon(album)

const gear = findIconDefinition({ prefix: 'fas', iconName: 'gear' })
export const gearIcon = icon(gear)




export {Actions}


