import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Package, Calendar, Check, XCircle } from 'lucide-react';

const getItemImage = (category, name) => {
  const normalized = category?.toLowerCase() || '';
  if (normalized.includes('construction') || normalized.includes('drill') || name.toLowerCase().includes('drill')) {
    return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80';
  }
  if (normalized.includes('garden') || normalized.includes('lawn')) {
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80';
  }
  if (normalized.includes('electronic') || normalized.includes('tech')) {
    return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&w=600&q=80';
};

const Profile = () => {
  const [rentals, setRentals] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [activeTab, setActiveTab] = useState('borrowing'); // 'borrowing' or 'lending'

  useEffect(() => {
    // Fetch active reservations
    api.get('/user/reservations')
      .then(res => setRentals(res.data))
      .catch(() => toast.error("Could not sync your active rentals."));

    // Fetch items user is lending
    api.get('/user/items')
      .then(res => setMyItems(res.data))
      .catch(() => toast.error("Could not sync your listed assets."));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Navigation */}
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Profile Info Card */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl mb-10 flex items-center gap-4">
          <div className="p-4 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">My Community Ledger</h2>
            <p className="text-slate-400 text-sm">Monitor your current active bookings and shared garage gear.</p>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b border-slate-800 mb-8 gap-6">
          <button
            onClick={() => setActiveTab('borrowing')}
            className={`pb-4 text-sm font-bold tracking-wide transition relative ${activeTab === 'borrowing' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Currently Borrowing ({rentals.length})
            {activeTab === 'borrowing' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab('lending')}
            className={`pb-4 text-sm font-bold tracking-wide transition relative ${activeTab === 'lending' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            My Listed Gear ({myItems.length})
            {activeTab === 'lending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
          </button>
        </div>

        {/* Grid Dynamic Render Container */}
        {activeTab === 'borrowing' ? (
          rentals.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-slate-500">
              <Package className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>You aren't borrowing any tools right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentals.map(item => (
                <div key={item.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col">
                  <img src={getItemImage(item.category, item.name)} alt={item.name} className="h-40 w-full object-cover opacity-70" />
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      <p className="text-slate-400 text-xs mt-1">{item.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-amber-400 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Due Back:</span>
                      </div>
                      <span className="font-bold">{item.end_date || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          myItems.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-slate-500">
              <Package className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p>You haven't listed any items to share yet.</p>
              <Link to="/lend" className="text-blue-400 hover:underline text-sm font-semibold block mt-2">Lend an item now</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map(item => (
                <div key={item.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col">
                  <img src={getItemImage(item.category, item.name)} alt={item.name} className="h-40 w-full object-cover opacity-70" />
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.name}</h4>
                      <p className="text-slate-400 text-xs mt-1">{item.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {item.category}
                      </span>
                      {item.is_available ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check className="w-3 h-3" /> Shelf Ready
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> In Use
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;