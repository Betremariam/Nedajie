import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import API from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Alert, AlertDescription } from "../components/ui/Alert";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If we're on this page, but there's no auth token, redirect to login
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }

    setLoading(true);

    try {
      const res = await API.post("/admin-auth/change-password", {
        currentPassword,
        newPassword
      });

      setSuccess("Password updated successfully! Redirecting...");
      
      // Update local storage so we know they don't need to change it anymore if we stored it
      const adminData = JSON.parse(localStorage.getItem("admin"));
      if (adminData) {
         adminData.mustChangePassword = false;
         localStorage.setItem("admin", JSON.stringify(adminData));
      }

      // Redirect to correct dashboard after a short delay to show success
      setTimeout(() => {
        if (adminData.role === "super") navigate("/super-admin/dashboard");
        else if (adminData.role === "approver") navigate("/approver/dashboard");
        else if (adminData.role === "register") navigate("/register/register-dashboard");
        else if (adminData.role === "stationOwner") navigate("/owner/dashboard");
        else navigate("/");
      }, 1500);

    } catch (err) {
      const msg = err.response?.data?.msg || "Failed to change password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-inter p-4">
      {/* Background ambient light */}
      <div className="absolute top-[20%] left-[15%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-card border-border rounded-2xl shadow-xl overflow-hidden relative py-0 gap-0">
          
          {/* Top accent line */}
          <div className="h-1 w-full bg-primary" />
          
          <CardHeader className="p-8 pb-0 text-center items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-sm">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Setup Your Password</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-2">Please change your temporary password to continue to your dashboard.</CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password" title="Temporary Password" className="text-foreground pl-1">
                  Temporary Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="current-password"
                    type={showCurrent ? "text" : "password"}
                    className="pl-11 pr-12 h-12 bg-background border-input shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all"
                    placeholder="Enter temp password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground focus:outline-none z-10"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password" title="New Password" className="text-foreground pl-1">
                  New Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    className="pl-11 pr-12 h-12 bg-background border-input shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground focus:outline-none z-10"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" title="Confirm New Password" className="text-foreground pl-1">
                  Confirm New Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="confirm-password"
                    type={showNew ? "text" : "password"}
                    className="pl-11 pr-4 h-12 bg-background border-input shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group font-semibold shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span className="tracking-wide">Updating...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wide text-sm font-semibold uppercase">Save & Continue</span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                         <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
