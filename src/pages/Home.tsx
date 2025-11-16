import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Award } from "lucide-react";
import heroImage from "@/assets/hero-nature.jpg";
import patagoniaLogo from "@/assets/brands/patagonia.jpg";
import pelaLogo from "@/assets/brands/pela.jpg";
import thinxLogo from "@/assets/brands/thinx.jpg";
import whoGivesACrapLogo from "@/assets/brands/who-gives-a-crap.jpg";
import greenToysLogo from "@/assets/brands/green-toys.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome to Environmental Shopping!
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto animate-fade-in">
              Shop eco-friendly products and earn points to redeem for rewards while helping the planet!
            </p>
            
            <div className="animate-fade-in flex justify-center mb-8">
              <SearchBar />
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              <p className="w-full text-sm text-muted-foreground mb-2">Browse by category:</p>
              {["makeup", "skincare", "clothes", "tampons & pads", "furniture", "toilet paper", "jackets", "shoes", "toys", "straws"].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/category/${term}`)}
                  className="text-xs hover:bg-nature/10 hover:border-nature"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Shop With Us?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-primary to-accent w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Leaf className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Eco-Friendly Products</h3>
                <p className="text-muted-foreground text-center">
                  Discover sustainable products that help reduce your environmental footprint.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-accent to-sky w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Recycle className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Earn Rewards</h3>
                <p className="text-muted-foreground text-center">
                  Upload your receipts and earn points for every eco-friendly purchase.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-earth to-secondary w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">Redeem Gift Cards</h3>
                <p className="text-muted-foreground text-center">
                  Use your earned points to get gift cards from your favorite brands.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Eco-Friendly Partners Section */}
        <section className="py-16 bg-card border-t border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Our Eco-Friendly Partners
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We're proud to partner with these sustainable brands committed to environmental responsibility
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center">
              {/* Patagonia */}
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src={patagoniaLogo}
                  alt="Patagonia"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
                <p className="text-sm font-medium text-foreground">Patagonia</p>
              </div>
              
              {/* Pela */}
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src={pelaLogo}
                  alt="Pela"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
                <p className="text-sm font-medium text-foreground">Pela</p>
              </div>
              
              {/* Thinx */}
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src={thinxLogo}
                  alt="Thinx"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
                <p className="text-sm font-medium text-foreground">Thinx</p>
              </div>
              
              {/* Who Gives A Crap */}
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src={whoGivesACrapLogo}
                  alt="Who Gives A Crap"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
                <p className="text-sm font-medium text-foreground text-center">Who Gives A Crap</p>
              </div>
              
              {/* Green Toys */}
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src={greenToysLogo}
                  alt="Green Toys"
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
                <p className="text-sm font-medium text-foreground">Green Toys</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
