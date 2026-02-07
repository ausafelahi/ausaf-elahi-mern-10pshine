import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { ModeToggle } from "@/components/ModeToggle";
import toast from "react-hot-toast";

const Header = () => {
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  const handleLogout = async () => {
    toast.success("Logged out successfully");
    setTimeout(async () => {
      await logout();
    }, 300);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <Link to="/" className="text-xl font-bold">
        <img src="/Nodus.png" alt="Nodus" height="auto" width="120px" />
      </Link>

      {!user ? (
        <div className="flex gap-2">
          <ModeToggle />
          <Link to="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-teal-500 hover:bg-teal-800">Sign Up</Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <ModeToggle />
          <span className="font-medium">{user.name}</span>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
