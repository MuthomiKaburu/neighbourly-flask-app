import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PackagePlus, ArrowLeft, Wrench, ShieldAlert } from 'lucide-react';

const LendItem = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Construction & Tools' // default select option
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionToast = toast.loading('Publishing asset to community directory...');

    try {
      await api.post('/items', formData);
      toast.success(`${formData.name} is now available for lending!`, { id: actionToast });
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to list item. Ensure you are logged in.';
      toast.error(errorMsg, { id: actionToast });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative">
        
        {/* Back Link */}
        <Link 
          to="/dashboard" 
          className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grid</span>
        </Link>

        {/* Header Header */}
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 mb-4">
            <PackagePlus className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Lend an Asset
          </h2>
          <p className="text-slate-400 text-sm mt-1.5 text-center max-w-sm">
            List your item so neighbors can safely borrow it when it's not in use.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Item Name / Model
            </label>
            <div className="relative">
              <Wrench className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                placeholder="e.g., DeWalt Cordless Drill"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-blue-500 text-slate-200 outline-none transition"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Category
            </label>
            <select 
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:border-blue-500 text-slate-300 outline-none transition cursor-pointer"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Construction & Tools">Construction & Tools</option>
              <option value="Gardening & Outdoor">Gardening & Outdoor</option>
              <option value="Electronics & Tech">Electronics & Tech</option>
              <option value="General Workshop">General Workshop</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Description & Conditions
            </label>
            <textarea 
              rows="4"
              placeholder="Provide clean instructions (e.g., Includes 2 batteries, please clean after finishing your task)."
              className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:border-blue-500 text-slate-200 outline-none transition resize-none leading-relaxed"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl text-slate-500 text-xs leading-normal">
            <ShieldAlert className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <span>By listing this item, you agree to make it available for temporary reservation requests by verified household profiles in your immediate neighborhood network.</span>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl active:scale-98 transition text-white shadow-xl shadow-blue-600/10 mt-2"
          >
            Confirm & Publish Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default LendItem;