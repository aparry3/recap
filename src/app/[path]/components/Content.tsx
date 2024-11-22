"use client";
import { FC, useMemo } from 'react'
import styles from './Content.module.scss'
import { Column } from 'react-web-layout-components'
import Heading from './Heading'
import Home from './Pages/Home';
import Gallery from './Pages/Gallery';
import { AppPage } from '../App';


const Content: FC<{onQrClick: () => void, page: AppPage}> = ({onQrClick, page}) => {
    const currentPage = useMemo(() => {
        switch (page) {
            case AppPage.HOME:
                return <Home />
            case AppPage.GALLERY:
                return <Gallery />
            case AppPage.USER:
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