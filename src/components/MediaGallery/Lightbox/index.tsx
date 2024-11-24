import { FC, memo, useState, useEffect, useCallback } from "react";
import { Column, Container, Row, Text } from "react-web-layout-components";
import styles from './Lightbox.module.scss'
import useWindowSize from "@/helpers/hooks/window";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { downloadIcon, facebookIcon, instagramIcon, leftIcon, rightIcon, xIcon } from "@/lib/icons";
import { downloadUrl } from "@/helpers/files";
import useGallery from "@/helpers/providers/gallery";
// import { sharePhotoToFacebook } from "@/helpers/share";

interface LightBoxProps {
    index: number
    total: number
    image?: string;
    onClose: () => void;
    prevImage?: string;
    nextImage?: string;
    onNext: () => void;
    onPrevious: () => void;
    contentType?: 'image' | 'video'
  }
  
const LightBox: FC<LightBoxProps> = memo(({ image, index, total, onClose, prevImage, nextImage, onNext, onPrevious, contentType = 'image' }) => {
    const {gallery} = useGallery()
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const {width, height} = useWindowSize()

    const handleKeyDown = (e: KeyboardEvent) => {
        if (isAnimating) return;

        if (e.key === "ArrowRight") {
            triggerAnimation("next");
        } else if (e.key === "ArrowLeft") {
            triggerAnimation("prev");
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isAnimating) return;
        setTouchStartX(e.touches[0].clientX);
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isAnimating || touchStartX === null || touchStartY === null) return;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY

        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
            setTranslateY(deltaY);
            setTranslateX(0);
        } else {
            setTranslateX(deltaX);
            setTranslateY(0);
        }
        console.log(deltaX, deltaY)
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (isAnimating || touchStartX === null) return;

        const threshold = 100; // Minimum swipe distance to trigger navigation
        if (translateX > threshold) {
            // Swipe right (previous photo)
            triggerAnimation("prev");
        } else if (translateX < -threshold ) {
            // Swipe left (next photo)
            triggerAnimation("next");
        } else if (translateY > threshold) {
            // Swipe down (close lightbox)
            triggerAnimation();
        } else {
            setTranslateX(0);
            setTranslateY(0);
        }     
        setTouchStartX(null);
        setTouchStartY(null);
    };

  
    useEffect(() => {
        if (image) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [image])

    const triggerAnimation = (direction?: "next" | "prev") => {
        setIsAnimating(true);

        const deltaX = direction === "next" ? -1 * (width || 200) : direction === "prev" ? 1 * (width || 200) : 0;
        const deltaY = !direction ? (height || 700) : 0;
        // Animate swipe
        setTranslateX(deltaX);
        setTranslateY(deltaY);

        // Wait for animation to complete before triggering callback
        setTimeout(() => {
            setTranslateX(0); // Reset translation
            setTranslateY(0); // Reset translation
            setIsAnimating(false);

            if (direction === "next") {
                onNext();
            } else if (direction === "prev") {
                onPrevious();
            } else {
                onClose()
            }
        }, 300); // Match the animation duration
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    const download = useCallback(() => {
        if (image) {
            downloadUrl(image, `${gallery.name.replace(' ', '_')}_${index}`)
        }
    }, [image])

    // const share = useCallback(() => {
    //     if (image) {
    //         sharePhotoToFacebook(image)
    //     }
    // }, [image])

    useEffect(() => {
        if (image) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [image, isAnimating]);


    return image ? (
        <Column className={styles.lightBox} 
            style={{
                transform: `translateY(${translateY}px)`,
                transition: isAnimating ? "transform 0.3s ease" : "none",
            }}
        >
            <Container className={styles.lightBoxBackground} />
            <Container className={styles.lightboxBlur} />
            <Row className={styles.lightboxHeader} onClick={onClose}>
                <Container className={styles.headerIconContainer}>
                    <FontAwesomeIcon icon={xIcon} className={styles.icon} />
                </Container>
            </Row>
            <Container className={styles.lightboxContentContainer}>
            <Container
                className={styles.lightBoxContent}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: isAnimating ? "transform 0.3s ease" : "none",
                }}
                >
                    <Container className={`${styles.lightboxImageContainer} ${styles.left}`}>
                        <img
                            onClick={handleImageClick}
                            src={prevImage} 
                            alt="image" 
                            className={`${styles.lightBoxImage}`}
                            loading="lazy"/>
                    </Container>
                    <Container className={`${styles.lightboxImageContainer}`}>
                        {contentType === "video" ? (
                            <video id="hover-video" src={image} muted loop autoPlay playsInline className={styles.lightBoxImage} />
                        ) : (
                            <img
                            onClick={handleImageClick}
                            src={image} 
                            alt="image" 
                            className={`${styles.lightBoxImage}`}
                            loading="lazy"/>
                        )}

                    </Container>
                    <Container className={`${styles.lightboxImageContainer} ${styles.right}`}>
                        <img
                            onClick={handleImageClick}
                            src={nextImage} 
                            alt="image" 
                            className={`${styles.lightBoxImage}`}
                            loading="lazy"/>

                    </Container>
            </Container>
            <Container className={styles.lightboxControls} >
                <Container className={`${styles.controlContainer} ${styles.leftArrow}`} onClick={() => triggerAnimation("prev")}>
                    <FontAwesomeIcon icon={leftIcon} className={styles.icon} />
                </Container>
                <Container className={`${styles.controlContainer} ${styles.rightArrow}`} onClick={() => triggerAnimation("next")}>
                    <FontAwesomeIcon icon={rightIcon} className={styles.icon} />
                </Container>
            </Container>
            </Container>
            <Container className={styles.lightboxDetails}>
                <Container className={styles.countContainer}>
                    <Text size={1.8}>{index}/{total}</Text>
                </Container>
                <Container>
                    <Container className={styles.brandIconContainer} onClick={download}>
                        <FontAwesomeIcon icon={downloadIcon} className={styles.icon} />
                    </Container>
                    {/* <Container className={styles.brandIconContainer} onClick={share}>
                        <FontAwesomeIcon icon={facebookIcon} className={styles.icon} />
                    </Container>
                    <Container className={styles.brandIconContainer}>
                        <FontAwesomeIcon icon={instagramIcon} className={styles.icon} />
                    </Container>     */}
                </Container>

            </Container>
        </Column>
    ) : <></>
})

export default LightBox