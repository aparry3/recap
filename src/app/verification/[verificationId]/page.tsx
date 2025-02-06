import React, { FC } from "react"
import { redirect } from "next/navigation";
import { selectPerson, updateVerification } from "@/lib/db/personService";
import Confirmation from "@/components/PersonPage/Confirmation";


const VerificationPage: FC<{params: {verificationId: string}}> = async ({params}) => {
    let person
    try {
        const verification = await updateVerification(params.verificationId, true)
        person = await selectPerson(verification.personId)
    } catch (e: any) {
        return redirect('/')
    }
    return (
        <Confirmation name={person.name} />
    )
}

export default VerificationPage;