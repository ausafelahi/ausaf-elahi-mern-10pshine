const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Nodus. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-teal-500">
            Privacy
          </a>
          <a href="#" className="hover:text-teal-500">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
