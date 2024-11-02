import React, { FC } from "react"
import {  Container } from "react-web-layout-components"
import styles from '../page.module.scss'
import ClientUpload from "../components/Upload";


const UploadPage: FC = () => {
    return (
        <Container as='main'className={styles.app}>
             <ClientUpload />
        </Container>
    )
}

export default UploadPage;