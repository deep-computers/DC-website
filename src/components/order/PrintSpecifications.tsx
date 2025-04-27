import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderSpecifications } from "./OrderEmailService";

interface PrintSpecificationsProps {
  specifications: OrderSpecifications;
  updateSpecifications: (specs: Partial<OrderSpecifications>) => void;
}

interface PrintPrices {
  [key: string]: {
    bw: number;
    color: number;
  };
}

const PrintSpecifications = ({ specifications, updateSpecifications }: PrintSpecificationsProps) => {
  // Local state for print specifications
  const [pageCountMode, setPageCountMode] = useState<string>("manual");
  const [bwPageCount, setBwPageCount] = useState<number>(0);
  const [colorPageCount, setColorPageCount] = useState<number>(0);
  const [paperType, setPaperType] = useState<string>("normal");
  const [copies, setCopies] = useState<number>(1);
  const [doubleSided, setDoubleSided] = useState<boolean>(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  
  // Price calculations
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  // Price per page (in INR)
  const prices: PrintPrices = {
    "normal": { bw: 1, color: 5 },
    "80gsm": { bw: 2, color: 6 },
    "90gsm": { bw: 2.5, color: 6.5 },
    "100gsm": { bw: 3, color: 7 }
  };
  
  // Calculate price based on current selections
  useEffect(() => {
    const bwPrice = bwPageCount * prices[paperType].bw;
    const colorPrice = colorPageCount * prices[paperType].color;
    const subtotal = (bwPrice + colorPrice) * copies;
    
    // Apply additional pricing for double-sided (optional)
    const total = doubleSided ? subtotal * 0.9 : subtotal; // 10% discount for double-sided
    
    setTotalPrice(Math.max(0, total));
    
    // Update specifications
    updateSpecifications({
      pageCountMode,
      bwPageCount,
      colorPageCount,
      paperType,
      copies,
      doubleSided,
      specialInstructions,
      totalPrice: Math.round(total)
    });
  }, [
    pageCountMode, 
    bwPageCount, 
    colorPageCount, 
    paperType, 
    copies, 
    doubleSided, 
    specialInstructions, 
    updateSpecifications
  ]);
  
  // Function to handle page count change
  const handlePageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value, 10) || 0;
    
    if (name === "bwPageCount") {
      setBwPageCount(Math.max(0, numberValue));
    } else if (name === "colorPageCount") {
      setColorPageCount(Math.max(0, numberValue));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Document Specifications</h3>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="count-mode">Page Count Method</Label>
              <RadioGroup 
                id="count-mode" 
                value={pageCountMode} 
                onValueChange={setPageCountMode}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual" className="font-normal">Manual Count (Specify exact number of pages)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bwPageCount">Black & White Pages</Label>
                <Input
                  id="bwPageCount"
                  name="bwPageCount"
                  type="number"
                  min="0"
                  value={bwPageCount}
                  onChange={handlePageCountChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorPageCount">Color Pages</Label>
                <Input
                  id="colorPageCount"
                  name="colorPageCount"
                  type="number"
                  min="0"
                  value={colorPageCount}
                  onChange={handlePageCountChange}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="paper-type">Paper Type</Label>
              <RadioGroup 
                id="paper-type" 
                value={paperType} 
                onValueChange={setPaperType}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="font-normal">Normal Paper (₹1/page B&W, ₹5/page Color)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="80gsm" id="80gsm" />
                  <Label htmlFor="80gsm" className="font-normal">Bond Paper 80 GSM (₹2/page B&W, ₹6/page Color)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90gsm" id="90gsm" />
                  <Label htmlFor="90gsm" className="font-normal">Bond Paper 90 GSM (₹2.5/page B&W, ₹6.5/page Color)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="100gsm" id="100gsm" />
                  <Label htmlFor="100gsm" className="font-normal">Bond Paper 100 GSM (₹3/page B&W, ₹7/page Color)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="copies">Number of Copies</Label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50"
                  onClick={() => setCopies(Math.max(1, copies - 1))}
                >
                  -
                </button>
                <Input
                  id="copies"
                  type="number"
                  min="1"
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                />
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50"
                  onClick={() => setCopies(copies + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="double-sided">Printing Type</Label>
              <RadioGroup 
                id="double-sided" 
                value={doubleSided ? "double" : "single"} 
                onValueChange={(value) => setDoubleSided(value === "double")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="font-normal">Single-sided</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="double" id="double" />
                  <Label htmlFor="double" className="font-normal">Double-sided (10% discount)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <textarea
                id="specialInstructions"
                rows={3}
                className="w-full min-h-[80px] p-2 border border-gray-300 rounded-md"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requirements or instructions for printing"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 className="text-lg font-medium">Price Summary</h3>
              <p className="text-sm text-gray-500">Based on your selections</p>
            </div>
            
            <div className="text-right mt-2 sm:mt-0">
              <div className="text-2xl font-bold text-primary">₹{totalPrice.toFixed(2)}</div>
              <div className="text-xs text-gray-500">
                {bwPageCount} B&W + {colorPageCount} Color pages
                {copies > 1 ? ` × ${copies} copies` : ''}
                {doubleSided ? ' (Double-sided)' : ''}
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>B&W Pages ({bwPageCount})</span>
              <span>₹{(bwPageCount * prices[paperType].bw).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Color Pages ({colorPageCount})</span>
              <span>₹{(colorPageCount * prices[paperType].color).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Paper Type</span>
              <span>{paperType === "normal" ? "Normal Paper" : `Bond Paper ${paperType.replace("gsm", " GSM")}`}</span>
            </div>
            {copies > 1 && (
              <div className="flex justify-between">
                <span>Copies</span>
                <span>× {copies}</span>
              </div>
            )}
            {doubleSided && (
              <div className="flex justify-between">
                <span>Double-sided Discount</span>
                <span>-10%</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintSpecifications; 