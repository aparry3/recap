import { Media } from "@/lib/types/Media";
import { FC, memo, useState, useEffect } from "react";
import { Container } from "react-web-layout-components";
import styles from './Lightbox.module.scss'
import useWindowSize from "@/helpers/hooks/window";

interface LightBoxProps {
    image?: string;
    onClose: () => void;
    prevImage?: string;
    nextImage?: string;
    onNext: () => void;
    onPrevious: () => void;


  }
  
const LightBox: FC<LightBoxProps> = memo(({ image, onClose, prevImage, nextImage, onNext, onPrevious }) => {
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [translateX, setTranslateX] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const {width} = useWindowSize()
    const handleTouchStart = (e: React.TouchEvent) => {
        if (isAnimating) return;
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isAnimating || touchStartX === null) return;
        const touchX = e.touches[0].clientX;
        setTranslateX(touchX - touchStartX);
    };

    const handleTouchEnd = () => {
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
        setTranslateX(direction === "next" ? -0.95 * (width || 200) : 0.95 * (width || 200));

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


    return image ? (
        <Container className={styles.lightBox} >
            <Container className={styles.lightBoxBackground} onClick={onClose} />
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
                <img
                    src={prevImage} 
                    alt="image" 
                    className={`${styles.lightBoxImage} ${styles.left}`}
                    style={{ position: "absolute", left: "-100%" }}
                    loading="lazy"/>

                <img
                    src={image} 
                    alt="image" 
                    className={`${styles.lightBoxImage}`}
                    style={{ position: "absolute", left: "5%" }}
                    loading="lazy"/>
                <img
                    src={nextImage} 
                    alt="image" 
                    className={`${styles.lightBoxImage} ${styles.right}`}
                    style={{ position: "absolute", left: "100%" }}
                    loading="lazy"/>

                </Container>
        </Container>
    ) : <></>
})

export default LightBox