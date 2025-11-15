import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GiftCard {
  id: string;
  brand: string;
  image: string;
  pointsCost: number;
}

const giftCards: GiftCard[] = [
  { id: "1", brand: "Amazon", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400", pointsCost: 200 },
  { id: "2", brand: "Whole Foods", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", pointsCost: 200 },
  { id: "3", brand: "Target", image: "https://images.unsplash.com/photo-1596558450268-9c27524ba856?w=400", pointsCost: 200 },
  { id: "4", brand: "Starbucks", image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400", pointsCost: 200 },
];

const MyPoints = () => {
  const [userPoints, setUserPoints] = useState(250); // Mock user points
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRedeemClick = (card: GiftCard) => {
    setSelectedCard(card);
    setIsDialogOpen(true);
  };

  const handleRedeem = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to receive the gift card.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCard) return;

    if (userPoints >= selectedCard.pointsCost) {
      setUserPoints(userPoints - selectedCard.pointsCost);
      toast({
        title: "Gift card redeemed!",
        description: `Your ${selectedCard.brand} gift card will be sent to ${email}`,
      });
      setIsDialogOpen(false);
      setEmail("");
      setSelectedCard(null);
    } else {
      toast({
        title: "Insufficient points",
        description: `You need ${selectedCard.pointsCost} points to redeem this gift card. You currently have ${userPoints} points.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-primary to-accent w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Award className="h-12 w-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2">My Points</h1>
          </div>

          {/* Points Display */}
          <Card className="mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground text-lg mb-2">Total Points</p>
              <p className="text-6xl font-bold text-primary mb-4">{userPoints}</p>
              <p className="text-sm text-muted-foreground">
                Keep shopping eco-friendly to earn more points!
              </p>
            </CardContent>
          </Card>

          {/* Redeem Points Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Gift className="h-6 w-6" />
              Redeem Points
            </h2>
            <p className="text-muted-foreground mb-6">
              Choose from our selection of gift cards. Each card costs 200 points.
            </p>
          </div>

          {/* Gift Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftCards.map((card) => (
              <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={card.image}
                    alt={`${card.brand} gift card`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{card.brand}</CardTitle>
                  <CardDescription className="text-primary font-bold text-lg">
                    {card.pointsCost} Points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleRedeemClick(card)}
                    variant="eco"
                    className="w-full"
                    disabled={userPoints < card.pointsCost}
                  >
                    {userPoints >= card.pointsCost ? "Redeem" : "Not Enough Points"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Redemption Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem {selectedCard?.brand} Gift Card</DialogTitle>
            <DialogDescription>
              This will cost {selectedCard?.pointsCost} points. Enter your email to receive the gift card.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Your current balance: <span className="font-bold text-primary">{userPoints} points</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Balance after redemption: <span className="font-bold text-primary">
                  {userPoints - (selectedCard?.pointsCost || 0)} points
                </span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="eco" onClick={handleRedeem}>
              Confirm Redemption
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPoints;
