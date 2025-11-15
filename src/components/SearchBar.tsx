import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, onSearch, placeholder = "Search eco-friendly products..." }: SearchBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 h-12 text-base border-2 focus-visible:ring-primary"
        />
      </div>
      <Button onClick={onSearch} variant="eco" size="lg">
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
