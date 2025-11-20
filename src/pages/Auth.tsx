import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Heart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"traveler" | "volunteer" | "authority">("traveler");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  // Check if user is coming back from password reset email
  useEffect(() => {
    const checkResetMode = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      
      if (type === 'recovery' && session) {
        setIsResetMode(true);
      }
    };
    
    checkResetMode();
  }, []);
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast.success(`Account created as ${role}! Please check your email to verify.`);
        if (role === 'volunteer' || role === 'authority') {
          navigate("/volunteer");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check user role to redirect appropriately
      if (data?.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();
        
        toast.success("Welcome back!");
        
        if (roleData?.role === 'volunteer' || roleData?.role === 'authority') {
          navigate("/volunteer");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset link sent! Check your email.");
      setForgotPasswordOpen(false);
      setResetEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully!");
      setIsResetMode(false);
      setNewPassword("");
      
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname);
      
      // Redirect to home
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold mb-2">
              {isResetMode ? "Reset Your Password" : "Welcome to RAHI"}
            </h1>
            <p className="text-muted-foreground">
              {isResetMode ? "Enter your new password below" : "Join our community of lifesavers"}
            </p>
          </div>
          
          {isResetMode ? (
            <Card className="p-6">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 6 characters
                  </p>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </Card>
          ) : (
          <Card className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  
                  <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="link" className="w-full text-sm text-muted-foreground hover:text-primary">
                        Forgot password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                          <Label htmlFor="reset-email">Email</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="you@example.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <Label>I want to join as</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      <Button
                        type="button"
                        variant={role === "traveler" ? "default" : "outline"}
                        onClick={() => setRole("traveler")}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                      >
                        <AlertTriangle className="h-6 w-6" />
                        <span className="text-xs">Traveler</span>
                      </Button>
                      <Button
                        type="button"
                        variant={role === "volunteer" ? "default" : "outline"}
                        onClick={() => setRole("volunteer")}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                      >
                        <Heart className="h-6 w-6" />
                        <span className="text-xs">Volunteer</span>
                      </Button>
                      <Button
                        type="button"
                        variant={role === "authority" ? "default" : "outline"}
                        onClick={() => setRole("authority")}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                      >
                        <Shield className="h-6 w-6" />
                        <span className="text-xs">Authority</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
