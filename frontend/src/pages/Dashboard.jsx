import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext'; // Context containing user state
import toast from 'react-hot-toast';
import { Hammer, Calendar, Check, XCircle, LogOut, Info, Plus, User } from 'lucide-react';

// Helper function to return beautiful high-res images depending on custom user categories
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

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [reservationDates, setReservationDates] = useState({});
  const { logout, user } = useContext(AuthContext); // Destructured 'user' variable from context

  const fetchItems = () => {
    api.get('/items')
      .then(res => setItems(res.data))
      .catch(err => {
        console.error(err);
        toast.error("Failed to sync system inventory database.");
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDateChange = (itemId, value) => {
    setReservationDates({
      ...reservationDates,
      [itemId]: value
    });
  };

  const handleReserve = async (itemId) => {
    const selectedDate = reservationDates[itemId];
    if (!selectedDate) {
      toast.error("Please pick a projected return date.");
      return;
    }

    const actionToast = toast.loading('Processing asset allocation...');
    try {
      await api.post('/reservations', {
        item_id: itemId,
        end_date: selectedDate
      });
      toast.success("Item successfully allocated to your profile!", { id: actionToast });
      fetchItems();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to finalize reservation.";
      toast.error(errorMsg, { id: actionToast });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-1.5">
              <Hammer className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider text-xs">Community Inventory</span>
            </div>
            {/* Greeting updates dynamically depending on if your context passes an object or username string */}
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Hello, {typeof user === 'object' ? user?.username : (user || 'Neighbor')}
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Explore and instantly reserve community-shared assets.</p>
          </div>

          {/* Action Control Navbar */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-medium text-sm transition active:scale-95"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/lend"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition active:scale-95 shadow-lg shadow-blue-600/10 text-center justify-center flex-grow sm:flex-grow-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Lend an Item</span>
            </Link>

            <button
              onClick={() => {
                logout();
                toast.success("Logged out successfully.");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl font-medium text-sm transition active:scale-95 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700/60 transition-all duration-300 shadow-xl group">
              <div className="h-48 w-full overflow-hidden relative bg-slate-950">
                <img
                  src={getItemImage(item.category, item.name)}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-blue-400 border border-slate-800 rounded-md">
                    {item.category || "General"}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between bg-gradient-to-b from-slate-900/20 to-slate-900/60">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{item.name}</h3>
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed min-h-[40px]">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60">
                  <div className="flex justify-between items-center mb-4">
                    {item.is_available ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5" /> Available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Reserved
                      </span>
                    )}
                  </div>

                  {item.is_available ? (
                    <div className="space-y-3.5">
                      <div className="flex flex-col">
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Return Date:
                        </label>
                        <input
                          type="date"
                          className="w-full text-sm p-2.5 bg-slate-950/60 border border-slate-800 text-slate-300 rounded-xl outline-none focus:border-blue-500 transition inverted-colors"
                          onChange={(e) => handleDateChange(item.id, e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => handleReserve(item.id)}
                        className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition shadow-lg shadow-blue-600/10 active:scale-98"
                      >
                        Reserve Item
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-slate-950/40 border border-slate-900 rounded-xl text-slate-500 text-sm font-medium justify-center">
                      <Info className="w-4 h-4 text-slate-600" />
                      <span>Currently Checked Out</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;