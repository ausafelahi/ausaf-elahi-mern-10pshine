import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div>
      <nav className="border-b">
        <div className="flex items-center justify-between py-4 px-6">
          <img src="/Nodus.png" alt="Nodus" height="auto" width="120px" />
          <div className="flex items-center gap-6 px-12">
            <ModeToggle />
            <Button className="bg-teal-500 hover:bg-teal-800">Sign In</Button>
            <Button className="bg-teal-500 hover:bg-teal-800">Sign Up</Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
