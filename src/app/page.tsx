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

const Header = () => {
    return (
        <Container as='header' className={styles.header} justify='space-between' role="banner">
            <Container className={styles.wordmarkContainer} padding={0.5}>
                <Link href="/" aria-label="Recap Homepage">
                    <Image src='/branding/wordmark.png' alt='Recap logo' layout='intrinsic' height={100} width={100}/>
                </Link>
            </Container>
            <Container className={styles.action} padding={0.5}>
                <Link href='/create' className={styles.link} aria-label="Get Started with Recap">
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
        <Column as='section' className={styles.hero} justify='space-between' aria-labelledby="main-heading">
            <Column className={styles.textContainer} padding={0.5} style={{margin: '0 auto'}}>
                <Container className={styles.heroHeading} padding={[0, 1]}>
                    <Text weight={700} className={styles.heroHeadingText} as='h1' id="main-heading"><span className={styles.highlightText}>Recap</span> and <span className={styles.highlightText}>Relive</span> the best day of your life</Text>
                </Container>
                <Container className={styles.subheading} padding={[0, 1]}>
                    <Text className={styles.subheadingText} as='p'>Through the eyes of everyone who was there</Text>
                </Container>
            </Column>
            <Container id="heroAction" padding={1} style={{margin: '1.5rem 0'}}>
                <Link href='/create' className={styles.link} aria-label="Create your shared gallery">
                    <Container className={styles.actionButton} padding={1}>
                        <Text size={1.2} weight={700}>Create your shared gallery</Text>
                    </Container>
                </Link>
            </Container>
            <Container id="product" style={{ width: '80%', maxWidth: '1000px', margin: '0 auto'}} padding={1}>
                <Image src='/product/screenshots.png' alt='Recap collaborative photo gallery interface showing various views and features' layout='responsive' height={718} width={1369} loading="eager" priority={true}/>
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
        <Column as='section' className={styles.examples} justify='space-between' aria-labelledby="examples-heading" style={{padding: '2rem 0'}}>
            <Column className={styles.textContainer} padding={0.5} style={{margin: '0 auto 2rem auto'}}>
                <Container className={styles.heading} padding={[0, 1]}>
                    <Text className={styles.headingText} as='h2' id="examples-heading">Hassle free photo sharing for you and your guests.</Text>
                </Container>
                <Container className={styles.subheading} padding={[0, 1]}>
                    <Text className={styles.subheadingText} as='p'>Create a gallery for your wedding and stop chasing down photos after the fact. With the QR code we make for your gallery, it's as easy scan and upload for your guests.
                    </Text>
                </Container>
            </Column>
            <Column className={styles.examplesList} role="list">
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
                                    Save the Dates | Invitations.
                                </Text>
                            </Container>  
                        </Column>
                        <Container className={styles.exampleMedia} padding>
                            <Image className={styles.exampleImage} src='/product/SaveTheDates.png' alt='Example of Recap QR code on wedding save the date cards' layout='responsive' height={200} width={200} loading="lazy"/>
                        </Container>          
                    </Container>
                </Container>
                <Container className={styles.exampleContainer}>
                    <Container className={`${styles.example} ${styles.reverse}`} padding={2}>
                        <Container className={styles.exampleMedia} padding>
                        <Image className={styles.exampleImage} src='/product/Placecards.png' alt='Example of Recap QR code on wedding place cards and tables' layout='responsive' height={200} width={200} loading="lazy"/>
                        </Container>          
                        <Column className={styles.exampleDetails}>
                            <Container className={styles.exampleTitle} padding>
                                <Text className={styles.title}>
                                    <Text className={styles.highlightText}>At</Text> the Wedding
                                </Text>
                            </Container>
                            <Container className={styles.highlightSubtitle} padding>
                                <Text className={styles.subtitle}>
                                    Placecards | Table Numbers | Signs.
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
                                    Thank you's.
                                </Text>
                            </Container>  
                        </Column>
                        <Container className={styles.exampleMedia} padding>
                        <Image className={styles.exampleImage} src='/product/ThankYous.png' alt='Example of Recap QR code on wedding thank you cards' layout='responsive' height={200} width={200} loading="lazy"/>
                        </Container>          
                    </Container>
                </Container>
            </Column>
        </Column>
    )
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
            <Text className={styles.headingText} as='h2' style={{marginBottom: '1rem'}}>An album for everything</Text>
            <Container padding={[0, 0, 0, 0.5]} className={styles.carousel}>
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
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Etc.</Text>
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
                        <Text weight={500} className={`${styles.useText} ${styles.highlightText}`}>Etc.</Text>
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
                <Text className={styles.headingText} as='h1'>Connect your wedding website.</Text>
            </Container>
            <Container className={styles.subheading} padding={[0, 1]}>
                <Text className={styles.subheadingText} as='h2'>Already have a wedding website with The Knot or Zola? Link your gallery to your website for easy access all in one place.</Text>
            </Container>
            <Container className={styles.weddingWebsiteImagesContainer}>
                <Container className={styles.weddingWebsiteImageContainer} padding={1}>
                    <Container id="product" className={styles.weddingWebsiteImage} padding={1}>
                        <Image src='/branding/TheKnot.png' alt='The Knot wedding website integration with Recap photo gallery' className={styles.image} layout='responsive' height={572} width={940} loading="lazy"/>
                    </Container>
                </Container>
                <Container className={styles.weddingWebsiteImageContainer} padding={1}>
                    <Container className={styles.weddingWebsiteImage} padding={1}>
                        <Image src='/branding/Zola.png' alt='Zola wedding website integration with Recap photo gallery' className={styles.image} layout='responsive' height={572} width={940} loading="lazy"/>
                    </Container>
                </Container>
            </Container>
        </Column>
    )
}
const Notifications = () => {
    return (
        <Column as='section' className={styles.app} padding={2}>
            <Container className={styles.heading} padding={[0, 1]}>
                <Text className={styles.headingText} as='h1'>Keep your guests informed and excited.</Text>
            </Container>
            <Container className={styles.subheading} padding={[0, 1]}>
                <Text className={styles.subheadingText} as='h2'>Use opt in text and email notifications to keep your guests up to date when new photos are uploaded. Make it fun, and prompt your guests to upload photos before the big day.</Text>
            </Container>
            <Container className={styles.notificationMedia} padding>
                <Image className={styles.notificationImage} src='/product/NotiGroup.png' alt='notifications group' layout='responsive' height={200} width={200}/>
            </Container>          
        </Column>
    )

}


const Footer = () => {
    return (
        <Container as='footer' className={styles.footer} padding={2} role="contentinfo">
            <Container style={{flexGrow: 1}}>

            </Container>
            <Column className={styles.branding}>
                <Row className={styles.brandingRow}>
                    <Image src='/branding/wordmarkInverse.png' alt='Recap logo' layout='intrinsic' height={100} width={100}/>
                </Row>
                <Row className={styles.brandingRow}>
                    <Text>The best collaborative photo gallery for your next wedding, birthday, or celebration, offering unlimited uploads and collaborators, and easy organization of all of your media.</Text>
                </Row>
                <Row className={styles.footerLinks}>
                    <Link href="/terms" className={styles.footerLink}>Terms and Conditions</Link>
                    <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                    <Link href="/accessibility" className={styles.footerLink}>Accessibility</Link>
                </Row>
            </Column>
        </Container>
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
    
    // Add JSON-LD structured data for SEO
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Recap - Collaborative Photo Galleries',
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://recap.com',
      description: 'The best collaborative photo gallery for your next wedding, birthday, or celebration.',
      potentialAction: {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://recap.com'}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    return (
        <Column as='main' className={styles.body}>
            {/* Skip to main content link for keyboard users */}
            <a href="#main-content" className={styles.skipLink}>Skip to main content</a>
            
            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            {/* FIXED/STICKY */}
            <Header />

            {/* SCROLLABLE */}
            <div id="main-content" tabIndex={-1} style={{paddingTop: '3vh', width: '100%'}}>
                <Hero />
                <Examples />
                {/* <Uses /> */}
                <Albums />
                {/* <Share /> */}
                <Website />
                <Notifications />
            </div>
            <Footer />
        </Column>
    )
}

export default HomePage