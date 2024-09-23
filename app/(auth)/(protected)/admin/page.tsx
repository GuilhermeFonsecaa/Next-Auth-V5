import LogoutButton from "@/app/components/logout-button";
import { auth } from "@/auth";

const AdminPage = async () => {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        return <div>Você não é um administrador</div>
    }

    return (
        <div className="container">
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <LogoutButton />
        </div>
    )
}

export default AdminPage;