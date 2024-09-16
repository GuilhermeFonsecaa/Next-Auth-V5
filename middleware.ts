import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
    matcher: [
        // middleware ignora qualquer rota que corresponda a arquivos estáticos e recursos internos do Next.js
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // middleware será aplicado a todas as rotas que começam com /api
        '/(api|trpc)(.*)',
    ],
}