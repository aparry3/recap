'use server'

import { cookies } from "next/headers";


export const setCookie = (key: string, value: string) => {
    cookies().set(key, value, {
        path: '/',
        httpOnly: true,
      });
}