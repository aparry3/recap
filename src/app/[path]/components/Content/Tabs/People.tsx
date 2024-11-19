import { FC } from "react"
import { Column, Container, Text } from "react-web-layout-components"
import styles from './People.module.scss'
import Button from "@/components/Button"
import useGallery from "@/helpers/providers/gallery"
import MediaGallery from "@/components/MediaGallery"
import { Media } from "@/lib/types/Media"

const People: FC = () => {
    const {upload, people, setPerson, person} = useGallery()
    return person ? (
        <MediaGallery images={person.recentMedia as Media[]} />
    ) : !people.length ? (
            <Column className={styles.data}>
                <Container padding>
                    <Text size={1.4}>
                        No people yet.
                    </Text>
                </Container>
                <Container padding>
                    <Button onClick={upload}>Upload</Button>
                </Container>
            </Column>
            ) : (
            <Container className={styles.content}>
                {people.map((person, index) => (
                    <Container className={styles.personContainer}>
                        <Column key={index} className={styles.person} onClick={() => setPerson(person.id)}>
                            {person.recentMedia?.length ? (<img src={person.recentMedia[0].preview} alt={person.name} className={styles.preview} /> ) : (<Container  className={styles.placeholder}/>)}
                            <Container className={styles.detailsContainer}>
                                <Container className={styles.nameContainer} justify="flex-start">
                                    <Text size={1.4} className={styles.name}>
                                        {person.name}
                                    </Text>
                                </Container>
                                <Container className={styles.countContainer}>
                                    <Text size={1.1} className={styles.count}>
                                        {person.count} uploads
                                    </Text>
                                </Container>
                            </Container>
                        </Column>
                    </Container>
                ))}
            </Container>
        )
}

export default People