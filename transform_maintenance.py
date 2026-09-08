import re

with open('src/components/maintenance/MaintenanceSettingsView.tsx', 'r') as f:
    content = f.read()

# We want to grab the imports and interfaces at the top
header_match = re.search(r'^(.*?)(?=export const MaintenanceSettingsView)', content, re.DOTALL)
header_code = header_match.group(1)

# Ensure FileSpreadsheet is imported
if 'FileSpreadsheet' not in header_code:
    header_code = header_code.replace('lucide-react\';', 'FileSpreadsheet } from \'lucide-react\';')

# Grab everything inside the original component
component_body = re.search(r'export const MaintenanceSettingsView.*?\{((?:.|\n)*)return \(\n    <div className="flex flex-col h-full', content).group(1)

# Grab the JSX main form content
jsx_main = re.search(r'\{/\* Main Form \*/\}\n      <div className="flex-1 overflow-y-auto p-4 lg:p-6">\n        <div className="max-w-4xl mx-auto space-y-6">((?:.|\n)*?)</div>\n      </div>\n    </div>\n  \);\n\};', content).group(1)


new_content = f"""{header_code}
interface SettingsRecord {{
  id: string;
  title: string;
}}

export const MaintenanceSettingsView: React.FC<MaintenanceSettingsViewProps> = ({{ onBack }}) => {{
  const [records, setRecords] = useState<SettingsRecord[]>([
    {{ id: '1', title: 'تنظیمات بازدید سرور HP' }},
    {{ id: '2', title: 'تنظیمات بازدید نرم‌افزار ERP' }},
  ]);
  const [selectedId, setSelectedId] = useState<string>(records[0].id);

  const handleAdd = () => {{
    const newId = Math.random().toString(36).substring(2, 9);
    setRecords([...records, {{ id: newId, title: 'تنظیمات نگهداشت جدید' }}]);
    setSelectedId(newId);
  }};

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      {{/* Header */}}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">تنظیمات نگهداشت (بازدید دوره‌ای) محصول</h1>
            <p className="text-xs text-slate-500 mt-0.5">پیکربندی زمان‌بندی دوره‌ای، دستورالعمل‌ها و ملزومات پشتیبانی برای هر محصول</p>
          </div>
        </div>
        <button onClick={{onBack}} className="text-slate-500 hover:text-slate-800 font-medium text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          بازگشت
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {{/* Sidebar List */}}
        <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">لیست تنظیمات</h2>
            <button 
              onClick={{handleAdd}}
              className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
              title="افزودن تنظیمات جدید"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {{records.map(record => (
              <button
                key={{record.id}}
                onClick={{() => setSelectedId(record.id)}}
                className={{`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-right transition-colors ${{
                  selectedId === record.id 
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-700 border' 
                    : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                }}`}}
              >
                <FileSpreadsheet className={{`w-4 h-4 ${{selectedId === record.id ? 'text-indigo-600' : 'text-slate-400'}}`}} />
                <span className="text-xs font-bold truncate">{{record.title}}</span>
              </button>
            ))}}
          </div>
        </div>

        {{/* Editor Content */}}
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <MaintenanceSettingsEditor key={{selectedId}} onCancel={{onBack}} />
        </div>
      </div>
    </div>
  );
}};

const MaintenanceSettingsEditor = ({{ onCancel }}: {{ onCancel: () => void }}) => {{{component_body}
  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-6">{jsx_main}</div>
    </div>
  );
}};
"""

with open('src/components/maintenance/MaintenanceSettingsView.tsx', 'w') as f:
    f.write(new_content)

print("Done maintenance")
