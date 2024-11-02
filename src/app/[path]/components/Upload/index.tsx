"use client";
import React,{ ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react"
import { Column, Row, Container, Text } from "react-web-layout-components"
import styles from './Upload.module.scss'
import  NextImage from "next/image"
import Button from "@/components/Button"
import { usePathname } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { uploadIcon } from "@/lib/icons";


interface OrientationImage {
    url: string;
    isVertical: boolean;
}
const Upload: FC = () => {
    const pathname = usePathname()
    const name = pathname.replace('/', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagesWithOrientation, setImagesWithOrientation] = useState<OrientationImage[]>([]);

    const handleButtonClick = useCallback(() => {
        console.log(fileInputRef.current)
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [fileInputRef]);
  
  
    const getImageOrientation = async (imageFile: File): Promise<OrientationImage>  => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = () => {
          const isVertical = img.height > img.width;
          URL.revokeObjectURL(img.src); // Clean up
          resolve({ url: URL.createObjectURL(imageFile), isVertical });
        };
        img.onerror = () => {
          // In case of error, default to landscape
          resolve({ url: URL.createObjectURL(imageFile), isVertical: false });
        };
      });
    };
  
    const loadImages = async (images: File[]) => {
        const imagesData = await Promise.all(
          images.map(image => getImageOrientation(image))
        );
        setImagesWithOrientation((prevImages) => [...prevImages, ...imagesData]);
      };

      
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      // Optionally, you can limit the number of files or perform other validations here
      
      loadImages(files);
    };
  
    return (
        <Column className={styles.upload}>
            <Container className={styles.header}>
                <Container className={styles.headerIcon}>
                    <NextImage src='/branding/icon.svg' alt='logo' className={styles.icon} layout='intrinsic' height={100} width={100}/>    
                </Container>
                <Row className={styles.headerTitle}>
                    <Container className={styles.title}>
                        <Text className={styles.titleText}>
                            {name}
                        </Text>
                    </Container>
                    <Container className={styles.info}>
                        <Text className={styles.infoText}>
                            15 Collaborators
                        </Text>
                    </Container>
                </Row>
                <Container className={styles.action}>
                    <Button className={styles.button} onClick={handleButtonClick}>
                        <Text size={1}>
                            + Upload
                        </Text>
                    </Button>
                    <Container className={styles.icon} onClick={handleButtonClick}>
                        <FontAwesomeIcon icon={uploadIcon} />
                    </Container>
                </Container>
            </Container>
            <Column className={styles.content}>
                <Column className={styles.separator}>
                    <Row className={styles.separatorTitle}>
                        <Text size={2}>Uploads</Text>
                        <Container className={styles.mediaInfo}>
                            <Container className={styles.mediaType}>
                                <Text size={1.2}>10 Photos</Text>
                            </Container>
                            <Container className={styles.mediaType}>
                                <Text size={1.2}>5 Videos</Text>
                            </Container>
                        </Container>
                    </Row>
                    <Container className={styles.separatorLine}/>
                </Column>
            </Column>
            <Column className={styles.uploadElements}>
                <Column className={styles.gallery}>
                {imagesWithOrientation.map((image) => (
                    <Container key={image.url} className={`${styles.imageContainer} ${image.isVertical ? styles.vertical : ''}`}>
                        <NextImage src={image.url} alt="image" className={`${styles.image}`} layout='intrinsic' height={350} width={350}/>
                    </Container>
                ))}
                </Column>
            </Column>
            <Container className={styles.actionBar}>
                <Container className={styles.mediaInfo}>
                    <Container className={styles.mediaType}>
                        <Text size={1.2}>10 Photos</Text>
                    </Container>
                    <Container className={styles.mediaType}>
                        <Text size={1.2}>5 Videos</Text>
                    </Container>
                </Container>
                <Container className={styles.button}>
                    <Button>
                        <Text>Cancel</Text>
                    </Button>
                </Container>
                <Container className={styles.button}>
                    <Button>
                        <Text>Confirm</Text>
                    </Button>
                </Container>
            </Container>
            <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

        </Column>
    )
}

export default Upload