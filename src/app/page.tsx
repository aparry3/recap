import React, { FC } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { circleVideoIcon, downloadIcon, photoFilmIcon, shareNodesIcon, zipIcon } from '@/lib/icons';

const Header = () => {
    return (
        <Container as='header' className={styles.header} justify='space-between'>
            <Container className={styles.wordmarkContainer} padding={0.5}>
                <Link href="/">
                    <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
                </Link>
            </Container>
            <Container className={styles.action} padding={0.5}>
                <Link href='/create' className={styles.link}>
                    <Container className={styles.actionButton}>
                        <Text weight={700} size={1.2}>Get Started</Text>
                    </Container>
                </Link>
            </Container>
        </Container>
    )
}

const Hero = () => {
    return (
        <Column as='section' className={styles.hero} justify='space-between'>
            <Column className={styles.textContainer} padding={0.5}>
                <Container className={styles.heroHeading} padding={[0, 1]}>
                    <Text weight={700} className={styles.heroHeadingText} as='h1'><span className={styles.highlightText}>Recap</span> and <span className={styles.highlightText}>Relive</span> your favorite moments and memories</Text>
                </Container>
                <Container className={styles.subheading} padding={[0, 1]}>
                    <Text className={styles.subheadingText} as='h2'>Through the eyes of everyone who was there</Text>
                </Container>
            </Column>
            <Container id="heroAction" padding={1}>
                <Link href='/create' className={styles.link}>
                    <Container className={styles.actionButton} padding={1}>
                        <Text size={1.2} weight={700}>Create your shared gallery</Text>
                    </Container>
                </Link>
            </Container>
            <Container id="product" style={{ width: '100%'}} padding={1}>
                <Image src='/product/screenshots.png' alt='screenshots' layout='responsive' height={718} width={1369}/>
            </Container>
        </Column>
    )

}

const Highlights = () => {
    return (
        <Column as='section' className={styles.highlights} justify='space-between'>
            <Column className={styles.textContainer} padding={0.5}>
                <Container className={styles.heading} padding={[0, 1]}>
                    <Text className={styles.headingText} as='h1'>The best collaborative gallery.</Text>
                </Container>
                <Container className={styles.subheading} padding={[0, 1]}>
                    <Text className={styles.subheadingText} as='h2'>Share your gallery link directly with your guests or display the QR code for them to see—on stationery, stickers, or anywhere you choose. and let them easily scan and upload their photos and videos,</Text>
                </Container>
            </Column>
            <Container className={styles.highlightsList} >
                <Container className={styles.highlightContainer}>
                    <Column className={styles.highlight} padding={2}>
                        <Container className={styles.highlightTitle} padding>
                            <Text className={styles.title}>
                                Easy.
                            </Text>
                        </Container>
                        <Container className={styles.highlightSubtitle} padding>
                            <Text className={styles.subtitle}>
                                No <span className={styles.highlightText}>App</span>. No <span className={styles.highlightText}>Account</span>. No <span className={styles.highlightText}>Hassle</span>.
                            </Text>
                        </Container>  
                        <Container className={styles.highlightDescription} padding>
                            <Text>As easy as scanning the QR Code code and uploading your images. That’s it.</Text>
                        </Container>
                        <Container className={styles.media} padding>
                            <Image className={styles.image} src='/qrcode.png' alt='qrcode' layout='responsive' height={200} width={200}/>
                        </Container>          
                    </Column>
                </Container>
                <Container className={styles.highlightContainer}>
                    <Column className={styles.highlight} padding={2}>
                        <Container className={styles.highlightTitle} padding>
                            <Text className={styles.title}>
                                Unlimited.
                            </Text>
                        </Container>
                        <Container className={styles.highlightSubtitle} padding>
                            <Text className={styles.subtitle}>
                                Unlimited <span className={styles.highlightText}>uploads</span>. Unlimited <span className={styles.highlightText}>contributors</span>.
                            </Text>
                        </Container>  
                        <Container className={styles.highlightDescription} padding>
                            <Text>Upload as many photos as you want from as many people as you want.</Text>
                        </Container>
                        <Container className={styles.media} padding>
                            <Row className={styles.highlightScreenshotContainer}>
                                <Image className={styles.highlightScreenshot} src='/product/galleryMobile.png' alt='qrcode' layout='responsive' height={200} width={200}/>
                            </Row>
                            <Row className={styles.highlightScreenshotContainer}>
                                <Image className={styles.highlightScreenshot} src='/product/peopleMobile.png' alt='qrcode' layout='responsive' height={200} width={200}/>
                            </Row>
                        </Container>          
                    </Column>
                </Container>
                <Container className={styles.highlightContainer}>
                    <Column className={styles.highlight} padding={2}>
                        <Container className={styles.highlightTitle} padding>
                            <Text className={styles.title}>
                                Free.
                            </Text>
                        </Container>
                        <Container className={styles.highlightSubtitle} padding>
                            <Text className={styles.subtitle}>
                                Your <span className={styles.highlightText}>first gallery</span> free. No strings attached.
                            </Text>
                        </Container>  
                        <Container className={styles.highlightDescription} padding>
                            <Text>Enjoy your first gallery on us. Create and share a full gallery experience without any cost.</Text>
                        </Container>
                        <Container className={styles.media} padding>
                            <Image className={styles.image} src='/present.png' alt='present' layout='responsive' height={100} width={100}/>
                        </Container>          
                    </Column>
                </Container>
            </Container>
        </Column>
    )
}

const Uses = () => {
    return (
        <Container as='section' className={styles.uses} padding={2}>
            <Text className={styles.headingText} as='h1'>Great for</Text>
            <Container padding={[0, 0, 0, 0.5]}><Text weight={600} className={`${styles.headingText} ${styles.highlightText}`}>Weddings</Text></Container>
            <Text className={styles.headingText} as='h1'>.</Text>
        </Container>
    )
}


const Albums = () => {
    return (
        <Column as='section' className={styles.albums} padding={2}>
            <Container className={styles.background} />
            <Container className={styles.heading} padding={[0, 1]}>
                <Text className={styles.headingText} as='h1'>An album for everything.</Text>
            </Container>
            <Container className={styles.subheading} padding={[0, 1]}>
                <Text className={styles.subheadingText} as='h2'>Organize with ease and keep track of all of your memories along the way.</Text>
            </Container>
            <Container id="product" style={{ width: '100%', flexGrow: 1}} padding={1}>
                <Image src='/product/albums.png' alt='albums' className={styles.albumImage} layout='responsive' height={572} width={940}/>
            </Container>
        </Column>
    )
}

const Share = () => {
    return (
        <Column as='section' className={styles.share} >
            <Container className={styles.heading} padding={[0, 1]}>
                <Text className={styles.headingText} as='h1'><span className={styles.highlightText}>Share</span> and <span className={styles.highlightText}>save</span> your photos.</Text>
            </Container>
            <Container className={styles.subheading} padding={[0, 1]}>
                <Text className={styles.subheadingText} as='h2'>Download, export and share your photos in one click.</Text>
            </Container>
            <Column className={styles.product} style={{ width: '100%', flexGrow: 1}} padding={1}>
                <Image src='/product/imageView.png' alt='albums' className={styles.albumImage} layout='responsive' height={572} width={940}/>
                <Container className={styles.shareCards} padding>
                    <Column className={styles.magnifyContainer}>
                        <Image src='/product/magnify.png' alt='magnify' className={styles.magnify} layout='responsive' height={500} width={500}/>
                        <Container padding>
                            <Text size={1.3}>Share to social media with one click.</Text>
                        </Container>
                    </Column>
                    <Column className={styles.shareCardContainer} padding={1}>
                        <Column className={styles.shareCard} padding={1}>
                            <Container className={styles.iconContainer} padding={0.5}>
                                <FontAwesomeIcon icon={photoFilmIcon} className={styles.icon}/>
                            </Container>
                            <Container  >
                                <Text size={1.3}>Export Video</Text>
                            </Container>
                        </Column>
                        <Container padding>
                            <Text size={1.3}>Turn your gallery into a video.</Text>
                        </Container>
                    </Column>
                    <Column className={styles.shareCardContainer} padding={1}>
                        <Column className={styles.shareCard} padding={1}>
                            <Container className={styles.iconContainer} padding={0.5}>
                                <FontAwesomeIcon icon={zipIcon} className={styles.icon}/>
                            </Container>
                            <Container >
                                <Text size={1.3}>Download Media</Text>
                            </Container>
                        </Column>
                        <Container padding>
                            <Text size={1.3}>Download a single image or export your whole gallery.</Text>
                        </Container>
                    </Column>
                    <Container className={styles.details}>
                        <Column className={styles.detail} style={{top: '35%', right: '1%'}}>
                            <Container className={styles.detailIcon}>
                                <FontAwesomeIcon icon={shareNodesIcon} className={styles.icon}/>
                            </Container>
                            <Container padding>
                                <Text size={1.3}>Share to social media with one click.</Text>
                            </Container>
                        </Column>
                        <Column className={styles.detail} style={{top: '70%', right: '7%'}}>
                            <Container className={styles.detailIcon}>
                                <FontAwesomeIcon icon={downloadIcon} className={styles.icon}/>
                            </Container>
                            <Container padding>
                                <Text size={1.3}>Download a single image or export your whole gallery.</Text>
                            </Container>
                        </Column>
                        <Column className={styles.detail} style={{top: '70%', left: '7%'}}>
                            <Container className={styles.detailIcon}>
                                <FontAwesomeIcon icon={circleVideoIcon} className={styles.icon}/>
                            </Container>
                            <Container padding>
                                <Text size={1.3}>Turn your gallery into a video.</Text>
                            </Container>
                        </Column>
                    </Container>
                </Container>
            </Column>
        </Column>
    )

}

const App = () => {
    return (
        <Column as='section' className={styles.app} padding={2}>
            <Container className={styles.heading} padding={[0, 1]}>
                <Text className={styles.headingText} as='h1'>No app store, it just works.</Text>
            </Container>
            <Container className={styles.subheading} padding={[0, 1]}>
                <Text className={styles.subheadingText} as='h2'>Save Recap to your phone’s home-screen to enjoy an even better experience. No install required.</Text>
            </Container>
            <Container className={styles.appDetailsContainer}>
                <Container className={styles.appImage}>
                    <Image src='/product/app.png' alt='app' className={styles.appImage} layout='responsive' height={588} width={356}/>
                </Container>
                <Column className={styles.appDetails}>
                    <Column className={styles.appDetail}>
                        <Container className={styles.title}>
                            <Text className={styles.detailText} as='h3'>Background Image Upload</Text>
                        </Container>
                        <Container className={styles.description}>
                            <Text className={styles.detailText}>Use the home screen saved version of Recap and upload your photos in the background, and get back to enjoying the fun. No long wait times while all of your media buffers.</Text>
                        </Container>
                    </Column>
                    <Column className={styles.appDetail}>
                        <Container className={styles.title}>
                            <Text className={styles.detailText} as='h3'>Event Notifications</Text>
                        </Container>
                        <Container className={styles.description}>
                            <Text className={styles.detailText}>Get notified about gallery updates, and events. Going to a wedding? Recap will notify you if the happy couple has a gallery set up and prompt you to join automatically..</Text>
                        </Container>
                    </Column>
                    <Column className={styles.appDetail}>
                        <Container className={styles.title}>
                            <Text className={styles.detailText} as='h3'>Better Usability</Text>
                        </Container>
                        <Container className={styles.description}>
                            <Text className={styles.detailText}>Opens like a website, feels like an app. Utilize the extra space to browse your photos more easily, and take advantage of some of your phones capabilities like notifications and geolocation..</Text>
                        </Container>
                    </Column>
                </Column>
            </Container>
        </Column>
    )

}

const Footer = () => {
    return (
        <Container as='footer' className={styles.footer} padding={2}>
            <Container style={{flexGrow: 1}}>

            </Container>
            <Column className={styles.branding}>
                <Row className={styles.brandingRow}>
                    <Image src='/branding/wordmarkInverse.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
                </Row>
                <Row className={styles.brandingRow}>
                    <Text>The best collaborative photo gallery for your next wedding, birthday, or celebration, offering unlimited uploads and collaborators, and easy organization of all of your media.</Text>
                </Row>    
            </Column>
        </Container>
    )

}

const HomePage: FC = ({}) => {
    return (
        <Column as='main' className={styles.body}>
            {/* FIXED/STICKY */}
            <Header />

            {/* SCROLLABLE */}
            <Hero />
            <Highlights />
            <Uses />
            <Albums />
            <Share />
            <App />
            <Footer />
        </Column>
    )
}

export default HomePage