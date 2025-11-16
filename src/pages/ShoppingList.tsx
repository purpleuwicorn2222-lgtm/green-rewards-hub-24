import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag, Plus, Minus, ExternalLink } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const ShoppingList = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8" />
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              Manage your eco-friendly product selections
            </p>
          </div>

          {items.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg mb-4">
                  Your shopping cart is empty.
                </p>
                <Button onClick={() => navigate("/")} variant="eco">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <p className="text-primary font-bold text-lg">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-muted-foreground">
                                  ${item.price.toFixed(2)} each
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2 border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {/* Delete Button */}
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {item.sourceUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto mt-2 text-xs"
                              onClick={() => window.open(item.sourceUrl, "_blank")}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Source
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <Card className="sticky bottom-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-lg font-semibold">
                        {items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Price</p>
                      <p className="text-3xl font-bold text-primary">
                        ${total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShoppingList;
