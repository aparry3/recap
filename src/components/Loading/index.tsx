import {FC} from "react";
import { Container } from "react-web-layout-components";
import styles from './Loading.module.scss'


const Loading: FC = () => {
    return (
        <Container className={styles.loadingContainer}>
            <Container className={styles.loading}></Container>
        </Container>
    )
}


export default Loading
