import React, { FC } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { circleVideoIcon, downloadIcon, photoFilmIcon, shareNodesIcon, zipIcon } from '@/lib/icons';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { selectPerson } from '@/lib/db/personService';
import Footer from './components/Footer';
import MobileHeader from './components/MobileHeader';

const Header = () => {
    return (
        <Container as='header' className={styles.header} justify='space-between'>
            <Container className={styles.wordmarkContainer} padding={0.5}>
                <Link href="/">
                    <Image src='/branding/wordmark.png' alt='wordmark' layout='intrinsic' height={100} width={100}/>
                </Link>
            </Container>
            <Container className={styles.action} padding={0.5}>
                <Link href='/howto' className={styles.link}>
                    <Text weight={600} size={1.2}>How It Works</Text>
                </Link>
                <Link href='/create' className={styles.link}>
                    <Container className={styles.actionButton}>
                        <Text weight={700} size={1.2}>Get Started</Text>
                    </Container>
                </Link>
            </Container>
            <MobileHeader />
        </Container>
    )
}

const Hero = () => {
    return (
        <Column as='section' className={styles.hero} justify='space-between'>
            <Column className={styles.textContainer} padding={0.5}>
                <Container className={styles.heroHeading} padding={[0, 1]}>
                    <Text weight={700} className={styles.heroHeadingText} as='h1'><span className={styles.highlightText}>Capture</span>, <span className={styles.highlightText}>Share</span> & <span className={styles.highlightText}>Relive</span> Every Moment of Your Wedding Day</Text>
                </Container>
                <Container className={styles.subheading} padding={[0, 1]}>
                    <Text className={styles.subheadingText} as='h2'>One simple QR code collects photos from all your guests - no apps, no accounts, no hassle</Text>
                </Container>
            </Column>
            <Column id="heroAction" padding={1}>
                <Link href='/create' className={styles.link}>
                    <Container className={styles.actionButton} padding={1}>
                        <Text size={1.2} weight={700}>Create your wedding gallery</Text>
                    </Container>
                </Link>
                <Container className={styles.exampleLink} padding={[0.5, 0]}>
                    <Text size={1.2} weight={500}>or</Text>
                </Container>
                <Container className={styles.exampleLink} padding={[0.5, 0]}>
                    <Link href="https://www.ourweddingrecap.com/maria-and-jake?password=H8TH" className={styles.link}>
                        <Text size={1.2} weight={500}>View an Example Gallery</Text>
                    </Link>
                </Container>
            </Column>
            <Container id="product" style={{ width: '100%'}} padding={1}>
                <Image src='/product/screenshots.png' alt='Recap wedding photo gallery app screenshots' layout='responsive' height={718} width={1369}/>
            </Container>
        </Column>
    )
}

// const Highlights = () => {
//     return (
//         <Column as='section' className={styles.highlights} justify='space-between'>
//             <Column className={styles.textContainer} padding={0.5}>
//                 <Container className={styles.heading} padding={[0, 1]}>
//                     <Text className={styles.headingText} as='h1'>Hassle free photo sharing for you and your guests.</Text>
//                 </Container>
//                 <Container className={styles.subheading} padding={[0, 1]}>
//                     <Text className={styles.subheadingText} as='h2'>Create a gallery for your wedding and stop chasing down photos after the fact. With the QR code we make for your gallery, it's as easy scan and upload for your guests.
//                     </Text>
//                 </Container>
//             </Column>
//             <Container className={styles.tabs}>
//                 <Container className={`${styles.tab} ${true ? styles.active : ''}`}>
//                     <Text className={styles.tabText}>
//                         Save the Date
//                     </Text>
//                 </Container>
//                 <Container className={`${styles.tab} ${false ? styles.active : ''}`}>
//                     <Text className={styles.tabText}>
//                         Invitation
//                     </Text>
//                 </Container>
//                 <Container className={`${styles.tab} ${false ? styles.active : ''}`}>
//                     <Text className={styles.tabText}>
//                         Wedding Stationary
//                     </Text>
//                 </Container>
//             </Container>
//             <Container className={styles.highlightsList} >
//                 <Container className={styles.highlightContainer}>
//                     <Column className={styles.highlight} padding={2}>
//                         <Container className={styles.highlightTitle} padding>
//                             <Text className={styles.title}>
//                                 QR Code
//                             </Text>
//                         </Container>
//                         <Container className={styles.highlightSubtitle} padding>
//                             <Text className={styles.subtitle}>
//                                 No <span className={styles.highlightText}>App</span>. No <span className={styles.highlightText}>Account</span>. No <span className={styles.highlightText}>Hassle</span>.
//                             </Text>
//                         </Container>  
//                         <Container className={styles.highlightDescription} padding>
//                             <Text>As easy as scanning the QR Code code and uploading your images. That's it.</Text>
//                         </Container>
//                         <Container className={styles.media} padding>
//                             <Image className={styles.image} src='/qrcode.png' alt='qrcode' layout='responsive' height={200} width={200}/>
//                         </Container>          
//                     </Column>
//                 </Container>
//                 {/* <Container className={styles.highlightContainer}>
//                     <Column className={styles.highlight} padding={2}>
//                         <Container className={styles.highlightTitle} padding>
//                             <Text className={styles.title}>
//                                 On-Click Link
//                             </Text>
//                         </Container>
//                         <Container className={styles.highlightSubtitle} padding>
//                             <Text className={styles.subtitle}>
//                                 Unlimited <span className={styles.highlightText}>uploads</span>. Unlimited <span className={styles.highlightText}>contributors</span>.
//                             </Text>
//                         </Container>  
//                         <Container className={styles.highlightDescription} padding>
//                             <Text>Upload as many photos as you want from as many people as you want.</Text>
//                         </Container>
//                         <Container className={styles.media} padding>
//                             <Row className={styles.highlightScreenshotContainer}>
//                                 <Image className={styles.highlightScreenshot} src='/product/galleryMobile.png' alt='qrcode' layout='responsive' height={200} width={200}/>
//                             </Row>
//                             <Row className={styles.highlightScreenshotContainer}>
//                                 <Image className={styles.highlightScreenshot} src='/product/peopleMobile.png' alt='qrcode' layout='responsive' height={200} width={200}/>
//                             </Row>
//                         </Container>          
//                     </Column>
//                 </Container> */}
//             </Container>
//         </Column>
//     )
// }

const Examples = () => {
    return (
        <Column as='section' className={styles.examples} justify='space-between'>
            <Column className={styles.textContainer} padding={0.5}>
                <Container className={styles.heading} padding={[0, 1]}>
                    <Text className={styles.headingText} as='h1'>Collect Every Photo From Every Guest — Without the Chase</Text>
                </Container>
                <Container className={styles.subheading} padding={[0, 1]}>
                    <Text className={styles.subheadingText} as='h2'>No more "Please send me those photos!" texts. With our QR code on your wedding stationery, guests can instantly upload photos to your gallery.
                    </Text>
                </Container>
            </Column>
            <Column className={styles.examplesList} >
                <Container className={styles.exampleContainer}>
                    <Container className={styles.example} padding={2}>
                        <Column className={styles.exampleDetails} >
                            <Container className={styles.exampleTitle} padding>
                                <Text className={styles.title}>
                                    <Text className={styles.highlightText}>Before</Text> the Wedding
                                </Text>
                            </Container>
                            <Container className={styles.highlightSubtitle} padding>
                                <Text className={styles.subtitle}>
                                    Include your QR code on <Text className={styles.highlightText}>Save the Dates</Text> & <Text className={styles.highlightText}>Invitations</Text> to start collecting pre-wedding memories.
                                </Text>
                            </Container>  
                        </Column>
                        <Container className={styles.exampleMedia} padding>
                            <Image className={styles.exampleImage} src='/product/SaveTheDates.png' alt='QR code on wedding save the dates' layout='responsive' height={200} width={200}/>
                        </Container>          
                    </Container>
                </Container>
                <Container className={styles.exampleContainer}>
                    <Container className={`${styles.example} ${styles.reverse}`} padding={2}>
                        <Container className={styles.exampleMedia} padding>
                        <Image className={styles.exampleImage} src='/product/Placecards.png' alt='QR code on wedding placecards' layout='responsive' height={200} width={200}/>
                        </Container>          
                        <Column className={styles.exampleDetails}>
                            <Container className={styles.exampleTitle} padding>
                                <Text className={styles.title}>
                                    <Text className={styles.highlightText}>During</Text> the Wedding
                                </Text>
                            </Container>
                            <Container className={styles.highlightSubtitle} padding>
                                <Text className={styles.subtitle}>
                                    Place QR codes on <Text className={styles.highlightText}>Tables</Text>, <Text className={styles.highlightText}>Placecards</Text> & <Text className={styles.highlightText}>Signs</Text> so guests can instantly share their photos.
                                </Text>
                            </Container>  
                        </Column>
                    </Container>
                </Container>
                <Container className={styles.exampleContainer}>
                    <Container className={styles.example} padding={2}>
                        <Column className={styles.exampleDetails}>
                            <Container className={styles.exampleTitle} padding>
                                <Text className={styles.title}>
                                <Text className={styles.highlightText}>After</Text> the Wedding
                                </Text>
                            </Container>
                            <Container className={styles.highlightSubtitle} padding>
                                <Text className={styles.subtitle}>
                                    Include your QR code on <Text className={styles.highlightText}>Thank You</Text> cards to collect even more memories and keep the sharing going.
                                </Text>
                            </Container>  
                        </Column>
                        <Container className={styles.exampleMedia} padding>
                        <Image className={styles.exampleImage} src='/product/ThankYous.png' alt='QR code on wedding thank you cards' layout='responsive' height={200} width={200}/>
                        </Container>          
                    </Container>
                </Container>
            </Column>
        </Column>
    )
}

const PricingComparison = () => {
    const weddingCosts = [
        { item: 'Venue', cost: 20000 },
        { item: 'Food & Catering', cost: 15000 },
        { item: 'Flowers & Decor', cost: 8000 },
        { item: 'Photographer', cost: 5000 },
        { item: 'Music & Entertainment', cost: 3500 },
        { item: 'Wedding Dress', cost: 2500 },
        { item: 'Recap', cost: 59, isLink: true },
    ];

    return (
        <Column as='section' className={styles.pricing} justify='space-between' padding={2}>
            <Container className={styles.pricingHeading} padding={[0, 1]}>
                <Text className={styles.headingText} as='h1'>
                    The most memorable part of your wedding is also the least expensive
                </Text>
            </Container>
            <Column className={styles.pricingTable} padding={2}>
                {weddingCosts.map((item, index) => (
                    item.isLink ? (
                        <Link key={index} href="/create" className={styles.priceLink}>
                            <Row className={`${styles.pricingItem} ${styles.highlightRow}`} padding={1} justify='space-between'>
                                <Text className={styles.pricingItemText} weight={600}>{item.item}</Text>
                                <Text className={styles.pricingLinkCost}>${item.cost.toLocaleString()}</Text>
                            </Row>
                        </Link>
                    ) : (
                        <Row key={index} className={styles.pricingItem} padding={1} justify='space-between'>
                            <Text className={styles.pricingItemText} weight={600}>{item.item}</Text>
                            <Text className={styles.pricingCost}>${item.cost.toLocaleString()}</Text>
                        </Row>
                    )
                ))}
            </Column>
        </Column>
    );
}

const Uses = () => {
    return (
        <Column as='section' className={styles.uses} padding={2}>
            <Text className={styles.headingText} as='h1'>Add your QR code to</Text>
            <Container padding={[0, 0, 0, 0.5]} className={styles.carousel}>
                <Container className={styles.carouselTrack}>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Save the Dates</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Invitations</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Placecards</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Table Numbers</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Signs</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Thank yous</Text>
                    </Container>
                    {/* Duplicate */}
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Save the Dates</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Invitations</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Placecards</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Table Numbers</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Signs</Text>
                    </Container>
                    <Container className={styles.use}>
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Thank yous</Text>
                    </Container>
                </Container>
            </Container>
        </Column>
    )
}

const Albums = () => {
    return (
        <Column as='section' className={styles.uses} padding={2}>
        <Text className={styles.headingText} as='h1'>Organize Every Moment with Smart Albums</Text>
        <Container className={styles.subheading} padding={[0, 1]}>
            <Text className={styles.subheadingText} as='h2'>Create custom albums to tell the complete story of your wedding journey - from engagement photos to honeymoon memories.</Text>
        </Container>
        <Container padding={[1, 0, 1, 0.5]} className={styles.carousel}>
            <Container className={styles.carouselTrack}>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Engagement</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Us Before I Do</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Wedding Day</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>The Ceremony</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>The Reception</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Bridal Shower</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Honeymoon</Text>
                </Container>
                {/* Duplicate */}
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Us Before I Do</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Engagement</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Wedding Day</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>The Ceremony</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>The Reception</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Bridal Shower</Text>
                </Container>
                <Container className={styles.use}>
                    <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Honeymoon</Text>
                </Container>
            </Container>
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

const Website = () => {
    return (
        <Column as='section' className={styles.section} padding={2}>
            <Container className={styles.heading} padding={[0, 1]}>
                <Text className={styles.headingText} as='h1'>Seamlessly Connect to Your Existing Wedding Website</Text>
            </Container>
            <Container className={styles.subheading} padding={[0, 1]}>
                <Text className={styles.subheadingText} as='h2'>Already have a wedding website with The Knot or Zola? Link your Recap gallery to provide guests with one central hub for all wedding information and photos.</Text>
            </Container>
            <Container className={styles.weddingWebsiteImagesContainer}>
                <Container className={styles.weddingWebsiteImageContainer} padding={1}>
                    <Link href="/create" className={styles.weddingWebsiteLink}>
                        <Container id="product" className={styles.weddingWebsiteImage} padding={1}>
                            <Image src='/branding/TheKnot.png' alt='Recap integrates with The Knot wedding websites' className={styles.image} layout='responsive' height={572} width={940}/>
                        </Container>
                    </Link>
                </Container>
                <Container className={styles.weddingWebsiteImageContainer} padding={1}>
                    <Link href="/create" className={styles.weddingWebsiteLink}>
                        <Container className={styles.weddingWebsiteImage} padding={1}>
                            <Image src='/branding/Zola.png' alt='Recap integrates with Zola wedding websites' className={styles.image} layout='responsive' height={572} width={940}/>
                        </Container>
                    </Link>
                </Container>
            </Container>
        </Column>
    )
}
const Notifications = () => {
    return (
        <Column as='section' className={styles.app} padding={2}>
            <Container className={styles.heading} padding={[0, 1]}>
                <Text className={styles.headingText} as='h1'>Build Excitement with Smart Notifications</Text>
            </Container>
            <Container className={styles.subheading} padding={[0, 1]}>
                <Text className={styles.subheadingText} as='h2'>Opt-in notifications keep everyone engaged and excited when new photos are shared. Send gentle reminders to encourage sharing before, during, and after your special day.</Text>
            </Container>
            <Container className={styles.notificationMedia} padding>
                <Image className={styles.notificationImage} src='/product/NotiGroup.png' alt='Recap wedding photo notification system on mobile devices' layout='responsive' height={200} width={200}/>
            </Container>          
        </Column>
    )

}


const HomePage: FC = async ({}) => {
    const personId = cookies().get('personId')?.value
    if (personId) {
        try {
            const person = await selectPerson(personId)
            if (person) return redirect('/galleries')
        } catch (error) {
            console.error(`No user found with id: ${personId}`)
        }
    }
    return (
        <Column as='main' className={styles.body}>
            {/* FIXED/STICKY */}
            <Header />

            {/* SCROLLABLE */}
            <Hero />
            <Examples />
            <PricingComparison />
            {/* <Uses /> */}
            <Albums />
            {/* <Share /> */}
            <Website />
            <Notifications />
            <Footer />
        </Column>
    )
}

export default HomePage