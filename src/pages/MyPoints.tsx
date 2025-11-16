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
import whoGivesACrapImg from "@/assets/brands/who-gives-a-crap.jpg";
import thinxImg from "@/assets/brands/thinx.jpg";
import patagoniaImg from "@/assets/brands/patagonia.jpg";
import pelaImg from "@/assets/brands/pela.jpg";
import greenToysImg from "@/assets/brands/green-toys.jpg";

interface GiftCard {
  id: string;
  brand: string;
  image: string;
  pointsCost: number;
  value: string;
  description: string;
}

const giftCards: GiftCard[] = [
  { 
    id: "1", 
    brand: "Who Gives a Crap", 
    image: whoGivesACrapImg, 
    pointsCost: 200, 
    value: "$10",
    description: "Who Gives A Crap offers an environmentally friendly toilet paper that is \"good for your bum and great for the world\" as they say. Its products are 100% plastic free and have options made from 100% recycled paper or 100% bamboo. Additionally, 50% of the profits are donated to help build toilets for communities in need around the world."
  },
  { 
    id: "2", 
    brand: "Thinx", 
    image: thinxImg, 
    pointsCost: 200, 
    value: "$10",
    description: "An individual can go through approximately 11,000 disposable pads and/or tampons in a lifetime, and when you multiply that number by everyone with a period on this planet, that results in a substantial amount of waste. Thinx period-proof panties have the look and feel of regular underwear, but with its famous technology, the product can hold up to four tampons' worth of menstrual fluid."
  },
  { 
    id: "3", 
    brand: "Patagonia", 
    image: patagoniaImg, 
    pointsCost: 200, 
    value: "$10",
    description: "Patagonia's corporate philosophy is all about going green. The business has built repair centers around the world to increase the longevity of its products and lower its carbon footprint. In 2016, the business pledged $10 million of its Black Friday sales to grassroots environmental groups dedicated to preserving and improving the planet."
  },
  { 
    id: "4", 
    brand: "Pela", 
    image: pelaImg, 
    pointsCost: 200, 
    value: "$10",
    description: "Pela creates 100% compostable phone cases and accessories, making it easy to protect your phone while protecting the planet. Their products are made from plant-based materials and break down naturally in compost, reducing plastic waste in landfills and oceans."
  },
  { 
    id: "5", 
    brand: "Green Toys", 
    image: greenToysImg, 
    pointsCost: 200, 
    value: "$10",
    description: "Part of raising a healthy baby is providing a healthy environment, and don't you think taking care of the natural environment is part of that too? Green Toys is an Eco Mama's dream: not only are the toys safely made for your baby, but they are made with 100% recycled materials."
  },
  { 
    id: "6", 
    brand: "Chipotle", 
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "Chipotle is committed to Food With Integrity, sourcing responsibly raised meat, organic and local produce when possible, and dairy from pasture-raised cows. They focus on sustainable farming practices and reducing their environmental impact."
  },
  { 
    id: "7", 
    brand: "Panda Express", 
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "Panda Express is committed to serving quality food while being mindful of sustainability. They focus on responsible sourcing and reducing waste in their operations."
  },
  { 
    id: "8", 
    brand: "In-N-Out", 
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "In-N-Out Burger maintains high quality standards and sources fresh ingredients. While known for their classic burgers, they focus on quality and freshness in all their offerings."
  },
  { 
    id: "9", 
    brand: "Amazon", 
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "Amazon offers a wide range of products and services. Use your gift card to purchase eco-friendly products, books, electronics, and more from their extensive marketplace."
  },
  { 
    id: "10", 
    brand: "Adidas", 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "Adidas is committed to sustainability with initiatives like using recycled materials in their products, reducing plastic waste, and working towards carbon neutrality. Their sustainable product lines include shoes and apparel made from ocean plastic."
  },
  { 
    id: "11", 
    brand: "Starbucks", 
    image: "https://images.unsplash.com/photo-1511920170033-83939cdc2e39?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "Starbucks is committed to sustainability through ethical sourcing, reducing waste, and environmental stewardship. They aim to be resource positive, giving more than they take from the planet."
  },
  { 
    id: "12", 
    brand: "Sephora", 
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "Sephora offers a wide selection of beauty products including many eco-friendly and cruelty-free brands. Use your gift card to explore sustainable beauty options and clean beauty products."
  },
  { 
    id: "13", 
    brand: "AMC Theatres", 
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "AMC Theatres provides entertainment through movies and events. Use your gift card to enjoy the latest films and cinematic experiences at AMC locations nationwide."
  },
  { 
    id: "14", 
    brand: "Apple", 
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop", 
    pointsCost: 200, 
    value: "$10",
    description: "Apple is committed to carbon neutrality and environmental responsibility. They use recycled materials in their products, run on renewable energy, and work towards a carbon-neutral supply chain by 2030."
  },
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
              Choose from our selection of eco-friendly brand gift cards. Each $10 card costs 200 points.
            </p>
          </div>

          {/* Gift Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {giftCards.map((card) => (
              <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={card.image}
                    alt={`${card.brand} gift card`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{card.brand}</CardTitle>
                  <CardDescription className="text-primary font-bold text-lg">
                    {card.value} • {card.pointsCost} Points
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                  <Button
                    onClick={() => handleRedeemClick(card)}
                    variant="eco"
                    className="w-full mt-auto"
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
