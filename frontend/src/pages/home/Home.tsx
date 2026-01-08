import "../../App.css";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Features from "@/layout/Features";

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <section className="px-4 py-16 mx-auto text-center md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl text-teal-500">
            Welcome to Nodus!
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Your Personal Notes Taking Application For New Ideas
          </p>
          <Link to="/dashboard">
            <Button className="bg-teal-500 hover:bg-teal-800">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
      <div className="max-w-4xl mx-auto">
        <Features />
      </div>
    </div>
  );
}

export default Home;
