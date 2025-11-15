import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Mock eco-friendly products
const mockProducts: Product[] = [
  { id: "1", name: "Reusable Bamboo Water Bottle", price: 24.99, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400" },
  { id: "2", name: "Organic Cotton Tote Bag", price: 15.99, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400" },
  { id: "3", name: "Beeswax Food Wraps Set", price: 18.99, image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400" },
  { id: "4", name: "Bamboo Cutlery Set", price: 12.99, image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400" },
  { id: "5", name: "Recycled Glass Water Bottle", price: 22.99, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400" },
  { id: "6", name: "Compostable Phone Case", price: 29.99, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400" },
  { id: "7", name: "Solar-Powered Charger", price: 45.99, image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400" },
  { id: "8", name: "Natural Bamboo Toothbrush", price: 8.99, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400" },
];

const ShoppingList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [shoppingList, setShoppingList] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      handleSearch(query);
    }
  }, []);

  const handleSearch = (query?: string) => {
    const searchTerm = (query || searchQuery).toLowerCase();
    if (searchTerm) {
      const results = mockProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      setSearchResults(results);
      setSearchParams({ search: searchTerm });
    } else {
      setSearchResults(mockProducts);
      setSearchParams({});
    }
  };

  const addToList = (product: Product) => {
    if (!shoppingList.find((item) => item.id === product.id)) {
      setShoppingList([...shoppingList, product]);
      toast({
        title: "Added to list!",
        description: `${product.name} has been added to your shopping list.`,
      });
    }
  };

  const removeFromList = (productId: string) => {
    setShoppingList(shoppingList.filter((item) => item.id !== productId));
    toast({
      title: "Removed from list",
      description: "Item has been removed from your shopping list.",
      variant: "destructive",
    });
  };

  const totalPrice = shoppingList.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Shopping List</h1>
          <div className="flex gap-2 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search eco-friendly products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-12 text-base border-2 focus-visible:ring-primary"
              />
            </div>
            <Button onClick={() => handleSearch()} variant="eco" size="lg">
              Search
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  isInList={shoppingList.some((item) => item.id === product.id)}
                  onAddToList={() => addToList(product)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Shopping List */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Your Shopping List ({shoppingList.length})
            </h2>
            {shoppingList.length > 0 && (
              <p className="text-xl font-bold text-primary">
                Total: ${totalPrice.toFixed(2)}
              </p>
            )}
          </div>

          {shoppingList.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">
                  Your shopping list is empty. Search for products and add them to your list!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {shoppingList.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFromList(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ShoppingList;
