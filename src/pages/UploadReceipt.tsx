import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/PointsContext";

const UploadReceipt = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { addPoints } = usePoints();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Simulate OCR processing and date validation
    setTimeout(() => {
      // Mock validation - in real app, this would use OCR
      const isValid = Math.random() > 0.3; // 70% success rate for demo
      
      if (isValid) {
        // Add 10 points for successful receipt upload
        addPoints(10);
        toast({
          title: "Receipt uploaded successfully!",
          description: "You earned +10 points for your eco-friendly purchase!",
        });
        setSelectedFile(null);
      } else {
        toast({
          title: "Receipt validation failed",
          description: "This receipt is older than 7 days or doesn't contain items from your shopping list.",
          variant: "destructive",
        });
      }
      
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Upload a Receipt</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Earn Points for Your Purchases</CardTitle>
              <CardDescription>
                Upload a receipt from your eco-friendly shopping to earn points. Receipts must be from the last 7 days and contain items from your shopping list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="receipt-upload"
                />
                <label htmlFor="receipt-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">
                    {selectedFile ? selectedFile.name : "Click to upload receipt"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, PDF
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                variant="eco"
                size="lg"
                className="w-full"
              >
                {isUploading ? "Processing..." : "Upload Receipt"}
              </Button>

              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Requirements
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Receipt must be dated within the last 7 days
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Must contain at least one item from your shopping list
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Image must be clear and readable
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Earn +10 points for each valid receipt
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UploadReceipt;
