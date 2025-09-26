import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { SectionSpeaker } from "@/components/ui/section-speaker";

const YieldPrediction = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    cropName: "",
    costPrice: "",
    sellingPrice: ""
  });
  const [showResults, setShowResults] = useState(false);

  // Supported crops and mock monthly yield data (past year)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const cropToMonthlyYield: Record<string, number[]> = {
    rice:  [2.2, 2.5, 2.8, 3.0, 3.1, 2.9, 2.6, 2.4, 2.3, 2.1, 1.9, 1.8],
    wheat: [1.1, 1.3, 1.7, 2.0, 2.2, 2.1, 1.8, 1.6, 1.4, 1.2, 1.0, 0.9],
    tomato:[0.8, 1.0, 1.2, 1.6, 1.9, 2.1, 2.3, 2.0, 1.7, 1.3, 1.0, 0.8],
    corn:  [1.3, 1.5, 1.8, 2.2, 2.5, 2.7, 2.6, 2.4, 2.2, 1.9, 1.6, 1.4]
  };

  const normalizeCropKey = (name: string) => name.trim().toLowerCase();
  const getCropKey = (name: string) => {
    const key = normalizeCropKey(name);
    if (cropToMonthlyYield[key]) return key;
    // Simple mapping for common variants
    if (key.includes('paddy')) return 'rice';
    if (key.includes('maize')) return 'corn';
    return 'rice';
  };

  const buildYieldSeries = (cropName: string) => {
    const key = getCropKey(cropName);
    const yields = cropToMonthlyYield[key] || cropToMonthlyYield.rice;
    return months.map((m, i) => ({ month: m, yield: yields[i] }));
  };

  const buildProfitSeries = (cropName: string, costPrice: number, sellingPrice: number) => {
    const key = getCropKey(cropName);
    const yields = cropToMonthlyYield[key] || cropToMonthlyYield.rice;
    const unitMargin = Math.max(0, sellingPrice - costPrice);
    return months.map((m, i) => ({ month: m, profit: Math.round(unitMargin * yields[i] * 100) }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cropName.trim()) return;
    if (!formData.costPrice || !formData.sellingPrice) return;
    setShowResults(true);
  };

  const getText = () => "Crop history analytics. Enter crop name, cost price and selling price to view yield and profit trends over the past year for your crop category.";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 relative group">
          <div className="absolute top-0 right-0 z-10">
            <SectionSpeaker 
              getText={getText}
              sectionId="crop-history-page"
              ariaLabel="Read crop history page information"
              alwaysVisible
            />
          </div>
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
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Crop History</h1>
            <p className="text-xl text-muted-foreground">
              Enter your crop and prices to view yield and profit trends over the past year
            </p>
          </div>

          {!showResults ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Basic Questionnaire
                </CardTitle>
                <CardDescription>
                  Provide crop name, cost price and selling price
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cropName">Crop name</Label>
                    <Input
                      id="cropName"
                      placeholder="e.g., Rice, Wheat, Tomato, Corn"
                      value={formData.cropName}
                      onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost price (per unit)</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 1500"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling price (per unit)</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 2000"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    View Crop Trends
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Yield over past year — {formData.cropName}
                    </CardTitle>
                    <CardDescription>
                      Monthly yields for the selected crop category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={buildYieldSeries(formData.cropName)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="yield" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Yield"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Profit over past year — {formData.cropName}
                    </CardTitle>
                    <CardDescription>
                      Computed from your cost and selling price
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={buildProfitSeries(formData.cropName, parseFloat(formData.costPrice), parseFloat(formData.sellingPrice))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="profit" 
                          fill="hsl(var(--success))" 
                          name="Profit"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button variant="outline" className="mr-4" onClick={() => setShowResults(false)}>
                  Modify answers
                </Button>
                <Button>
                  Download report
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