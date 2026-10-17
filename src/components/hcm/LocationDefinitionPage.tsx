import React, { useState } from 'react';
import { 
  MapPin, 
  Save, 
  Trash2, 
  Plus, 
  Search,
  ChevronRight,
  Globe,
  Info,
  Eye
} from 'lucide-react';
import { motion } from 'motion/react';

import { locationManagementService } from '../../services/hcm/LocationManagementService';
import { Location } from '../../types/hcm/attendance';

export const LocationDefinitionPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>(locationManagementService.getLocations());
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleSave = () => {
    if (selectedLocation) {
      const exists = locations.find(l => l.id === selectedLocation.id);
      if (exists) {
        locationManagementService.updateLocation(selectedLocation.id, selectedLocation);
      } else {
        locationManagementService.addLocation(selectedLocation);
      }
      const updatedList = locationManagementService.getLocations();
      setLocations([...updatedList]);
    }
    setSelectedLocation(null);
  };

  const handleDelete = (id: string) => {
    locationManagementService.deleteLocation(id);
    const updatedList = locationManagementService.getLocations();
    setLocations([...updatedList]);
    setSelectedLocation(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rtl">
      <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">تعریف لوکیشن</h1>
            <p className="text-xs text-slate-400">مدیریت محدوده‌های جغرافیایی مجاز برای تردد</p>
          </div>
        </div>
        <button 
          onClick={() => setSelectedLocation({ id: Date.now().toString(), title: '', latitude: 0, longitude: 0, radius: 100, isActive: true })}
          className="bg-sky-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          لوکیشن جدید
        </button>
      </div>

      <div className="flex-1 p-6 flex gap-6 overflow-hidden">
        {/* List side */}
        <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="جستجو در لوکیشن‌ها..."
                className="w-full bg-slate-50 border border-slate-100 rounded-lg pr-10 pl-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {locations.map(loc => (
              <button 
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`w-full p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors group ${selectedLocation?.id === loc.id ? 'bg-sky-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${loc.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">{loc.title}</div>
                    <div className="text-[10px] text-slate-400">شعاع مجاز: {loc.radius} متر</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 rotate-180" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Editor side */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
          {selectedLocation ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-md font-bold text-slate-800">جزئیات لوکیشن</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDelete(selectedLocation.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">عنوان لوکیشن</label>
                  <input 
                    type="text" 
                    value={selectedLocation.title}
                    onChange={(e) => setSelectedLocation({...selectedLocation, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">شعاع مجاز (متر)</label>
                  <input 
                    type="number" 
                    value={selectedLocation.radius}
                    onChange={(e) => setSelectedLocation({...selectedLocation, radius: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">عرض جغرافیایی (Lat)</label>
                  <input 
                    type="number" 
                    value={selectedLocation.latitude}
                    onChange={(e) => setSelectedLocation({...selectedLocation, latitude: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">طول جغرافیایی (Lng)</label>
                  <input 
                    type="number" 
                    value={selectedLocation.longitude}
                    onChange={(e) => setSelectedLocation({...selectedLocation, longitude: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video w-full bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Globe className="w-8 h-8 text-slate-200 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold">نقشه در این منطقه در دسترس نیست</p>
                  <p className="text-[10px]">لطفاً مختصات را به صورت دستی وارد نمایید</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  انصراف
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-sky-600 text-white px-8 py-2 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-sky-700 transition-colors shadow-lg shadow-sky-100"
                >
                  <Save className="w-4 h-4" />
                  ذخیره تغییرات
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                <Info className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">یک لوکیشن انتخاب کنید</h3>
              <p className="max-w-xs text-sm">
                برای مشاهده و ویرایش جزئیات، یکی از لوکیشن‌های لیست سمت راست را انتخاب کنید یا یک لوکیشن جدید بسازید.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
