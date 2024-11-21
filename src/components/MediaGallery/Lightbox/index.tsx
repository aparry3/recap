import { FC, memo, useState, useEffect, useCallback } from "react";
import { Column, Container, Text } from "react-web-layout-components";
import styles from './Lightbox.module.scss'
import useWindowSize from "@/helpers/hooks/window";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { downloadIcon, facebookIcon, instagramIcon } from "@/lib/icons";
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
  }
  
const LightBox: FC<LightBoxProps> = memo(({ image, index, total, onClose, prevImage, nextImage, onNext, onPrevious }) => {
    const {gallery} = useGallery()
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [translateX, setTranslateX] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const {width} = useWindowSize()

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
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isAnimating || touchStartX === null) return;
        const touchX = e.touches[0].clientX;
        setTranslateX(touchX - touchStartX);
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
        } else {
            setTranslateX(0);
        }     
        setTouchStartX(null);
    };

  
    useEffect(() => {
        if (image) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [image])

    const triggerAnimation = (direction: "next" | "prev") => {
        setIsAnimating(true);

        // Animate swipe
        setTranslateX(direction === "next" ? -1 * (width || 200) : 1 * (width || 200));

        // Wait for animation to complete before triggering callback
        setTimeout(() => {
            setTranslateX(0); // Reset translation
            setIsAnimating(false);

            if (direction === "next") {
                onNext();
            } else {
                onPrevious();
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
        <Column className={styles.lightBox} >
            <Container className={styles.lightBoxBackground} />
            <Container className={styles.lightboxBlur} onClick={onClose} />
            <Container
                className={styles.lightBoxContent}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => onClose()}
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
                        <img
                            onClick={handleImageClick}
                            src={image} 
                            alt="image" 
                            className={`${styles.lightBoxImage}`}
                            loading="lazy"/>

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