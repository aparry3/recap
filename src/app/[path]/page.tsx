import React, { FC } from "react"
import App from "./App";


const GalleryPage: FC<{params: {path: string}}> = async ({params}) => {
    // const ipAddress = getIpAddress(headerList)

    return (
        <App />
    )
}

export default GalleryPage;