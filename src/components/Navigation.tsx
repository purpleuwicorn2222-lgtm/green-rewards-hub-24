import { Link, useLocation } from "react-router-dom";
import { Leaf, ShoppingCart, Upload, Award } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Leaf },
    { path: "/shopping-list", label: "Shopping List", icon: ShoppingCart },
    { path: "/upload-receipt", label: "Upload Receipt", icon: Upload },
    { path: "/my-points", label: "My Points", icon: Award },
  ];

  return (
    <nav className="bg-card shadow-md sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">EcoShop</span>
          </Link>
          
          <div className="flex gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:block text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
