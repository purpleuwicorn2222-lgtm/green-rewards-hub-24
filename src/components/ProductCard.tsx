import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, Check } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  isInList: boolean;
  onAddToList: () => void;
}

const ProductCard = ({ name, price, image, isInList, onAddToList }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
        <p className="text-primary font-bold text-xl">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onAddToList}
          variant={isInList ? "outline" : "eco"}
          className="w-full"
          disabled={isInList}
        >
          {isInList ? (
            <>
              <Check className="h-4 w-4" />
              In List
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add to List
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
