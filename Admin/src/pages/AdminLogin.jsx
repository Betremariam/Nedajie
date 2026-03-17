import { useState, useEffect } from "react";
import { loginAdmin } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

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

      // Ensure mustChangePassword is part of what we store to easily recheck
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
        <div className="bg-[#111827]/60 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
          
          {/* Subtle top highlight */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

          <div className="p-10 pt-12">
            <div className="text-center mb-10">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-brand-400/20"
              >
                <div className="w-8 h-8 flex items-center justify-center relative">
                    <svg className="w-full h-full text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2 tracking-tight"
              >
                Admin Portal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="text-brand-200/60 font-medium"
              >
                Secure access to the ecosystem
              </motion.p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-red-200 text-sm leading-relaxed">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5 relative z-20">
              
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <label className="block text-sm font-medium text-gray-300 mb-2 pl-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#1f2937]/40 border border-gray-700/50 text-white rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none placeholder:text-gray-600 shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <div className="flex justify-between mb-2 pl-1 pr-1">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-[#1f2937]/40 border border-gray-700/50 text-white rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all outline-none placeholder:text-gray-600 shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white py-3.5 px-4 rounded-xl hover:from-brand-500 hover:to-brand-400 transition-all duration-300 font-semibold shadow-[0_4px_20px_0_rgba(37,99,235,0.2)] hover:shadow-[0_4px_25px_0_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="tracking-wide">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span className="tracking-wider text-sm uppercase">Sign In</span>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                         <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                         </svg>
                      </motion.div>
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
          
          {/* Footer inside card */}
          <div className="bg-[#1f2937]/30 py-4 px-8 border-t border-gray-800/60 text-center">
             <p className="text-xs text-gray-500 font-medium">NigdBureau Bureau System v2.0</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
