import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { LogIn, User, Lock } from 'lucide-react';


const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const loadingToast = toast.loading('Authenticating credentials...');
    try {
      const res = await api.post('/login', formData);
      login(res.data.access_token);
      toast.success('Welcome back to the neighborhood!', { id: loadingToast });
      navigate('/dashboard');
    } catch (err) {
      toast.error('Invalid username or password. Please try again.', { id: loadingToast });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="w-full max-w-md p-8 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1.5">Sign in to sync with your local network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username</label>
            <div className="relative mt-2">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-blue-500 text-slate-200 outline-none transition"
                placeholder="muthomi"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-blue-500 text-slate-200 outline-none transition"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>
          <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl active:scale-98 transition flex items-center justify-center gap-2 shadow-xl shadow-blue-600/10 text-white mt-4">
            <span>Sign In</span>
          </button>
        </form>
        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
