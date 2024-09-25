import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
        return new Response("Token não encontrado", { status: 400 });
    }

    //verificar se existe o token na banco
    const verifyToken = await db.verificationToken.findFirst({
        where: {
            token
        }
    })

    if (!verifyToken) {
        return new Response("Token não encontrado", { status: 400 });
    }

    //verificar se token expirou
    if (verifyToken.expires < new Date()) {
        return new Response("Token expirado", { status: 400 });
    }

    //buscar usuário com base no email do token recebido
    const user = await db.user.findUnique({
        where: {
            email: verifyToken.identifier
        }
    });

    //checar se email já foi verificado
    if (user?.emailVerified) {
        return new Response("Email já foi verificado", { status: 400 });
    }

    //se não foi verificado fazer um update no user.emailVerified colocando a data e horário atual
    await db.user.update({
        where: {
            email: verifyToken.identifier
        },
        data: {
            emailVerified: new Date()
        }
    })

    //eliminar o token após a verificação
    await db.verificationToken.delete({
        where: {
            identifier: verifyToken.identifier
        },
    });

    return redirect("/login?verified=true");
}


