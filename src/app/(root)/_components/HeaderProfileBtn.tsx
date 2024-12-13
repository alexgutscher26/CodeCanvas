"use client";
import LoginButton from "@/components/LoginButton";
import { UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import { useUser } from "@clerk/nextjs";

function HeaderProfileBtn() {
  const { isSignedIn } = useUser();

  return (
    <>
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Profile"
            labelIcon={<User className="size-4" />}
            href="/profile"
          />
        </UserButton.MenuItems>
      </UserButton>

      {/* Conditional rendering based on user authentication state */}
      {!isSignedIn && <LoginButton />}
    </>
  );
}
export default HeaderProfileBtn;
