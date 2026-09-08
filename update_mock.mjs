import fs from 'fs';

let content = fs.readFileSync('src/components/media/SendSignalView.tsx', 'utf-8');

// 1. Update MOCK_AUDIENCES
content = content.replace(
  `const MOCK_AUDIENCES = [
  { id: 'AUD-01', name: 'شرکت پتروشیمی زاگرس', inCamp1: true, inCamp2: false },
  { id: 'AUD-02', name: 'فولاد مبارکه اصفهان', inCamp1: true, inCamp2: true },
  { id: 'AUD-03', name: 'پالایشگاه نفت پارس', inCamp1: false, inCamp2: true },
  { id: 'AUD-04', name: 'شرکت توزیع برق تهران', inCamp1: false, inCamp2: false },
];`,
  `const MOCK_AUDIENCES = [
  { id: 'AUD-01', name: 'شرکت پتروشیمی زاگرس', type: 'lead', inCamp1: true, inCamp2: false },
  { id: 'AUD-02', name: 'فولاد مبارکه اصفهان', type: 'lead', inCamp1: true, inCamp2: true },
  { id: 'AUD-03', name: 'پالایشگاه نفت پارس', type: 'lead', inCamp1: false, inCamp2: true },
  { id: 'AUD-04', name: 'شرکت توزیع برق تهران', type: 'lead', inCamp1: false, inCamp2: false },
  { id: 'GRP-01', name: 'گروه مدیران خرید پتروشیمی', type: 'group', inCamp1: true, inCamp2: false },
  { id: 'GRP-02', name: 'گروه پیمانکاران رتبه یک', type: 'group', inCamp1: false, inCamp2: true },
];`
);

// 2. Change state from audienceId to audienceIds
content = content.replace(
  `const [audienceId, setAudienceId] = useState('');`,
  `const [audienceIds, setAudienceIds] = useState<string[]>([]);
  const [audienceSelectValue, setAudienceSelectValue] = useState('');`
);

// 3. Update handleInboundChange to handle array
content = content.replace(
  `setAudienceId(inb.audienceId);`,
  `setAudienceIds([inb.audienceId]);`
);

// 4. Update campaign select onchange to clear audienceIds
content = content.replace(
  `setAudienceId('');`,
  `setAudienceIds([]); setAudienceSelectValue('');`
);

// 5. Update filtering availableOpps, etc.
content = content.replace(
  `let availableOpps = MOCK_OPPORTUNITIES.filter(o => !audienceId || o.audienceId === audienceId);
  let availablePrfs = MOCK_PROFORMAS.filter(p => !audienceId || p.audienceId === audienceId);
  if (oppId) availablePrfs = availablePrfs.filter(p => p.oppId === oppId);

  let availableInvs = MOCK_INVOICES.filter(i => !audienceId || i.audienceId === audienceId);
  if (prfId) availableInvs = availableInvs.filter(i => i.prfId === prfId);`,
  `let availableOpps = MOCK_OPPORTUNITIES.filter(o => audienceIds.length === 0 || audienceIds.includes(o.audienceId));
  let availablePrfs = MOCK_PROFORMAS.filter(p => audienceIds.length === 0 || audienceIds.includes(p.audienceId));
  if (oppId) availablePrfs = availablePrfs.filter(p => p.oppId === oppId);

  let availableInvs = MOCK_INVOICES.filter(i => audienceIds.length === 0 || audienceIds.includes(i.audienceId));
  if (prfId) availableInvs = availableInvs.filter(i => i.prfId === prfId);`
);

// 6. Update Row 4 UI
content = content.replace(
  `          {/* Row 4: Audience */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              انتخاب مخاطب *
            </label>
            <select value={audienceId} onChange={(e) => setAudienceId(e.target.value)} className="w-full md:w-1/2 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 shadow-xs" required>
              <option value="">-- انتخاب کنید --</option>
              {availableAudiences.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>`,
  `          {/* Row 4: Audience */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              انتخاب مخاطبان (سرنخ‌ها و گروه‌های هدف) *
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-start">
              <div className="w-full md:w-1/2 flex items-center gap-2">
                <select
                  value={audienceSelectValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !audienceIds.includes(val)) {
                      setAudienceIds([...audienceIds, val]);
                    }
                    setAudienceSelectValue('');
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:border-blue-500 shadow-xs"
                >
                  <option value="">-- افزودن مخاطب / گروه هدف --</option>
                  <optgroup label="گروه‌های هدف">
                    {availableAudiences.filter(a => a.type === 'group').map(a => (
                      <option key={a.id} value={a.id} disabled={audienceIds.includes(a.id)}>{a.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="سرنخ‌ها">
                    {availableAudiences.filter(a => a.type === 'lead').map(a => (
                      <option key={a.id} value={a.id} disabled={audienceIds.includes(a.id)}>{a.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="flex-1 w-full min-h-[42px] bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-wrap gap-2">
                {audienceIds.length === 0 ? (
                  <span className="text-slate-400 text-xs py-1">مخاطبی انتخاب نشده است...</span>
                ) : (
                  audienceIds.map(id => {
                    const aud = MOCK_AUDIENCES.find(a => a.id === id);
                    return (
                      <div key={id} className="flex items-center gap-1.5 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-xs font-semibold border border-blue-200">
                        {aud?.type === 'group' ? <span className="bg-indigo-600 text-white text-[9px] px-1 py-0.5 rounded">گروه</span> : <span className="bg-emerald-600 text-white text-[9px] px-1 py-0.5 rounded">سرنخ</span>}
                        <span>{aud?.name}</span>
                        <button
                          type="button"
                          onClick={() => setAudienceIds(audienceIds.filter(aid => aid !== id))}
                          className="text-blue-600 hover:text-blue-800 bg-blue-200/50 hover:bg-blue-300 rounded-sm p-0.5"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <input type="hidden" required value={audienceIds.length > 0 ? 'valid' : ''} />
          </div>`
);

content = content.replace(`disabled={!audienceId}`, `disabled={audienceIds.length === 0}`);
content = content.replace(`disabled={!audienceId}`, `disabled={audienceIds.length === 0}`);
content = content.replace(`disabled={!audienceId}`, `disabled={audienceIds.length === 0}`);


fs.writeFileSync('src/components/media/SendSignalView.tsx', content);
