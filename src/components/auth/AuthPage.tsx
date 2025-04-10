
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Coffee } from "lucide-react";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-coffee-light/10 to-cream/30">
      <div className="w-full max-w-md animate-fade-in space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <Coffee className="h-12 w-12 text-coffee" />
          </div>
          <h1 className="text-3xl font-bold text-coffee-dark">Caffinity</h1>
          <p className="text-muted-foreground">
            Track your caffeine. Get personalized insights.
          </p>
        </div>

        <Card className="border-coffee/20 shadow-lg">
          <CardContent className="pt-6">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="animate-slide-up">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup" className="animate-slide-up">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-xs text-center text-muted-foreground mt-8">
          Your caffeine journey starts here.
          <br />
          All your data is stored securely.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
