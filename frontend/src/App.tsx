import Features from "./layout/Features";
import "./App.css";
import { Button } from "./components/ui/button";
import Layout from "./layout/Layout";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <section className="px-4 py-16 mx-auto text-center md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-6xl text-teal-500">
              Welcome to Nodus!
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Your Personal Notes Taking Application For New Ideas
            </p>
            <Button className="bg-teal-500 hover:bg-teal-800">
              Get Started
            </Button>
          </div>
        </section>
        <div className="max-w-4xl mx-auto">
          <Features />
        </div>
      </Layout>
    </div>
  );
}

export default App;
