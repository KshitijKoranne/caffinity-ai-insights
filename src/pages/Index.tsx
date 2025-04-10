
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthPage from "../components/auth/AuthPage";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("caffinity-user");
    if (user && JSON.parse(user).isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <AuthPage />;
};

export default Index;
