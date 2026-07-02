import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import api from '../../api/axios';
import { DollarSign, TrendingUp, Car, Calendar } from 'lucide-react';

const Dearnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: d } = await api.get('/drivers/earnings');
        setData(d);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <h1 className="text-2xl font-black text-white mb-6">Earnings</h1>

        {loading ? <Loader /> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="card border-yellow-400/20 bg-yellow-400/5">
                <DollarSign className="w-6 h-6 text-yellow-400 mb-2" />
                <p className="text-xs text-white/40">Total Earnings</p>
                <p className="text-4xl font-black text-yellow-400">₹{data?.totalEarnings?.toFixed(0) || 0}</p>
              </div>
              <div className="card border-green-400/20 bg-green-400/5">
                <Car className="w-6 h-6 text-green-400 mb-2" />
                <p className="text-xs text-white/40">Total Rides</p>
                <p className="text-4xl font-black text-green-400">{data?.totalRides || 0}</p>
              </div>
              <div className="card border-blue-400/20 bg-blue-400/5">
                <TrendingUp className="w-6 h-6 text-blue-400 mb-2" />
                <p className="text-xs text-white/40">Avg per Ride</p>
                <p className="text-4xl font-black text-blue-400">
                  ₹{data?.totalRides ? (data.totalEarnings / data.totalRides).toFixed(0) : 0}
                </p>
              </div>
            </div>

            {/* Recent rides */}
            {data?.recentRides?.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-white mb-4">Recent Completed Rides</h2>
                <div className="card overflow-hidden p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="table-header">
                        <th className="px-4 py-3 text-left">Trip</th>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-right">Fare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentRides.map((b) => (
                        <tr key={b._id} className="table-row">
                          <td className="px-4 py-3 text-white/70">{b.selectedPickupCity} → {b.selectedDropCity}</td>
                          <td className="px-4 py-3 text-white/50">{b.userName || '—'}</td>
                          <td className="px-4 py-3 text-white/40 text-xs">{b.bookeddate}</td>
                          <td className="px-4 py-3 text-yellow-400 font-bold text-right">₹{b.fare}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dearnings;
