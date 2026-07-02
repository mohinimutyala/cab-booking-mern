import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Car } from 'lucide-react';

const CAB_TYPES = ['Mini', 'Sedan', 'SUV', 'Premium', 'Luxury', 'Bike', 'Auto', 'Hatchback'];

const Addcar = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ drivername: '', carname: '', cartype: '', price: '', carno: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.drivername || !form.carname || !form.cartype || !form.price || !form.carno)
      return toast.error('All fields are required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('carImage', image);
      await api.post('/cars', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Car added successfully!');
      navigate('/admin/cabs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <button onClick={() => navigate('/admin/cabs')} className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Car List
        </button>
        <h1 className="text-2xl font-black text-white mb-6">Add Car</h1>

        <div className="max-w-xl">
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-5" id="add-car-form">
              <div>
                <label className="input-label">Driver Name</label>
                <input id="car-drivername" type="text" placeholder="Driver Name" value={form.drivername}
                  onChange={(e) => setForm({ ...form, drivername: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="input-label">Car Model</label>
                <input id="car-model" type="text" placeholder="e.g. Maruti Swift" value={form.carname}
                  onChange={(e) => setForm({ ...form, carname: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="input-label">Car Type</label>
                <select id="car-type" value={form.cartype} onChange={(e) => setForm({ ...form, cartype: e.target.value })} className="input appearance-none" required style={{ backgroundColor: '#111116', colorScheme: 'dark' }}>
                  <option value="">Select Car Type</option>
                  {CAB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Car Number</label>
                <input id="car-number" type="text" placeholder="e.g. MH 12 XY 5678" value={form.carno}
                  onChange={(e) => setForm({ ...form, carno: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="input-label">Price per km (₹)</label>
                <input id="car-price" type="number" placeholder="e.g. 12" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" required min="1" />
              </div>

              {/* Image upload */}
              <div>
                <label className="input-label">Car Image</label>
                <div className="border-2 border-dashed border-white/15 rounded-xl p-4 text-center hover:border-yellow-400/30 transition-colors">
                  {preview ? (
                    <div className="relative">
                      <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg mb-2" />
                      <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                        className="text-red-400 text-xs hover:text-red-300">Remove image</button>
                    </div>
                  ) : (
                    <label htmlFor="car-image-input" className="cursor-pointer flex flex-col items-center gap-2 py-6">
                      <Upload className="w-8 h-8 text-white/20" />
                      <span className="text-sm text-white/40">Click to upload car image</span>
                      <span className="text-xs text-white/20">JPG, PNG up to 5MB</span>
                    </label>
                  )}
                  <input id="car-image-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </div>

              <button id="add-car-submit" type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Car className="w-4 h-4" />}
                Add Car
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Addcar;
