import React, { FC } from "react"
import Dashboard from "./Dashboard";


const GalleryPage: FC<{params: {path: string}}> = async ({params}) => {

    // const ipAddress = getIpAddress(headerList)

    return (
        <Dashboard />
    )
}

export default GalleryPage;