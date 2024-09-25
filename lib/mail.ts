import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendEmailVerification = async (email: string, token: string) => {
    try {
        await resend.emails.send({
            from: "NextAuth js <onboarding@resend.dev>",
            to: email,
            subject: "Verifique seu email",
            html: `
        <p>Clique no link para verificar seu email</p>
        <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}">Verificar email</a>
      `,
        });

        return {
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            error: true,
        };
    }
};
