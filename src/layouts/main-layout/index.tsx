import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, Instagram, Facebook, Youtube } from "lucide-react";

// Helper function to convert category name to URL slug
const getCategorySlug = (categoryName: string): string => {
  const slugMap: Record<string, string> = {
    Product: "product",
    People: "people",
    Food: "food",
    "E-commerce": "ecommerce",
    Timekeeper: "timekeeper",
  };
  return slugMap[categoryName] || categoryName.toLowerCase();
};

const categories = ["Product", "People", "Food", "E-commerce", "Timekeeper"];

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen lg:min-h-screen h-screen lg:h-auto bg-background flex flex-col">
      {/* Mobile Header with Sheet */}
      <div className="lg:hidden bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/">
          <Typography
            variant="h3"
            className="font-bold text-foreground hover:opacity-80 transition-opacity cursor-pointer"
          >
            Piyush Gogawale
          </Typography>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="bg-white w-full">
            <div className="px-0 pb-4 pt-6">
              <nav className="space-y-2 flex flex-col items-center">
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-center uppercase text-foreground"
                    asChild
                  >
                    <Link to="/">Home</Link>
                  </Button>
                </SheetClose>
                {categories.map((item) => (
                  <SheetClose key={item} asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-center uppercase text-foreground"
                      asChild
                    >
                      <Link to={`/work/${getCategorySlug(item)}`}>{item}</Link>
                    </Button>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-center mt-4 uppercase text-foreground"
                  >
                    About
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-center uppercase text-foreground"
                  >
                    Contact
                  </Button>
                </SheetClose>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-border h-screen sticky top-0 overflow-y-auto">
          <div className="p-6 flex flex-col h-full">
            <header className="mb-6">
              <Link to="/">
                <Typography
                  variant="h2"
                  className="font-bold border-none pb-0 text-foreground hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Piyush Gogawale
                </Typography>
              </Link>
            </header>

            <Separator className="mb-6" />

            <nav className="space-y-2 flex-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-left uppercase"
                asChild
              >
                <Link to="/">Home</Link>
              </Button>
              {categories.map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  className="w-full justify-start text-left uppercase"
                  asChild
                >
                  <Link to={`/work/${getCategorySlug(item)}`}>{item}</Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-left mt-4 uppercase"
              >
                About
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left uppercase"
              >
                Contact
              </Button>
            </nav>

            <Separator className="mt-6 mb-6" />

            <div className="flex gap-4 justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
                asChild
              >
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
                asChild
              >
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted"
                asChild
              >
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              © Piyush Gogawale
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto lg:overflow-hidden">
          <main className="px-4 pt-4 pb-0 lg:p-8 lg:flex-1 min-h-0">{children}</main>

          {/* Mobile Footer */}
          <footer className="lg:hidden py-2 px-4 flex-shrink-0">
            <div className="flex justify-center mb-1">
              <Separator className="w-[80%]" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex gap-1 justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  asChild
                >
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4 text-foreground" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  asChild
                >
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4 text-foreground" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  asChild
                >
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-4 w-4 text-foreground" />
                  </a>
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Piyush Gogawale
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
