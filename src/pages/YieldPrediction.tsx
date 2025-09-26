import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const YieldPrediction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cropName: "",
    costPrice: "",
    sellingPrice: ""
  });
  const [showResults, setShowResults] = useState(false);

  // Mock data for charts
  const yieldData = [
    { month: 'Jan', yield: 2.4, prediction: 2.6 },
    { month: 'Feb', yield: 2.8, prediction: 3.1 },
    { month: 'Mar', yield: 3.2, prediction: 3.4 },
    { month: 'Apr', yield: 4.1, prediction: 4.3 },
    { month: 'May', yield: 4.8, prediction: 5.1 },
    { month: 'Jun', yield: 5.2, prediction: 5.5 },
    { month: 'Jul', yield: 5.8, prediction: 6.2 },
    { month: 'Aug', yield: 6.1, prediction: 6.5 },
    { month: 'Sep', yield: 5.9, prediction: 6.3 },
    { month: 'Oct', yield: 5.4, prediction: 5.8 },
    { month: 'Nov', yield: 4.2, prediction: 4.6 },
    { month: 'Dec', yield: 3.5, prediction: 3.8 }
  ];

  const profitData = [
    { month: 'Jan', profit: 15000, cost: 12000 },
    { month: 'Feb', profit: 18000, cost: 14000 },
    { month: 'Mar', profit: 22000, cost: 16000 },
    { month: 'Apr', profit: 28000, cost: 18000 },
    { month: 'May', profit: 32000, cost: 20000 },
    { month: 'Jun', profit: 35000, cost: 22000 },
    { month: 'Jul', profit: 38000, cost: 24000 },
    { month: 'Aug', profit: 36000, cost: 23000 },
    { month: 'Sep', profit: 33000, cost: 21000 },
    { month: 'Oct', profit: 29000, cost: 19000 },
    { month: 'Nov', profit: 24000, cost: 17000 },
    { month: 'Dec', profit: 20000, cost: 15000 }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cropName && formData.costPrice && formData.sellingPrice) {
      setShowResults(true);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Yield Prediction</h1>
            <p className="text-xl text-muted-foreground">
              Get AI-powered predictions for your crop yields and profit trends
            </p>
          </div>

          {!showResults ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Crop Information
                </CardTitle>
                <CardDescription>
                  Tell us about your crop to generate accurate predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cropName">Crop Name</Label>
                    <Input
                      id="cropName"
                      placeholder="e.g., Rice, Wheat, Tomato"
                      value={formData.cropName}
                      onChange={(e) => handleInputChange("cropName", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price per Quintal (₹)</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      placeholder="e.g., 1500"
                      value={formData.costPrice}
                      onChange={(e) => handleInputChange("costPrice", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Expected Selling Price per Quintal (₹)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      placeholder="e.g., 2000"
                      value={formData.sellingPrice}
                      onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Generate Predictions
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Crop</h3>
                      <p className="text-2xl font-bold text-primary mt-2">{formData.cropName}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Expected Profit Margin</h3>
                      <p className="text-2xl font-bold text-success mt-2">
                        {Math.round(((parseFloat(formData.sellingPrice) - parseFloat(formData.costPrice)) / parseFloat(formData.costPrice)) * 100)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">Predicted Annual Yield</h3>
                      <p className="text-2xl font-bold text-accent mt-2">5.2 Tons/Acre</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Yield Over Time
                    </CardTitle>
                    <CardDescription>
                      Monthly yield predictions based on historical data and weather patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={yieldData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="yield" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Actual Yield (Tons)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="prediction" 
                          stroke="hsl(var(--accent))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Predicted Yield (Tons)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Profit Trends
                    </CardTitle>
                    <CardDescription>
                      Monthly profit analysis based on market prices and production costs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={profitData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="profit" 
                          fill="hsl(var(--success))" 
                          name="Profit (₹)"
                        />
                        <Bar 
                          dataKey="cost" 
                          fill="hsl(var(--warning))" 
                          name="Cost (₹)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResults(false)}
                  className="mr-4"
                >
                  Modify Inputs
                </Button>
                <Button>
                  Download Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YieldPrediction;