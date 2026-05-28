import { useState, useEffect } from "react";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { useTranslation } from "react-i18next";

const AdminLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in unless they need to change password
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminStr = localStorage.getItem("admin");
    
    if (token && adminStr) {
      // Validate token expiration
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          // Token expired, clear storage and stay on login page
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");
          localStorage.removeItem("stationIds");
          return;
        }
        
        // Token is valid, redirect to appropriate dashboard
        const admin = JSON.parse(adminStr);
        if (admin.mustChangePassword) {
          navigate("/change-password");
        } else {
          if (admin.role === "super") navigate("/super-admin/dashboard");
          else if (admin.role === "federal") navigate("/federal/dashboard");
          else if (admin.role === "approver") navigate("/approver/dashboard");
          else if (admin.role === "register") navigate("/register/register-dashboard");
          else if (admin.role === "stationOwner") navigate("/owner/dashboard");
        }
      } catch (e) {
        // Invalid token format, clear storage and stay on login page
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        localStorage.removeItem("stationIds");
        return;
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return setError(t("allFieldsRequired"));
    }

    try {
      const res = await loginAdmin({ email, password });
      const { token, admin, mustChangePassword } = res.data;

      const adminData = { ...admin, mustChangePassword };

      localStorage.setItem("adminToken", token);
      localStorage.setItem("admin", JSON.stringify(adminData));

      if (admin.role === "stationOwner" && admin.stationIds) {
        localStorage.setItem("stationIds", JSON.stringify(admin.stationIds));
      }

      if (mustChangePassword) {
        navigate("/change-password");
      } else {
        if (admin.role === "super") navigate("/super-admin/dashboard");
        else if (admin.role === "federal") navigate("/federal/dashboard");
        else if (admin.role === "approver") navigate("/approver/dashboard");
        else if (admin.role === "register") navigate("/register/register-dashboard");
        else if (admin.role === "stationOwner") navigate("/owner/dashboard");
      }

    } catch (err) {
      const msg = err.response?.data?.msg || t("loginFailed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-inter p-4">
      {/* Dynamic Background Elements - Using subtle theme colors */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02MCAwaC0xdjYwaDFWMHoiIGZpbGw9InJnYmEoMTUwLDE1MCwxNTAsMC4wNSkiLz4KPHBhdGggZD0iTTAgNjBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxeiIgZmlsbD0icmdiYSgxNTAsMTUwLDE1MCwwLjA1KSIvPgo8L3N2Zz4=')] pointer-events-none opacity-50 dark:opacity-30" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] z-10"
      >
        <Card className="bg-card border-border rounded-3xl shadow-xl overflow-hidden relative py-0 gap-0">
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-primary" />

          <CardHeader className="p-10 pb-0 pt-12 items-center text-center">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/20"
            >
              <div className="w-8 h-8 flex items-center justify-center relative">
                  <svg className="w-full h-full text-primary drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {t("adminPortal")}
            </CardTitle>
            <CardDescription className="font-medium mt-2">
              {t("secureAccess")}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 pt-8">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="mb-6"
                >
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5 relative z-20">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Label htmlFor="email" className="mb-2 pl-1 block">
                  {t("emailAddress")}
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    className="pl-12 h-12 bg-background border-input shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Label htmlFor="password" title="Password" className="mb-2 pl-1 block">
                  {t("password")}
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors z-10">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    className="pl-12 pr-12 h-12 bg-background border-input shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.7 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group text-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span className="tracking-wide">{t("authenticating")}</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wider uppercase text-sm font-semibold">{t("signIn")}</span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                         <ArrowRight className="w-5 h-5 ml-1" />
                      </motion.div>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="bg-muted/50 py-4 px-8 border-t justify-center">
             <p className="text-xs text-muted-foreground font-medium">{t("systemVersion")}</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );

};

export default AdminLogin;
