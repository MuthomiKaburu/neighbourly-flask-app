import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Hits the /register endpoint on your Flask backend
      await api.post('/register', formData);
      toast.success("Account created successfully! Please log in.");
      navigate('/login'); // Redirects to login page after success
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20 mb-4">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-2">Join your local neighborhood network</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                required
                type="text"
                placeholder="johndoe"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                required
                type="email"
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98] mt-4"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/60 pt-6">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;