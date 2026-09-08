const fs = require('fs');
let content = fs.readFileSync('src/components/media/SendSignalView.tsx', 'utf-8');

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

fs.writeFileSync('src/components/media/SendSignalView.tsx', content);
