import { redirect } from "next/navigation";


const VerificationPage = async ({params}: {params: Promise<{verificationId: string}>}) => {
    const {verificationId} = await params
    return redirect(`/api/auth/verify/${verificationId}`)
}

export default VerificationPage;
