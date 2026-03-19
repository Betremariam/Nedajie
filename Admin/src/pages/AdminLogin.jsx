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

const AdminLogin = () => {
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
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      return setError("All fields are required.");
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
      const msg = err.response?.data?.msg || "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1128] relative overflow-hidden font-inter">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-700/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02MCAwaC0xdjYwaDFWMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz4KPHBhdGggZD0iTTAgNjBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxem0wIDBoNjB2LTFIMHYxeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPgo8L3N2Zz4=')] pointer-events-none opacity-50" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] z-10 mx-4"
      >
        <Card className="bg-[#111827]/60 backdrop-blur-2xl border-white/5 rounded-3xl shadow-2xl overflow-hidden relative py-0 gap-0">
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

          <CardHeader className="p-10 pb-0 pt-12 items-center text-center">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-brand-400/20"
            >
              <div className="w-8 h-8 flex items-center justify-center relative">
                  <svg className="w-full h-full text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold text-white tracking-tight">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-brand-200/60 font-medium mt-2">
              Secure access to the ecosystem
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
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5 relative z-20">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <Label htmlFor="email" className="text-gray-300 mb-2 pl-1 block">
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors z-10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-11 h-12 bg-[#1f2937]/40 border-gray-700/50 text-white rounded-xl focus-visible:ring-brand-500/50 focus-visible:border-brand-500 transition-all placeholder:text-gray-600 shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Label htmlFor="password" title="Password" className="text-gray-300 mb-2 pl-1 block">
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors z-10">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-12 h-12 bg-[#1f2937]/40 border-gray-700/50 text-white rounded-xl focus-visible:ring-brand-500/50 focus-visible:border-brand-500 transition-all placeholder:text-gray-600 shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none transition-colors z-10"
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
                  className="w-full h-12 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl hover:from-brand-500 hover:to-brand-400 transition-all duration-300 font-semibold shadow-[0_4px_20px_0_rgba(37,99,235,0.2)] hover:shadow-[0_4px_25px_0_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group border-0 text-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span className="tracking-wide">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wider uppercase text-sm">Sign In</span>
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
          
          <CardFooter className="bg-[#1f2937]/30 py-4 px-8 border-t border-gray-800/60 justify-center">
             <p className="text-xs text-gray-500 font-medium">NigdBureau Bureau System v2.0</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
