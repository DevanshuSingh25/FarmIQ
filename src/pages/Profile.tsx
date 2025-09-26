import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionSpeaker } from "@/components/ui/section-speaker";
import { ArrowLeft, Edit, Save, X, Camera, User, Phone, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    aadhar: "1234 5678 9012"
  });

  const [editData, setEditData] = useState(formData);

  const handleEdit = () => {
    setEditData(formData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setFormData(editData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData(formData);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
        toast({
          title: "Photo Updated",
          description: "Your profile photo has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getText = () => "Farmer Profile. View and edit your personal information including name, phone number, and Aadhar number. Upload a profile photo.";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 relative group">
          <div className="absolute top-0 right-0 z-10">
            <SectionSpeaker 
              getText={getText}
              sectionId="profile-page"
              ariaLabel="Read profile page information"
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

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Farmer Profile</h1>
            <p className="text-xl text-muted-foreground">
              Manage your personal information and profile settings
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic profile information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImage || undefined} alt="Profile" />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getInitials(isEditing ? editData.name : formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="profile-photo" className="absolute -bottom-2 -right-2 cursor-pointer">
                    <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </div>
                  </label>
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Click the camera icon to upload a profile photo
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{formData.name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{formData.phone}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhar" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Aadhar Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="aadhar"
                      value={editData.aadhar}
                      onChange={(e) => setEditData({ ...editData, aadhar: e.target.value })}
                      placeholder="Enter your Aadhar number"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="font-medium">{formData.aadhar}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Additional details about your farming account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                  <p className="text-sm">January 2023</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Total Crops</Label>
                  <p className="text-sm">4 crops registered</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <p className="text-sm">Punjab, India</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                  <p className="text-sm text-success">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
