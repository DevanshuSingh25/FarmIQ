import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Eye,
  Trash2,
  Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Detection {
  id: string;
  crop: string;
  image: string;
  note: string;
  result: string;
  cause: string;
  remedies: string;
  confidence: number;
  date: string;
}

const CropDiseaseDetection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("detect");
  
  // Form state
  const [selectedCrop, setSelectedCrop] = useState("");
  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<Detection | null>(null);

  // History state
  const [detectionHistory, setDetectionHistory] = useState<Detection[]>([
    {
      id: "D001",
      crop: "Tomato",
      image: "/placeholder.svg",
      note: "Yellowing leaves with brown spots",
      result: "Late Blight",
      cause: "Fungal infection caused by Phytophthora infestans, typically occurs in humid conditions",
      remedies: "Remove affected leaves immediately. Apply copper-based fungicide. Improve air circulation. Avoid overhead watering.",
      confidence: 89,
      date: "2025-09-20"
    },
    {
      id: "D002", 
      crop: "Wheat",
      image: "/placeholder.svg",
      note: "Orange spots on leaves",
      result: "Rust Disease",
      cause: "Fungal disease that thrives in cool, moist conditions",
      remedies: "Apply triazole fungicides. Plant rust-resistant varieties next season. Remove crop residue.",
      confidence: 76,
      date: "2025-09-18"
    }
  ]);

  const crops = ["Wheat", "Rice", "Maize", "Potato", "Tomato", "Cotton"];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const mockAnalyzeImage = async (): Promise<Detection> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockDiseases = [
      {
        result: "Bacterial Leaf Spot",
        cause: "Bacterial infection common in warm, humid conditions with poor air circulation",
        remedies: "Remove infected leaves. Apply copper-based bactericide. Improve spacing between plants. Avoid overhead watering.",
        confidence: 92
      },
      {
        result: "Powdery Mildew", 
        cause: "Fungal disease that appears as white powdery coating on leaves",
        remedies: "Apply sulfur-based fungicide. Increase air circulation. Remove affected plant parts. Plant in sunny locations.",
        confidence: 85
      },
      {
        result: "Nutrient Deficiency",
        cause: "Yellowing indicates possible nitrogen deficiency or overwatering",
        remedies: "Apply balanced NPK fertilizer. Check soil drainage. Test soil pH levels. Reduce watering frequency.",
        confidence: 71
      },
      {
        result: "Not sure",
        cause: "Image quality insufficient for accurate diagnosis",
        remedies: "Please take a clearer image in good lighting or consult with an agricultural expert.",
        confidence: 45
      }
    ];

    const randomResult = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    
    return {
      id: `D${Date.now()}`,
      crop: selectedCrop,
      image: imagePreview || "",
      note,
      ...randomResult,
      date: new Date().toISOString().split('T')[0]
    };
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedCrop) {
      toast({
        title: "Missing information",
        description: "Please select an image and crop type",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await mockAnalyzeImage();
      setCurrentResult(result);
      
      // Add to history
      setDetectionHistory(prev => [result, ...prev]);
      
      toast({
        title: "Analysis complete",
        description: `Disease detection completed with ${result.confidence}% confidence`,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Unable to process image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleForwardToExpert = () => {
    toast({
      title: "Case forwarded",
      description: "Your case has been sent to our agricultural experts. You'll receive a response within 24 hours.",
    });
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedCrop("");
    setNote("");
    setCurrentResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const deleteHistoryItem = (id: string) => {
    setDetectionHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Detection deleted",
      description: "History item removed successfully",
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-success";
    if (confidence >= 60) return "text-warning";
    return "text-destructive";
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 80) return "default";
    if (confidence >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-8 group relative">
          <div className="absolute top-0 right-0 z-10">
            <SectionSpeaker 
              getText={() => "Crop Disease Detection. Upload images of your crops to identify diseases using AI-powered analysis. Get instant diagnosis, treatment recommendations, and expert advice to protect your harvest."}
              sectionId="disease-detection-header"
              ariaLabel="Read crop disease detection information"
              alwaysVisible
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Crop Disease Detection</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="detect">Upload & Detect</TabsTrigger>
            <TabsTrigger value="history">History ({detectionHistory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="detect" className="space-y-6 group relative">
            <div className="absolute top-2 right-2 z-10">
              <SectionSpeaker 
                getText={() => "Upload and Detect tab. Select your crop type, upload an image of affected plants, add optional notes, and click analyze to get AI-powered disease identification and treatment recommendations."}
                sectionId="detect-tab-content"
                ariaLabel="Read disease detection instructions"
                alwaysVisible
              />
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Plant Image</CardTitle>
                  <CardDescription>
                    Take or upload a clear photo of the affected plant part
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Plant preview" 
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-4">
                          <Button 
                            variant="outline" 
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleCameraCapture}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          JPG or PNG • Max 5MB
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="crop">Crop Type *</Label>
                      <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                        <SelectContent>
                          {crops.map((crop) => (
                            <SelectItem key={crop} value={crop}>
                              {crop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="note">Additional Notes (Optional)</Label>
                      <Textarea
                        id="note"
                        placeholder="Describe the symptoms you're seeing..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        maxLength={250}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {note.length}/250 characters
                      </p>
                    </div>

                    <Button 
                      onClick={handleAnalyze} 
                      disabled={!selectedImage || !selectedCrop || isAnalyzing}
                      className="w-full"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing Image...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Analyze Disease
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results Section */}
              <div className="space-y-6">
                {currentResult ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {currentResult.confidence >= 60 ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        )}
                        Detection Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Disease Detected</Label>
                        <p className="text-lg font-semibold mt-1">{currentResult.result}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Confidence Score</Label>
                        <div className="flex items-center gap-3 mt-2">
                          <Progress value={currentResult.confidence} className="flex-1" />
                          <Badge variant={getConfidenceBadgeVariant(currentResult.confidence)}>
                            {currentResult.confidence}%
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Cause</Label>
                        <p className="text-sm text-muted-foreground mt-1">{currentResult.cause}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Recommended Treatment</Label>
                        <p className="text-sm text-muted-foreground mt-1">{currentResult.remedies}</p>
                      </div>

                      {currentResult.confidence < 60 && (
                        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                          <h4 className="font-medium text-warning mb-2">Low Confidence Detection</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Our AI isn't completely sure about this diagnosis. Would you like to forward this case to our agricultural experts for a more accurate analysis?
                          </p>
                          <Button variant="outline" onClick={handleForwardToExpert}>
                            <Send className="h-4 w-4 mr-2" />
                            Forward to Expert
                          </Button>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={resetForm} className="flex-1">
                          Analyze Another
                        </Button>
                        <Button 
                          onClick={() => setActiveTab("history")} 
                          className="flex-1"
                        >
                          View History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                      <Eye className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">Ready to Analyze</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload an image and select your crop type to get started
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detection History</CardTitle>
                <CardDescription>
                  View all your previous disease detection results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {detectionHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No Detection History</h3>
                    <p className="text-sm text-muted-foreground">
                      Your disease detection results will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {detectionHistory.map((detection) => (
                      <Card key={detection.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img 
                              src={detection.image} 
                              alt="Plant" 
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{detection.result}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {detection.crop} • {detection.date}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={getConfidenceBadgeVariant(detection.confidence)}>
                                    {detection.confidence}%
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteHistoryItem(detection.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {detection.note && (
                                <p className="text-sm text-muted-foreground">
                                  Note: {detection.note}
                                </p>
                              )}
                              
                              <p className="text-sm text-muted-foreground">
                                {detection.remedies}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CropDiseaseDetection;