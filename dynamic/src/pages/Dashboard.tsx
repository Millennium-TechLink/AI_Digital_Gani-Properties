import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Save, 
  X, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  DollarSign,
  Home,
  Calendar,
  Briefcase,
  LayoutDashboard,
  Users,
  Settings,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { propertiesApi, PropertiesApiError } from '@/lib/propertiesApi';
import { careersApi, Career, CareersApiError } from '@/lib/careersApi';
import { login, logout, isAuthenticated } from '@/lib/auth';
import { Property, PropertyType } from '@/types/property';

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'residential-plots', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'retail', label: 'Retail' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'farm-plots', label: 'Farm Land' },
  { value: 'agricultural-lands', label: 'Agricultural Lands' },
];

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'new', label: 'New' },
];

const CAREER_CATEGORIES = [
  'Procurement & Finance',
  'Engineering & Operations',
  'Skilled Trades & Support',
  'Vendors & Partners'
];

const INDIA_STATES_CITIES: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kadapa', 'Kakinada'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Nagaon', 'Jorhat', 'Tezpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
  'Goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Baddi', 'Kullu', 'Manali'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davangere', 'Shivamogga'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Solapur', 'Kolhapur', 'Navi Mumbai', 'Amravati'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bharatpur', 'Alwar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Secunderabad'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Noida', 'Bareilly', 'Aligarh'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh', 'Kashipur'],
  'West Bengal': ['Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Howrah', 'Kharagpur', 'Bardhaman'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Janakpuri', 'Lajpat Nagar', 'Saket', 'Connaught Place'],
  'Chandigarh': ['Chandigarh'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Sopore', 'Baramulla'],
  'Ladakh': ['Leh', 'Kargil'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
};

const INDIA_STATES = Object.keys(INDIA_STATES_CITIES).sort();

type Tab = 'properties' | 'careers' | 'settings';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('properties');
  const [authenticated, setAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Global UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [propertyFormData, setPropertyFormData] = useState({
    title: '',
    type: 'residential-plots' as PropertyType,
    city: '',
    area: '',
    priceLabel: '',
    size: '',
    status: 'available' as 'available' | 'sold' | 'new',
    highlights: [] as string[],
    lat: '',
    lon: '',
    googleMapsUrl: '',
    images: [] as string[],
    description: '',
    featured: false,
  });

  // Careers state
  const [careers, setCareers] = useState<Career[]>([]);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [careerFormData, setCareerFormData] = useState({
    title: '',
    category: CAREER_CATEGORIES[0],
    description: '',
    requirements: [] as string[],
    benefits: [] as string[],
    state: '',
    city: '',
  });

  const [inputVal, setInputVal] = useState({
    highlight: '',
    image: '',
    requirement: '',
    benefit: ''
  });

  // Settings state
  const [settingsEmail, setSettingsEmail] = useState('vaishnavigore37@gmail.com');
  const [settingsFromName, setSettingsFromName] = useState('Gani Properties Careers');
  const [settingsSmtpHost, setSettingsSmtpHost] = useState('');
  const [settingsSmtpPort, setSettingsSmtpPort] = useState('587');
  const [settingsSmtpUser, setSettingsSmtpUser] = useState('');
  const [settingsSmtpPass, setSettingsSmtpPass] = useState('');
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    if (isAuthenticated()) {
      loadData();
      loadSettings();
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [props, jobs] = await Promise.all([
        propertiesApi.getAll(),
        careersApi.getAll()
      ]);
      setProperties(props);
      setCareers(jobs);
    } catch (err: any) {
      // If token expired / invalid, auto-logout and show login screen
      const status = err?.statusCode || err?.response?.status;
      if (status === 401) {
        logout();
        setAuthenticated(false);
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data.applicationEmail) setSettingsEmail(data.applicationEmail);
        if (data.emailFromName) setSettingsFromName(data.emailFromName);
        if (data.smtpHost) setSettingsSmtpHost(data.smtpHost);
        if (data.smtpPort) setSettingsSmtpPort(String(data.smtpPort));
        if (data.smtpUser) setSettingsSmtpUser(data.smtpUser);
        // Never load password back for security — user must re-enter
      }
    } catch {}
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');
      const body: Record<string, any> = {
        applicationEmail: settingsEmail,
        emailFromName: settingsFromName,
      };
      if (settingsSmtpHost) body.smtpHost = settingsSmtpHost;
      if (settingsSmtpPort) body.smtpPort = Number(settingsSmtpPort);
      if (settingsSmtpUser) body.smtpUser = settingsSmtpUser;
      if (settingsSmtpPass) body.smtpPass = settingsSmtpPass;
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed');
      setSuccess('Settings saved! Email delivery is now configured.');
      setSettingsSmtpPass(''); // Clear password from UI after save
    } catch {
      setError('Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const result = await login(username, password);
      if (result.success) {
        setAuthenticated(true);
        loadData();
        loadSettings();
      } else {
        setLoginError(result.message);
      }
    } catch (err) {
      setLoginError('Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
  };

  // --- CRUD Property ---
  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...propertyFormData,
        lat: propertyFormData.lat ? parseFloat(propertyFormData.lat) : undefined,
        lon: propertyFormData.lon ? parseFloat(propertyFormData.lon) : undefined,
      };
      if (editingProperty) {
        await propertiesApi.update(editingProperty.id, data);
        setSuccess('Property updated');
      } else {
        await propertiesApi.create(data);
        setSuccess('Property created');
      }
      setShowPropertyForm(false);
      setEditingProperty(null);
      loadData();
    } catch (err) {
      setError('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm('Delete property?')) return;
    try {
      await propertiesApi.delete(id);
      loadData();
      setSuccess('Property deleted');
    } catch (err) {
      setError('Delete failed');
    }
  };

  // --- CRUD Careers ---
  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCareer) {
        await careersApi.update(editingCareer.id, careerFormData);
        setSuccess('Career updated');
      } else {
        await careersApi.create(careerFormData);
        setSuccess('Career created');
      }
      setShowCareerForm(false);
      setEditingCareer(null);
      loadData();
    } catch (err: any) {
      const status = err?.statusCode || err?.response?.status;
      if (status === 401) {
        logout();
        setAuthenticated(false);
        setError('Session expired. Please log in again.');
      } else {
        setError('Failed to save career');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteCareer = async (id: string) => {
    if (!confirm('Delete opening?')) return;
    try {
      await careersApi.delete(id);
      loadData();
      setSuccess('Career deleted');
    } catch (err) {
      setError('Delete failed');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gp-surface/5 pt-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gp-ink/10">
          <div className="text-center mb-8">
            <LayoutDashboard className="h-12 w-12 text-gp-accent mx-auto mb-4" />
            <h1 className="text-3xl font-display font-bold text-gp-ink">Admin Dashboard</h1>
            <p className="text-gp-ink-muted mt-2">Sign in to manage your content</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2"><AlertCircle size={16} />{loginError}</div>}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gp-ink">Username</label>
              <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" required className="bg-gp-surface/30 px-4 py-3" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gp-ink">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="bg-gp-surface/30 px-4 py-3" />
            </div>
            <Button type="submit" disabled={loginLoading} className="w-full py-6 text-lg font-bold">
              {loginLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gp-surface/5 pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-gp-ink">Dashboard</h1>
            <p className="text-gp-ink-muted text-lg mt-1">Manage your properties and career openings</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" onClick={handleLogout} className="flex-1 md:flex-none border-gp-ink/10 text-gp-ink hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-green-500 text-white rounded-xl shadow-lg flex items-center gap-3">
              <CheckCircle2 size={20} /> {success}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-500 text-white rounded-xl shadow-lg flex items-center gap-3">
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-gp-ink/10 mb-8 w-fit">
          <button onClick={() => setActiveTab('properties')} className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'properties' ? 'bg-[#0F3A3D] text-white shadow-lg' : 'text-gp-ink-muted hover:text-gp-ink hover:bg-white/50'}`}>
            <Home size={18} /> Properties
          </button>
          <button onClick={() => setActiveTab('careers')} className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'careers' ? 'bg-[#0F3A3D] text-white shadow-lg' : 'text-gp-ink-muted hover:text-gp-ink hover:bg-white/50'}`}>
            <Briefcase size={18} /> Careers
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#0F3A3D] text-white shadow-lg' : 'text-gp-ink-muted hover:text-gp-ink hover:bg-white/50'}`}>
            <Settings size={18} /> Settings
          </button>
        </div>

        {activeTab === 'properties' ? (
          /* PROPERTIES SECTION */
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-gp-ink">Property Listings</h2>
              <Button onClick={() => { setShowPropertyForm(true); setEditingProperty(null); }} className="bg-gp-accent hover:bg-gp-accent-dark">
                <Plus className="mr-2 h-4 w-4" /> Add Property
              </Button>
            </div>

            {/* Property Form */}
            {showPropertyForm && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-gp-ink/10 shadow-2xl">
                 {/* ... Form UI (similar to previous PropertyDashboard but professionalized) ... */}
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gp-ink">{editingProperty ? 'Edit Property' : 'New Property'}</h3>
                    <Button variant="ghost" onClick={() => setShowPropertyForm(false)}><X size={20} /></Button>
                 </div>
                 <form onSubmit={handlePropertySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-sm font-semibold">Title</label><Input value={propertyFormData.title} onChange={e => setPropertyFormData({...propertyFormData, title: e.target.value})} required /></div>
                    <div className="space-y-2"><label className="text-sm font-semibold">Type</label>
                      <Select value={propertyFormData.type} onChange={e => setPropertyFormData({...propertyFormData, type: e.target.value as PropertyType})}>
                        {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </Select>
                    </div>
                    <div className="space-y-2"><label className="text-sm font-semibold">City</label><Input value={propertyFormData.city} onChange={e => setPropertyFormData({...propertyFormData, city: e.target.value})} required /></div>
                    <div className="space-y-2"><label className="text-sm font-semibold">Area</label><Input value={propertyFormData.area} onChange={e => setPropertyFormData({...propertyFormData, area: e.target.value})} required /></div>
                    <div className="space-y-2"><label className="text-sm font-semibold">Price</label><Input value={propertyFormData.priceLabel} onChange={e => setPropertyFormData({...propertyFormData, priceLabel: e.target.value})} /></div>
                    <div className="space-y-2"><label className="text-sm font-semibold">Status</label>
                      <Select value={propertyFormData.status} onChange={e => setPropertyFormData({...propertyFormData, status: e.target.value as any})}>
                        {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </Select>
                    </div>
                    <div className="md:col-span-2 space-y-2"><label className="text-sm font-semibold">Description</label><Textarea value={propertyFormData.description} onChange={e => setPropertyFormData({...propertyFormData, description: e.target.value})} rows={4} required /></div>
                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                      <Button variant="outline" type="button" onClick={() => setShowPropertyForm(false)}>Cancel</Button>
                      <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Property'}</Button>
                    </div>
                 </form>
              </motion.div>
            )}

            {/* Properties List */}
            <div className="bg-white rounded-3xl border border-gp-ink/10 shadow-lg overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gp-surface/50 border-b border-gp-ink/10">
                    <tr>
                      <th className="px-6 py-4 font-bold text-sm text-gp-ink">Property</th>
                      <th className="px-6 py-4 font-bold text-sm text-gp-ink">Location</th>
                      <th className="px-6 py-4 font-bold text-sm text-gp-ink">Type</th>
                      <th className="px-6 py-4 font-bold text-sm text-gp-ink text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gp-ink/10">
                    {properties.map(p => (
                      <tr key={p.id} className="hover:bg-gp-surface/30 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-gp-ink">{p.title}</div>
                          <div className="text-xs text-gp-ink-muted">{p.status}</div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gp-ink-muted">{p.area}, {p.city}</td>
                        <td className="px-6 py-5 text-sm uppercase font-semibold text-gp-accent">{p.type.replace('-', ' ')}</td>
                        <td className="px-6 py-5 text-right space-x-2">
                           <Button variant="outline" size="sm" onClick={() => { 
                             setEditingProperty(p); 
                             setPropertyFormData({...p, priceLabel: p.priceLabel || '', size: p.size || '', lat: p.lat?.toString() || '', lon: p.lon?.toString() || ''}); 
                             setShowPropertyForm(true); 
                           }}><Edit2 size={14}/></Button>
                           <Button variant="outline" size="sm" className="text-red-500" onClick={() => deleteProperty(p.id)}><Trash2 size={14}/></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        ) : activeTab === 'careers' ? (
          /* CAREERS SECTION */
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-gp-ink">Job Openings</h2>
              <Button onClick={() => { setShowCareerForm(true); setEditingCareer(null); setCareerFormData({title:'',category:CAREER_CATEGORIES[0],description:'',requirements:[],benefits:[],state:'',city:''}) }} className="bg-gp-accent hover:bg-gp-accent-dark">
                <Plus className="mr-2 h-4 w-4" /> Add Career
              </Button>
            </div>

            {/* Career Form */}
            {showCareerForm && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl border border-gp-ink/10 shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gp-ink">{editingCareer ? 'Edit Job Posting' : 'New Job Posting'}</h3>
                    <Button variant="ghost" onClick={() => setShowCareerForm(false)}><X size={20} /></Button>
                 </div>
                 <form onSubmit={handleCareerSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Job Title</label>
                        <Input value={careerFormData.title} onChange={e => setCareerFormData({...careerFormData, title: e.target.value})} placeholder="e.g. Civil Engineer" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Category</label>
                        <Select value={careerFormData.category} onChange={e => setCareerFormData({...careerFormData, category: e.target.value})}>
                          {CAREER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-1"><MapPin size={13} className="text-gp-accent" />State</label>
                        <Select
                          value={careerFormData.state}
                          onChange={e => setCareerFormData({...careerFormData, state: e.target.value, city: ''})}
                        >
                          <option value="">— Select State —</option>
                          {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-1"><MapPin size={13} className="text-gp-accent" />City</label>
                        <Select
                          value={careerFormData.city}
                          onChange={e => setCareerFormData({...careerFormData, city: e.target.value})}
                          disabled={!careerFormData.state}
                        >
                          <option value="">{careerFormData.state ? '— Select City —' : '— Select state first —'}</option>
                          {(careerFormData.state ? INDIA_STATES_CITIES[careerFormData.state] || [] : []).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Job Description</label>
                      <Textarea value={careerFormData.description} onChange={e => setCareerFormData({...careerFormData, description: e.target.value})} rows={4} placeholder="Describe the role and responsibilities..." required />
                    </div>
                    
                    {/* Requirements List */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold">Requirements</label>
                      <div className="flex gap-2">
                        <Input value={inputVal.requirement} onChange={e => setInputVal({...inputVal, requirement: e.target.value})} placeholder="Add requirement..." onKeyPress={e => { if(e.key==='Enter') {e.preventDefault(); if(inputVal.requirement){setCareerFormData({...careerFormData, requirements: [...careerFormData.requirements, inputVal.requirement]}); setInputVal({...inputVal, requirement:''});}} }} />
                        <Button type="button" onClick={() => { if(inputVal.requirement){setCareerFormData({...careerFormData, requirements: [...careerFormData.requirements, inputVal.requirement]}); setInputVal({...inputVal, requirement:''})} }}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {careerFormData.requirements.map((r, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-1 bg-gp-surface text-gp-ink rounded-full text-sm border border-gp-ink/10">
                            {r} <button type="button" onClick={() => setCareerFormData({...careerFormData, requirements: careerFormData.requirements.filter((_, idx)=>idx!==i)})}><X size={12}/></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" type="button" onClick={() => setShowCareerForm(false)}>Cancel</Button>
                      <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : 'Save Posting'}</Button>
                    </div>
                 </form>
              </motion.div>
            )}

            {/* Careers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gp-ink/20">
                  <Briefcase size={40} className="mx-auto text-gp-ink-muted mb-4 opacity-20" />
                  <p className="text-gp-ink-muted">No job openings yet. Create your first posting!</p>
                </div>
              ) : (
                careers.map(c => (
                  <motion.div key={c.id} layout className="bg-white p-6 rounded-2xl border border-gp-ink/10 shadow-md group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <span className="px-3 py-1 bg-gp-accent/10 text-gp-accent rounded-full text-xs font-bold uppercase">{c.category}</span>
                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="sm" onClick={() => { setEditingCareer(c); setCareerFormData({title: c.title, category: c.category, description: c.description, requirements: c.requirements || [], benefits: c.benefits || [], state: c.state || '', city: c.city || ''}); setShowCareerForm(true); }}><Edit2 size={14}/></Button>
                         <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteCareer(c.id)}><Trash2 size={14}/></Button>
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-gp-ink mb-2">{c.title}</h3>
                    <p className="text-gp-ink-muted text-sm line-clamp-3 mb-4">{c.description}</p>
                    {(c.state || c.city) && (
                       <div className="flex items-center gap-1 text-xs text-gp-ink-muted mb-3">
                         <MapPin size={11} className="text-gp-accent shrink-0" />
                         <span className="font-medium">{[c.city, c.state].filter(Boolean).join(', ')}</span>
                       </div>
                     )}
                    <div className="pt-4 border-t border-gp-ink/10 flex justify-between items-center text-xs text-gp-ink-muted">
                       <span>Posted {new Date(c.postedAt).toLocaleDateString()}</span>
                       <span className="flex items-center gap-1 font-bold text-gp-accent"><Users size={12}/> {(c.requirements || []).length} Requirements</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          /* SETTINGS SECTION */
          <div className="max-w-2xl space-y-5">
            <h2 className="text-2xl font-display font-bold text-gp-ink">Email Settings</h2>

            <form onSubmit={handleSettingsSave} className="space-y-5">

              {/* Card 1 — Recipient */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-gp-ink/10 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-gp-accent/10 rounded-xl flex items-center justify-center"><Mail size={17} className="text-gp-accent" /></div>
                  <div>
                    <h3 className="font-bold text-gp-ink">Applications go to</h3>
                    <p className="text-xs text-gp-ink-muted">Where applicants' submissions are forwarded</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gp-ink">Recipient Email *</label>
                    <Input type="email" value={settingsEmail} onChange={e => setSettingsEmail(e.target.value)} placeholder="hr@company.com" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gp-ink">Sender Display Name</label>
                    <Input value={settingsFromName} onChange={e => setSettingsFromName(e.target.value)} placeholder="Gani Properties Careers" />
                  </div>
                </div>
              </motion.div>

              {/* Card 2 — SMTP Sender */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="bg-white p-6 rounded-3xl border border-gp-ink/10 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><Settings size={17} className="text-blue-500" /></div>
                  <div>
                    <h3 className="font-bold text-gp-ink">SMTP — Sending Account</h3>
                    <p className="text-xs text-gp-ink-muted">The email account that actually sends the notification</p>
                  </div>
                </div>

                {/* Presets */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gp-ink-muted uppercase tracking-wide mb-2">Quick Preset</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: '📧 Gmail', host: 'smtp.gmail.com', active: settingsSmtpHost === 'smtp.gmail.com' },
                      { label: '🏢 Office 365', host: 'smtp.office365.com', active: settingsSmtpHost === 'smtp.office365.com' },
                      { label: '🔶 Zoho Mail', host: 'smtp.zoho.com', active: settingsSmtpHost === 'smtp.zoho.com' },
                    ].map(p => (
                      <button key={p.host} type="button"
                        onClick={() => { setSettingsSmtpHost(p.host); setSettingsSmtpPort('587'); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${p.active ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gp-ink/15 text-gp-ink-muted hover:border-gp-ink/30'}`}
                      >{p.label}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-sm font-semibold text-gp-ink">SMTP Host</label>
                      <Input value={settingsSmtpHost} onChange={e => setSettingsSmtpHost(e.target.value)} placeholder="smtp.office365.com" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gp-ink">Port</label>
                      <Input value={settingsSmtpPort} onChange={e => setSettingsSmtpPort(e.target.value)} placeholder="587" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gp-ink">Sender Email *</label>
                    <Input type="email" value={settingsSmtpUser} onChange={e => setSettingsSmtpUser(e.target.value)} placeholder="sender@gmail.com" />
                    <p className="text-xs text-gp-ink-muted">Can be any email — doesn't have to match the recipient.</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gp-ink">Password / App Password</label>
                    <div className="relative">
                      <Input
                        type={showSmtpPass ? 'text' : 'password'}
                        value={settingsSmtpPass}
                        onChange={e => setSettingsSmtpPass(e.target.value)}
                        placeholder={settingsSmtpUser ? '••••••••••••••••' : 'Enter password'}
                      />
                      <button type="button" onClick={() => setShowSmtpPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gp-ink-muted hover:text-gp-ink px-1">
                        {showSmtpPass ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {settingsSmtpHost === 'smtp.gmail.com' && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        💡 Gmail requires an <strong>App Password</strong>, not your regular password. <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="underline font-semibold">Generate one here →</a>
                      </p>
                    )}
                    {settingsSmtpHost === 'smtp.office365.com' && (
                      <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                        💡 Use your <strong>Outlook/Office 365</strong> email and password. If your company has MFA enabled, generate an App Password from your Microsoft account.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={settingsSaving} className="bg-[#0F3A3D] text-white px-8">
                  {settingsSaving ? <><Loader2 size={15} className="animate-spin mr-2" />Saving...</> : <><Save size={15} className="mr-2" />Save Settings</>}
                </Button>
                <p className="text-xs text-gp-ink-muted">Password is encrypted on the server. Leave blank to keep existing password.</p>
              </div>

            </form>
          </div>
        ) : null}


      </div>
    </div>
  );
}
