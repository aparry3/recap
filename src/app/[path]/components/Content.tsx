"use client";
import { FC, useMemo } from 'react'
import styles from './Content.module.scss'
import { Column } from 'react-web-layout-components'
import Heading from './Heading'
import Home from './Content/Home';
import Gallery from './Content/Gallery';
import { Page } from '../Dashboard';


const Content: FC<{onQrClick: () => void, page: Page}> = ({onQrClick, page}) => {
    const currentPage = useMemo(() => {
        switch (page) {
            case Page.HOME:
                return <Home />
            case Page.GALLERY:
                return <Gallery />
            case Page.USER:
                return <Home />
            default:
                return <Home />
        }
    }, [page])
    return (
        <Column as='section' className={styles.content}>
            <Heading onQrClick={onQrClick} />
            {currentPage}
        </Column>
    )
}

export default Content