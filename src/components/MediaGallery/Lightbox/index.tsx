import { FC, memo, useState, useEffect, useCallback, useMemo } from "react";
import { Column, Container, Row, Text } from "react-web-layout-components";
import styles from './Lightbox.module.scss'
import useWindowSize from "@/helpers/hooks/window";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Actions, downloadIcon, leftIcon, rightIcon, xIcon, heartIcon, heartRegularIcon } from "@/lib/icons";
import { downloadUrl } from "@/helpers/files";
import useGallery from "@/helpers/providers/gallery";
import Menu, { MenuItem } from "../Menu";
import { useLikes } from "@/helpers/hooks/useLikes";
// import { sharePhotoToFacebook } from "@/helpers/share";

interface LightBoxProps {
    index: number
    mediaId: string,
    personId: string,
    total: number
    image?: string;
    onClose: () => void;
    prevImage?: string;
    nextImage?: string;
    onNext: () => void;
    onPrevious: () => void;
    contentType?: string
  }
  
const LightBox: FC<LightBoxProps> = memo(({ mediaId, personId, image, index, total, onClose, prevImage, nextImage, onNext, onPrevious, contentType }) => {
    const {gallery, album, selectedImages, setSelectedImages, toggleSelectedImage} = useGallery()
    const { isLiked, likesCount, toggleLike } = useLikes(mediaId);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const {width, height} = useWindowSize()
    
    const handleClose = () => {
        setSelectedImages(new Set())
        onClose()
    }

    const closeMenu = () => {
        setSelectedImages(new Set())
    }
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isAnimating) return;

        if (e.key === "ArrowRight") {
            triggerAnimation("next");
        } else if (e.key === "ArrowLeft") {
            triggerAnimation("prev");
        } else if (e.key === "Escape") {
            handleClose();
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
                handleClose()
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

    const menuItems = useMemo(() => {
        return album ? [
            MenuItem.REMOVE,
            MenuItem.ADD,
            MenuItem.DOWNLOAD,
            MenuItem.DELETE,
        ] :  [
            MenuItem.ADD,
            MenuItem.DOWNLOAD,
            MenuItem.DELETE,
        ]
    }, [album])
    return image ? (
        <Column className={styles.lightBox} 
            style={{
                transform: `translateY(${translateY}px)`,
                transition: isAnimating ? "transform 0.3s ease" : "none",
            }}
        >
            <Container className={styles.lightBoxBackground} />
            <Container className={styles.lightboxBlur} />
            <Row className={styles.lightboxHeader}>
                <Container className={styles.headerIconContainer} onClick={handleClose}>
                    <FontAwesomeIcon icon={xIcon} className={styles.icon} />
                </Container>
                <Container className={styles.headerIconContainer} onClick={() => toggleSelectedImage(mediaId, personId)}>
                    <Actions className={styles.icon}/>
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
                    {prevImage && ( 
                        <Container className={`${styles.lightboxImageContainer} ${styles.left}`}>
                            <img
                                onClick={handleImageClick}
                                src={prevImage} 
                                alt="image" 
                                className={`${styles.lightBoxImage}`}
                                loading="lazy"/>
                        </Container> )}
                        <Container className={`${styles.lightboxImageContainer}`}>
                            {contentType?.startsWith('video') ? (
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
                        {nextImage && (
                        <Container className={`${styles.lightboxImageContainer} ${styles.right}`}>
                            <img
                                onClick={handleImageClick}
                                src={nextImage} 
                                alt="image" 
                                className={`${styles.lightBoxImage}`}
                                loading="lazy"/>

                        </Container>)}
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
                    <Text size={1.5}>{index}/{total}</Text>
                </Container>
                <Container>
                    <Container className={styles.brandIconContainer} onClick={toggleLike}>
                        <FontAwesomeIcon icon={isLiked ? heartIcon : heartRegularIcon} className={`${styles.icon} ${isLiked ? styles.liked : ''}`} />
                        <Text size={1.2} className={styles.likeCount}>{likesCount}</Text>
                    </Container>
                    <Container className={styles.brandIconContainer} onClick={download}>
                        <FontAwesomeIcon icon={downloadIcon} className={styles.icon} />
                    </Container>
                </Container>

            </Container>
            {(selectedImages && !!selectedImages.size) && (
                <Menu items={menuItems} selectedImages={selectedImages} onClose={closeMenu}/> 
            )}
        </Column>
    ) : <></>
})

export default LightBox