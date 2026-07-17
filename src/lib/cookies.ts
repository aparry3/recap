'use server'

import { cookies } from "next/headers";


export const setCookie = async (key: string, value: string) => {
    const cookieStore = await cookies()
    cookieStore.set(key, value, {
        path: '/',
        httpOnly: true,
      });
}
