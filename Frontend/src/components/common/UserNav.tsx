import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Settings as Gear } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProps {
  email: string;
  name: string;
  avatar: string;
}

interface UserNavProps {
  user: UserProps;
}

export function UserNav({ user }: UserNavProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleMyProfileClick = () => {
    navigate("/settings/contact-info");
  };

  const handleSettingsClick = () => {
    navigate("/settings/account-security");
  };

  // Get the first letter of name safely or use a fallback
  const getNameInitial = () => {
    if (!user || !user.name || user.name.length === 0) {
      return "U"; // Default fallback if name is not available
    }
    return user.name[0];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full cursor-pointer"
          >
            <Avatar className="h-8 w-8 border-2 border-[#5F24E0] cursor-pointer">
              {user?.avatar && (
                <AvatarImage
                  src={user.avatar}
                  alt={user?.name || "User"}
                  className="cursor-pointer"
                />
              )}
              <AvatarFallback className="cursor-pointer">
                {getNameInitial()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 p-4 bg-[#EFE9FC] rounded-l-lg rounded-br-lg rounded-bl-lg font-normal text-left text-lg font-['Archivo'] -translate-x-8"
        align="end"
        sideOffset={8}
        side="bottom"
        forceMount
      >
        <DropdownMenuItem
          onClick={handleMyProfileClick}
          className="flex items-center gap-2 text-[#0E1117] font-normal text-lg font-['Archivo'] p-0 w-full justify-start cursor-pointer mb-4"
        >
          <User size={16} color="#0E1117" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSettingsClick}
          className="flex items-center gap-2 text-[#0E1117] font-normal text-lg font-['Archivo'] p-0 w-full justify-start cursor-pointer mb-4"
        >
          <Gear size={16} color="#0E1117" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={signOut}
          className="flex items-center gap-2 text-[#0E1117] font-normal text-lg font-['Archivo'] p-0 w-full justify-start cursor-pointer"
        >
          <LogOut size={16} color="#0E1117" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
