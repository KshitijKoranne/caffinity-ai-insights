
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AccountInfoCard from "./AccountInfoCard";
import LogoutButton from "./LogoutButton";
import SettingsCard from "./SettingsCard";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setName(data.name || "");
          // Always use the email from auth user object as it's the source of truth
          setEmail(user.email || "");
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, [user]);

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

      {/* Account Information Card */}
      <AccountInfoCard name={name} email={email} userId={user?.id} />
      
      <div className="pt-4">
        <LogoutButton />
      </div>
      
      {/* Settings Card */}
      <SettingsCard />
      
      <div className="text-center text-xs text-muted-foreground mt-8">
        Caffinity v1.0.0
      </div>
    </div>
  );
};

export default ProfilePage;
