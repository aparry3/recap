'use-client';
import { ChangeEvent, CSSProperties, FC, HTMLProps } from "react"
import styles from './Input.module.scss';
import { Column, Container } from "react-web-layout-components";


interface InputProps extends Omit<HTMLProps<HTMLInputElement>, 'onChange'> {
    onChange?: (value?: string) => void
    inverse?: boolean
    inputStyle?: CSSProperties
}

const Input: FC<InputProps> = ({value, label, onChange, inputStyle, inverse, style, className, disabled, ...props}) => {
    const id = `input`

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        if (onChange) onChange(target?.value)
    }
    return (
    <Column className={styles.inputContainer}>
        <input className={`${styles.input} ${disabled ? styles.disabled : ''}`} id={id} onChange={(e) => handleChange(e)} value={value} placeholder=" " disabled={disabled}/>
        <label className={styles.label} htmlFor={id}>{label}</label>
        <Container className={styles.dash}/>
    </Column>
    )
}

export default Input;