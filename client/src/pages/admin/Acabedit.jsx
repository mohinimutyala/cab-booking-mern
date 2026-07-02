import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Upload } from 'lucide-react';

const CAB_TYPES = ['Mini', 'Sedan', 'SUV', 'Premium', 'Luxury', 'Bike', 'Auto', 'Hatchback'];

const Acabedit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ drivername: '', carname: '', cartype: '', price: '', carno: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/cars/${id}`);
        setForm({ drivername: data.drivername, carname: data.carname, cartype: data.cartype, price: data.price, carno: data.carno });
        if (data.carImage) setPreview(data.carImage);
      } catch (err) {
        toast.error('Car not found');
        navigate('/admin/cabs');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('carImage', image);
      await api.put(`/cars/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Car updated!');
      navigate('/admin/cabs');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <button onClick={() => navigate('/admin/cabs')} className="flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Car List
        </button>
        <h1 className="text-2xl font-black text-white mb-6">Edit Car Data</h1>

        {loading ? <Loader /> : (
          <div className="max-w-xl">
            <div className="card">
              <form onSubmit={handleUpdate} className="space-y-5" id="edit-car-form">
                <div>
                  <label className="input-label">Driver Name</label>
                  <input id="edit-drivername" type="text" value={form.drivername}
                    onChange={(e) => setForm({ ...form, drivername: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="input-label">Car Model</label>
                  <input id="edit-carname" type="text" value={form.carname}
                    onChange={(e) => setForm({ ...form, carname: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="input-label">Car Type</label>
                  <select id="edit-cartype" value={form.cartype} onChange={(e) => setForm({ ...form, cartype: e.target.value })} className="input appearance-none" style={{ backgroundColor: '#111116', colorScheme: 'dark' }}>
                    {CAB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Car Number</label>
                  <input id="edit-carno" type="text" value={form.carno}
                    onChange={(e) => setForm({ ...form, carno: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="input-label">Price per km (₹)</label>
                  <input id="edit-price" type="number" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="input-label">Car Image</label>
                  <div className="border-2 border-dashed border-white/15 rounded-xl p-4 text-center hover:border-yellow-400/30 transition-colors">
                    {preview ? (
                      <div>
                        <img src={preview} alt="preview" className="w-full h-36 object-cover rounded-lg mb-2" />
                        <label htmlFor="edit-car-image-input" className="cursor-pointer text-xs text-yellow-400 hover:text-yellow-300">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />Change Image
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="edit-car-image-input" className="cursor-pointer flex flex-col items-center gap-2 py-4">
                        <Upload className="w-7 h-7 text-white/20" />
                        <span className="text-sm text-white/40">Upload new image</span>
                      </label>
                    )}
                    <input id="edit-car-image-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                </div>
                <button id="edit-car-save" type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
                  {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  Update
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Acabedit;
