"use client";
import { FC } from 'react'
import styles from './Content.module.scss'
import { Column } from 'react-web-layout-components'
import Heading from './Heading'
import Home from './Content/Home';
import Albums from './Content/Albums';


const Content: FC<{onQrClick: () => void}> = ({onQrClick}) => {
    return (
        <Column as='section' className={styles.content}>
            <Heading onQrClick={onQrClick} />
            <Albums />
        </Column>
    )
}

export default Content