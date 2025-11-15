import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { searchCategories } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  placeholder?: string;
}

const SearchBar = ({ placeholder = "Search eco-friendly products..." }: SearchBarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    
    if (query.trim()) {
      const category = searchCategories(query.trim());
      
      if (category) {
        navigate(`/category/${category}`);
      } else {
        toast({
          title: "Category not found",
          description: `Try searching for: makeup, skincare, clothes, tampons & pads, furniture, toilet paper, jackets, shoes, toys, or straws`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            name="search"
            type="text"
            placeholder={placeholder}
            className="pl-10 h-12 text-base border-2 focus-visible:ring-primary"
          />
        </div>
        <Button type="submit" variant="eco" size="lg">
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
