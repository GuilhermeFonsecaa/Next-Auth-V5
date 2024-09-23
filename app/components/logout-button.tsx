"use client"

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
    return (
        <Button onClick={() => signOut({ redirectTo: "/login" })}>LogOut</Button>
    );
}

export default LogoutButton;       

