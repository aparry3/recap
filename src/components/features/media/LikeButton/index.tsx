import { FC } from "react";
import { Container, Text } from "react-web-layout-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { heartIcon, heartRegularIcon } from "@/lib/icons";
import { useLikes } from "@/helpers/hooks/useLikes";
import styles from './LikeButton.module.scss';

interface LikeButtonProps {
    mediaId: string;
    variant?: 'default' | 'overlay';
    showCount?: boolean;
}

const LikeButton: FC<LikeButtonProps> = ({ mediaId, variant = 'default', showCount = true }) => {
    const { isLiked, likesCount, toggleLike } = useLikes(mediaId);

    return (
        <Container 
            className={`${styles.likeButton} ${styles[variant]}`} 
            onClick={(e) => {
                e.stopPropagation();
                toggleLike();
            }}
        >
            <FontAwesomeIcon 
                icon={isLiked ? heartIcon : heartRegularIcon} 
                className={`${styles.icon} ${isLiked ? styles.liked : ''}`} 
            />
            {showCount && (
                <Text size={1.2} className={styles.likeCount}>
                    {likesCount}
                </Text>
            )}
        </Container>
    );
};

export default LikeButton; 