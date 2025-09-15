import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Header() {
  const navLink = "text-[15px] font-medium text-foreground/80 hover:text-foreground transition-colors";
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[22px] font-semibold tracking-tight text-foreground">Symptomate</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/about" className={({isActive})=>cn(navLink,isActive && "text-foreground")}>About us</NavLink>
          <NavLink to="/business" className={({isActive})=>cn(navLink,isActive && "text-foreground")}>For business</NavLink>
          <NavLink to="/apps" className={({isActive})=>cn(navLink,isActive && "text-foreground")}>Apps</NavLink>
          <NavLink to="/language" className={({isActive})=>cn(navLink,isActive && "text-foreground")}>English</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="px-5 py-2.5 text-[15px] font-semibold">
            <Link to="/assess">Start assessing</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground/70 mb-3">Symptomate</h3>
          <ul className="space-y-2 text-foreground/80">
            <li><a href="/about" className="hover:text-foreground">About us</a></li>
            <li><a href="/interview" className="hover:text-foreground">Interview</a></li>
            <li><a href="https://infermedica.com/blog" target="_blank" rel="noreferrer" className="hover:text-foreground">Blog</a></li>
            <li><a href="https://infermedica.com/press" target="_blank" rel="noreferrer" className="hover:text-foreground">Press kit</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-foreground/70 mb-3">Get in touch</h3>
          <ul className="space-y-2 text-foreground/80">
            <li><a href="mailto:contact@symptomate.com" className="hover:text-foreground">contact@symptomate.com</a></li>
            <li className="flex gap-4 pt-1">
              <a href="https://www.facebook.com/Symptomate/" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:opacity-80">Facebook</a>
              <a href="https://twitter.com/Symptomate" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:opacity-80">Twitter</a>
              <a href="https://www.instagram.com/symptomate/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:opacity-80">Instagram</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-foreground/70 mb-3">Learn more</h3>
          <p className="text-foreground/80 mb-3">Symptom checker and triage technology powered by <a href="https://infermedica.com/" target="_blank" rel="noreferrer" className="underline underline-offset-4">Infermedica</a>.</p>
          <ul className="flex flex-wrap gap-4 text-foreground/70 text-sm">
            <li><a href="#" className="hover:text-foreground">Terms of service</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-foreground">Cookies Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-6 text-sm text-foreground/60">Infermedica © 2025</div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
