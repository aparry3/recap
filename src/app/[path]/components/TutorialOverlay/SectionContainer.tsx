import React, { FC, useState } from 'react';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { downIcon } from '@/lib/icons';
import Image from 'next/image';
import styles from './index.module.scss';


interface StepItem {
  title: string;
  description?: string;
  image: string;
}

interface Step {
  items: StepItem[];
}

interface Section {
  title: string;
  description?: string;
  icon: any; // FontAwesome icon
  subSections: {title?: string, description?: string, steps: Step[]}[];
}

interface SectionContainerProps {
  section: Section;
}

const SectionContainer: FC<SectionContainerProps> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Container className={styles.sectionContainer}>
      <Column className={styles.section}>
        <Container className={styles.sectionTitle} onClick={toggleExpand}>
          <Container className={styles.sectionIcon}>
            <FontAwesomeIcon icon={section.icon} className={styles.icon}/>
          </Container>
          <Container className={styles.sectionTitleText}>
            <Text size={2.5}>
              {section.title}
            </Text>
          </Container>
          <Container className={styles.sectionIcon}>
            <FontAwesomeIcon 
              icon={downIcon} 
              className={`${styles.icon} ${styles.chevron} ${isExpanded ? styles.expanded : ''}`}
            />
          </Container>
        </Container>
        {isExpanded && (
          <Column className={styles.sectionContent}>
            {section.description && <Container className={styles.sectionDescription}>
              <Text className={styles.sectionDescriptionText}>
                {section.description}
              </Text>
            </Container>}
            {section.subSections.map((subsection, subsectionIndex) => (
              <React.Fragment key={subsectionIndex}>
                <Container className={styles.subsectionTitleContainer}>
                  <Text className={styles.subsectionTitle}>
                    {subsection.title}
                  </Text>
                </Container>
                {subsection.steps.map((step, stepIndex) => (
                  <Container key={stepIndex} className={styles.sectionContentItem}>
                    <Row className={styles.sectionStepNumber}>
                      <Text size={4} weight={600}>
                        {stepIndex + 1}.
                      </Text>
                    </Row>
                    <Column className={styles.sectionStep}>
                      {step.items.map((item, itemIndex) => (
                        <Column key={itemIndex} className={styles.sectionStepItem}>
                          <Container className={styles.sectionStepItemTextContainer}>
                            <Text className={styles.sectionStepItemText}>
                              {item.title}
                            </Text>
                          </Container>
                          {item.description && (
                            <Container className={styles.sectionStepItemDescription}>
                              <Text size={1.5}>{item.description}</Text>
                            </Container>
                          )}
                          <Container className={styles.sectionStepItemImageContainer}>
                            <Image 
                              src={item.image} 
                              alt={item.title} 
                              layout='intrinsic' 
                              height={100} 
                              width={100} 
                              className={styles.sectionStepItemImage}
                            />
                          </Container>
                        </Column>
                      ))}
                    </Column>
                    <Column className={styles.sectionStepSpacer} />
                  </Container>
                ))}
                {subsectionIndex !== section.subSections.length - 1 && (
                  <Container className={styles.sectionDivider} />
                )}
              </React.Fragment>
            ))}
          </Column>
        )}
      </Column>
    </Container>
  );
};

export default SectionContainer; 