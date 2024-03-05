import { MessageCircleQuestion, Settings, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle.tsx";

export default function Nav() {
  return (
    <div className="flex space-x-4">
      <Link to="/settings">
        <Settings
          strokeWidth={1}
          size={32}
          className="cursor-pointer hover:stroke-blue-400"
        />
      </Link>
      <Link to="/names">
        <UsersRound
          strokeWidth={1}
          size={32}
          className="cursor-pointer hover:stroke-blue-400"
        />
      </Link>
      <Link to="/questions">
        <MessageCircleQuestion
          strokeWidth={1}
          size={32}
          className="cursor-pointer hover:stroke-blue-400"
        />
      </Link>
      <ModeToggle />
    </div>
  );
}
