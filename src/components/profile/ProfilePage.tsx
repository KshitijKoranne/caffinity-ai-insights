
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";
import { LogOut, User, Settings, Save } from "lucide-react";

const ProfilePage = () => {
  const [name, setName] = useState(() => {
    const user = localStorage.getItem("caffinity-user");
    return user ? JSON.parse(user).name || "User" : "User";
  });
  
  const [email, setEmail] = useState(() => {
    const user = localStorage.getItem("caffinity-user");
    return user ? JSON.parse(user).email || "" : "";
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update local storage
      const user = localStorage.getItem("caffinity-user");
      if (user) {
        const userData = JSON.parse(user);
        userData.name = name;
        userData.email = email;
        localStorage.setItem("caffinity-user", JSON.stringify(userData));
      }
      
      setIsSaving(false);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }, 500);
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem("caffinity-user");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // Navigate to login page
    navigate("/");
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-coffee-dark">Profile</h1>
          <p className="text-muted-foreground">Manage your account</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-coffee flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
      </header>

      <Card className="border-coffee/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Account Information</CardTitle>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be logged out of your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-coffee/20">
        <CardHeader>
          <CardTitle className="text-lg">App Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground text-sm">
            More settings coming soon.
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-muted-foreground mt-8">
        Caffinity v1.0.0
      </div>
    </div>
  );
};

export default ProfilePage;
