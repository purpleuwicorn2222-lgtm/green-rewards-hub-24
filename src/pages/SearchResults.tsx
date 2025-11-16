import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, ShoppingCart, Leaf, ArrowLeft, Loader2 } from "lucide-react";
import { searchEcoProducts } from "@/services/productSearch";
import { SearchProduct } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const { addItem } = useCart();
  const { toast } = useToast();

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<SearchProduct[]>({
    queryKey: ["search", query],
    queryFn: () => searchEcoProducts(query),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleAddToCart = (product: SearchProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      description: product.description,
      sourceUrl: product.sourceUrl,
    });
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
            
            <h1 className="text-4xl font-bold mb-2">
              Search Results
            </h1>
            {query && (
              <p className="text-muted-foreground">
                Showing results for: <span className="font-semibold text-foreground">"{query}"</span>
              </p>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(10)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <Card className="p-12 text-center">
              <p className="text-destructive mb-4">
                Failed to load products. Please try again.
              </p>
              {error instanceof Error && (
                <p className="text-sm text-muted-foreground">{error.message}</p>
              )}
              <Button onClick={() => navigate("/")} className="mt-4">
                Go Back Home
              </Button>
            </Card>
          )}

          {/* Results */}
          {!isLoading && !isError && products && (
            <>
              {products.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground text-lg mb-4">
                    No products found for "{query}"
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Try a Different Search
                  </Button>
                </Card>
              ) : (
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Found {products.length} eco-friendly products
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
                      >
                        <div className="aspect-square overflow-hidden bg-muted relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback image if loading fails
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop";
                            }}
                          />
                          <Badge
                            variant="secondary"
                            className="absolute top-2 right-2 bg-nature/90 text-white border-none"
                          >
                            <Leaf className="h-3 w-3 mr-1" />
                            Eco
                          </Badge>
                        </div>
                        
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          
                          {product.sourceName && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {product.sourceName}
                            </p>
                          )}
                          
                          <p className="text-2xl font-bold text-primary mb-3">
                            {product.price > 0 ? `$${product.price.toFixed(2)}` : "Price on site"}
                          </p>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                            {product.description}
                          </p>
                          
                          <div className="space-y-2 mt-auto">
                            <Button
                              onClick={() => handleAddToCart(product)}
                              variant="eco"
                              className="w-full"
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Add to Cart
                            </Button>
                            
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => window.open(product.sourceUrl, "_blank")}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Source
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;

