import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryProducts, Product } from "@/data/products";
import { ShoppingCart, Leaf, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (category) {
      const categoryProducts = getCategoryProducts(category);
      setProducts(categoryProducts);
      
      if (categoryProducts.length === 0) {
        navigate("/");
      }
    }
  }, [category, navigate]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      description: product.description,
      sourceUrl: `https://example.com/products/${product.id}`,
    });
  };

  const getCategoryTitle = () => {
    if (!category) return "";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4 hover:bg-primary/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-primary to-accent w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">{getCategoryTitle()}</h1>
                <p className="text-muted-foreground mt-1">
                  Eco-friendly alternatives for a sustainable lifestyle
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingCart className="h-4 w-4" />
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart</span>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <Badge variant="secondary" className="bg-nature/10 text-nature border-nature/20">
                        <Leaf className="h-3 w-3 mr-1" />
                        Eco
                      </Badge>
                    </div>
                    <CardDescription className="text-sm font-medium text-foreground/70">
                      {product.brand}
                    </CardDescription>
                    <p className="text-2xl font-bold text-primary mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    
                    <div className="bg-nature/5 border border-nature/20 rounded-md p-3">
                      <p className="text-xs font-semibold text-nature mb-1 flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        Eco Feature
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.ecoFeature}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="eco"
                      className="w-full mt-auto"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryProducts;
