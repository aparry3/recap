import { SVGProps } from "react"

export const Actions: React.FC<SVGProps<SVGSVGElement>> = (props) => {
    return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle className='dot' cx="17.9998" cy="27.9997" r="4" fill="#CA9B8C"/>
        <circle className='dot' cx="27.5992" cy="28" r="4" fill="#CA9B8C"/>
        <circle className='dot' cx="37.1993" cy="28.0001" r="4" fill="#CA9B8C"/>
        <circle className='outline' cx="27.9998" cy="27.9996" r="25.4545" fill="none" stroke="#CA9B8C" stroke-width="5.09094"/>
    </svg>
    )
}