import { auth } from "@/auth";

export default async function DashboardPage() {
    const session = await auth();

    if (!session) {
        return <div>Não autenticado</div>
    }

    return (
        <div className="container">
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}