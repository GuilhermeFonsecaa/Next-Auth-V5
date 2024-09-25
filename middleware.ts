import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth: middleware } = NextAuth(authConfig);

const publicRoutes = [
    "/login",
    "/register",
    "api/auth/verify-email",
]

const apiAuthPrefix = "/api/auth";

export default middleware((req) => {
    const { nextUrl, auth } = req;
    const isLoggedIn = !!auth?.user;

    if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
        return NextResponse.next();
      }

    if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
});

export const config = {
    matcher: [
        // middleware ignora qualquer rota que corresponda a arquivos estáticos e recursos internos do Next.js
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // middleware será aplicado a todas as rotas que começam com /api
        '/(api|trpc)(.*)',
    ],
}