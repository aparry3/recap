import React from "react"
import { redirect } from "next/navigation";
import { selectPerson, updateVerification } from "@/lib/db/personService";
import Confirmation from "@/components/PersonPage/Confirmation";
import { selectGallery } from "@/lib/db/galleryService";


const VerificationPage = async ({params}: {params: Promise<{verificationId: string}>}) => {
    let person
    let gallery
    try {
        const {verificationId} = await params
        const verification = await updateVerification(verificationId, true)
        person = await selectPerson(verification.personId)
        if (verification.galleryId) {
            gallery = await selectGallery(verification.galleryId)
        }
    } catch (e: any) {
        return redirect('/')
    }
    if (!person) {
        return redirect('/')
    }
    return (
        <Confirmation person={person} gallery={gallery}/>
    )
}

export default VerificationPage;
