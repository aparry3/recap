"use client";
import React, { useState, ReactNode } from 'react';
import styles from './Accordion.module.scss';
import { Column, Container, Row, Text } from 'react-web-layout-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { downIcon, upIcon } from '@/lib/icons';

interface AccordionProps {
  title: string;
  content: ReactNode;
  icon?: any;
}

const Accordion: React.FC<AccordionProps> = ({ title, content, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Column className={styles.accordion}>
      <Row className={`${styles.accordionHeader} ${isOpen ? styles.open : ''}`} onClick={toggleAccordion}>
        <Container className={styles.iconContainer}>
          {icon && <FontAwesomeIcon icon={icon} className={styles.sectionIcon} />}
        </Container>
        <Container className={styles.titleContainer}>
          <Text size={1.5} weight={500} className={styles.accordionTitle}>
            {title}
          </Text>
        </Container>
        <Container className={styles.toggleIcon}>
          <FontAwesomeIcon icon={isOpen ? upIcon : downIcon} className={styles.chevron} />
        </Container>
      </Row>
      
      {isOpen && (
        <Container className={styles.accordionContent}>
          {content}
        </Container>
      )}
    </Column>
  );
};

export default Accordion; 