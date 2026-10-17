
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  MoreVertical, 
  Image as ImageIcon, 
  Type, 
  Video, 
  Layers, 
  ChevronDown, 
  GripVertical,
  Settings,
  Eye,
  Palette,
  Share2,
  GitGraph,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Square,
  Circle,
  AlignLeft,
  X,
  FileText,
  User,
  Calculator,
  Variable,
  FunctionSquare,
  Play,
  Calendar,
  Clock as ClockIcon,
  Hourglass,
  Hash,
  Database,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Bell,
  BellRing,
  Smartphone,
  Check,
  AtSign,
  Sparkles,
  ChevronUp,
  Bookmark,
  BookmarkPlus,
  LayoutTemplate,
  Tag,
  Info,
  CheckCheck,
  Sliders,
  Edit3,
  MessageCircle,
  EyeOff,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'motion/react';

type QuestionType = 'short_answer' | 'paragraph' | 'multiple_choice' | 'checkbox' | 'dropdown' | 'calculation' | 'date' | 'time' | 'duration' | 'number' | 'system_form';

export type NotificationChannel = 'sms' | 'email' | 'social';
export type RecipientMode = 'automatic' | 'manual';
export type SocialPlatform = 'bale' | 'eitaa' | 'telegram' | 'whatsapp' | 'rubika';

export interface MessageTemplateItem {
  id: string;
  title: string;
  channel: NotificationChannel;
  subject?: string; // موضوع مخصوص ایمیل
  body: string;
  isCustom?: boolean;
}

export interface NotificationRecipient {
  id: string;
  channel: NotificationChannel;
  mode: RecipientMode; // 'automatic' (مالک کارتابل بعد) | 'manual' (دستی)
  targetRole?: 'next_stage_assignee' | 'form_creator' | 'all_assignees';
  value?: string; // شماره تلفن، آدرس ایمیل، یا نام کاربری در پیام‌رسان
  label?: string; // عنوان یا نام شخص (اختیاری)
  socialPlatform?: SocialPlatform;
  selectedTemplateId?: string;
  emailSubject?: string;
  messageTemplate?: string;
  enabled: boolean;
}

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: Option[];
  formula?: string;
  systemEntity?: string;
  score: number;
  standardTime: number; // In minutes
}

interface Condition {
  id: string;
  fieldId: string;
  operator: '==' | '!=' | '>' | '<' | 'contains' | 'empty' | 'not_empty';
  value: string;
}

interface Route {
  id: string;
  targetSectionId: string;
  conditions: Condition[];
  logicOperator: 'AND' | 'OR';
  notifications?: NotificationRecipient[];
}

interface Transition {
  id: string;
  label: string;
  routes: Route[];
  defaultTargetSectionId: string;
  defaultNotifications?: NotificationRecipient[];
}

interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  assigneeType: 'position' | 'person';
  assigneeValue: string; // This will now store the Position ID
  selectedPeople: string[]; // Added multi-select for people
  selectedDuties: string[]; // Added multi-select for duties
  transitions: Transition[];
}

const ORGANIZATION_DATA = {
  positions: [
    { 
      id: 'pos-1', 
      title: 'مدیر مالی', 
      people: ['علی محمدی', 'سارا رضایی', 'حمید رستمی'], 
      duties: ['تایید نهایی فاکتور', 'کنترل بودجه', 'گزارش فصلی', 'مدیریت نقدینگی'] 
    },
    { 
      id: 'pos-2', 
      title: 'کارشناس فروش', 
      people: ['رضا احمدی', 'مریم قاسمی', 'امیر عباسی'], 
      duties: ['ثبت فاکتور', 'پیگیری مشتری', 'صدور پیش‌فاکتور', 'هماهنگی تحویل'] 
    },
    { 
      id: 'pos-3', 
      title: 'مدیر انبار', 
      people: ['جواد ناصری', 'سعید کریمی'], 
      duties: ['کنترل موجودی', 'تایید خروج کالا', 'ثبت رسید انبار'] 
    },
    { 
      id: 'pos-4', 
      title: 'مدیر عامل', 
      people: ['دکتر سهرابی'], 
      duties: ['تایید نهایی پروژه‌ها', 'امضای قراردادهای کلان'] 
    }
  ]
};

interface FormBuilderViewProps {
  onBack: () => void;
  onSave: (formData: any) => void;
}

export const FormBuilderView: React.FC<FormBuilderViewProps> = ({ onBack, onSave }) => {
  const [formTitle, setFormTitle] = useState('روند بدون عنوان');
  const [formDescription, setFormDescription] = useState('توضیحات روند خود را در اینجا وارد کنید...');
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'sec-1',
      title: 'مرحله آغازین',
      description: '',
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          title: 'سوال بدون عنوان',
          required: false,
          score: 1,
          standardTime: 5,
          options: [{ id: 'opt1', text: 'گزینه ۱' }]
        }
      ],
      assigneeType: 'position',
      assigneeValue: '',
      selectedPeople: [],
      selectedDuties: [],
      transitions: []
    }
  ]);
  const [activeId, setActiveId] = useState<string | null>('q1');
  const [viewMode, setViewMode] = useState<'DESIGN' | 'PREVIEW' | 'FLOWCHART'>('DESIGN');
  const [notificationToast, setNotificationToast] = useState<{ message: string; channel: NotificationChannel } | null>(null);

  // بانک غنی قالب‌های متن برای پیامک، ایمیل و سوشال مدیا
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplateItem[]>([
    {
      id: 'tpl-sms-1',
      title: 'اطلاع‌رسانی عمومی ارجاع کارتابل (پیامک)',
      channel: 'sms',
      body: 'همکار گرامی؛ فرم {عنوان_فرم} جهت بررسی به کارتابل شما در مرحله "{مقصد}" ارجاع شد. کد پیگیری: {کد_پیگیری}'
    },
    {
      id: 'tpl-sms-2',
      title: 'اعلام اولویت فوری و اقدام سریع (پیامک)',
      channel: 'sms',
      body: '⚠️ هشدار فوری: درخواست {کد_پیگیری} ({عنوان_فرم}) نیازمند اقدام فوری در مرحله "{مقصد}" می‌باشد. ارسال‌کننده: {فرستنده}'
    },
    {
      id: 'tpl-sms-3',
      title: 'تایید و ترخیص نهایی پرونده (پیامک)',
      channel: 'sms',
      body: 'پرونده {عنوان_فرم} (کد: {کد_پیگیری}) با تایید کارتابل به مرحله نهایی "{مقصد}" منتقل شد.'
    },
    {
      id: 'tpl-sms-4',
      title: 'یادآوری مهلت و انقضای زمان (پیامک)',
      channel: 'sms',
      body: 'یادآوری: مهلت اقدام پرونده {کد_پیگیری} ({عنوان_فرم}) در مرحله "{مقصد}" رو به اتمام است.'
    },
    {
      id: 'tpl-email-1',
      title: 'نامه اداری ارجاع پرونده (ایمیل)',
      channel: 'email',
      subject: 'ارجاع پرونده {عنوان_فرم} - کد پیگیری {کد_پیگیری}',
      body: 'با سلام و احترام،\nبدین‌وسیله به استحضار می‌رساند پرونده با عنوان "{عنوان_فرم}" و شماره رهگیری {کد_پیگیری} به کارتابل شما در مرحله "{مقصد}" ارسال گردید.\nخواهشمند است در اسرع وقت نسبت به بررسی و ثبت نظر کارشناسی اقدام فرمایید.\nبا تشکر - سامانه مدیریت هوشمند فرآیندها'
    },
    {
      id: 'tpl-email-2',
      title: 'اطلاعیه تایید مدارک و پیشرفت فرآیند (ایمیل)',
      channel: 'email',
      subject: 'تایید مدارک و پیشرفت فرآیند: {عنوان_فرم}',
      body: 'سلام و درود،\nمدارک پرونده {کد_پیگیری} بررسی و به مرحله "{مقصد}" انتقال یافت.\nشما می‌توانید از طریق کارتابل سازمانی جزئیات را مشاهده فرمایید.\nلینک مستقیم اقدام: {لینک_فرم}'
    },
    {
      id: 'tpl-email-3',
      title: 'گزارش سیستمی وضعیت و انتقال مرحله (ایمیل)',
      channel: 'email',
      subject: 'گزارش فرآیند: انتقال موفق فرم {عنوان_فرم} به {مقصد}',
      body: 'اطلاعیه خودکار سیستمی:\nفرم: {عنوان_فرم}\nکد پیگیری: {کد_پیگیری}\nمرحله مقصد: {مقصد}\nگیرنده / متولی: {نام_گیرنده}\nتاریخ و ساعت: {تاریخ_زمان}\nسامانه جامع فرآیندهای سازمانی'
    },
    {
      id: 'tpl-social-1',
      title: 'پیام چت سریع در پیام‌رسان (سوشال)',
      channel: 'social',
      body: '⚡ همکار گرامی، پرونده جدیدی به کارتابل شما افزوده شد:\n📋 فرم: {عنوان_فرم}\n🔑 کد رهگیری: {کد_پیگیری}\n📍 مرحله مقصد: {مقصد}\n👤 ارسال‌کننده: {فرستنده}\n🔗 جهت اقدام: {لینک_فرم}'
    },
    {
      id: 'tpl-social-2',
      title: 'اعلان اقدام فوری در پیام‌رسان (سوشال)',
      channel: 'social',
      body: '🚨 اقدام فوری مورد نیاز است!\nدرخواست {کد_پیگیری} در مرحله "{مقصد}" منتظر تایید جنابعالی است. لطفاً کارتابل خود را بررسی نمایید.'
    },
    {
      id: 'tpl-social-3',
      title: 'تایید و ترخیص رسمی فرآیند (سوشال)',
      channel: 'social',
      body: '✅ تایید رسمی: فرآیند {عنوان_فرم} (کد: {کد_پیگیری}) با موفقیت به مرحله نهایی "{مقصد}" منتقل شد.'
    }
  ]);

  // متغیرهای هوشمند پویا جهت درج با ۱ کلیک در قالب متن
  const DYNAMIC_TAGS = [
    { tag: '{عنوان_فرم}', label: 'عنوان فرم', tip: 'نام فرآیند جاری', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
    { tag: '{کد_پیگیری}', label: 'کد رهگیری', tip: 'کد رهگیری سیستمی', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
    { tag: '{مقصد}', label: 'نام مرحله مقصد', tip: 'کارتابل بعدی', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
    { tag: '{نام_گیرنده}', label: 'نام گیرنده', tip: 'متولی یا شخص مخاطب', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
    { tag: '{سمت_گیرنده}', label: 'سمت مقصد', tip: 'سمت شغلی کارتابل بعد', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' },
    { tag: '{فرستنده}', label: 'ارسال‌کننده', tip: 'کاربر جاری یا ثبت‌کننده', color: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200' },
    { tag: '{تاریخ_زمان}', label: 'تاریخ و ساعت', tip: 'زمان انتقال رویداد', color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100' },
    { tag: '{لینک_فرم}', label: 'لینک اقدام', tip: 'لینک مستقیم به کارتابل', color: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100' },
  ];

  // وضعیت بخش مدیریت و ایجاد قالب‌های کلی در دیو
  const [activeTemplateDrawerKey, setActiveTemplateDrawerKey] = useState<string | null>(null);
  const [templateDrawerTab, setTemplateDrawerTab] = useState<'create' | 'sms' | 'email' | 'social'>('create');
  
  // فرم ایجاد قالب متن جدید در دیو
  const [newTemplateData, setNewTemplateData] = useState<{
    title: string;
    channel: NotificationChannel;
    subject: string;
    body: string;
  }>({
    title: '',
    channel: 'sms',
    subject: '',
    body: ''
  });

  // وضعیت نمایش پیش‌نمایش زنده برای هر گیرنده
  const [expandedPreviewIds, setExpandedPreviewIds] = useState<Record<string, boolean>>({});

  // وضعیت ذخیره مستقیم متن گیرنده به عنوان قالب جدید در سیستم
  const [saveDirectTemplateRecipientId, setSaveDirectTemplateRecipientId] = useState<string | null>(null);
  const [saveDirectTemplateTitle, setSaveDirectTemplateTitle] = useState<string>('');

  const togglePreview = (recipientId: string) => {
    setExpandedPreviewIds(prev => ({
      ...prev,
      [recipientId]: !prev[recipientId]
    }));
  };

  const calculateSmsParts = (text: string | undefined) => {
    const len = (text || '').length;
    if (len === 0) return { chars: 0, parts: 0 };
    if (len <= 70) return { chars: len, parts: 1 };
    return { chars: len, parts: Math.ceil(len / 67) };
  };

  const saveNewMessageTemplate = (title: string, channel: NotificationChannel, body: string, subject?: string) => {
    if (!title.trim() || !body.trim()) return null;
    const newTpl: MessageTemplateItem = {
      id: `tpl-custom-${Date.now()}`,
      title: title.trim(),
      channel,
      subject: subject?.trim(),
      body: body.trim(),
      isCustom: true
    };
    setMessageTemplates(prev => [newTpl, ...prev]);
    return newTpl;
  };

  const deleteMessageTemplate = (tplId: string) => {
    setMessageTemplates(prev => prev.filter(t => t.id !== tplId));
  };

  const addSection = () => {
    const newId = `sec-${Date.now()}`;
    setSections([...sections, {
      id: newId,
      title: 'مرحله جدید',
      description: '',
      questions: [],
      assigneeType: 'position',
      assigneeValue: '',
      selectedPeople: [],
      selectedDuties: [],
      transitions: []
    }]);
    setActiveId(newId);
  };

  const addQuestion = (sectionId: string) => {
    const newId = `q-${Date.now()}`;
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          questions: [...sec.questions, {
            id: newId,
            type: 'multiple_choice',
            title: '',
            required: false,
            score: 1,
            standardTime: 5,
            options: [{ id: `opt-${Date.now()}`, text: 'گزینه ۱' }]
          }]
        };
      }
      return sec;
    }));
    setActiveId(newId);
  };

  const addTransition = (sectionId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: [...sec.transitions, { 
            id: `tr-${Date.now()}`, 
            label: 'ارسال', 
            routes: [],
            defaultTargetSectionId: '' 
          }]
        };
      }
      return sec;
    }));
  };

  const addRoute = (sectionId: string, trId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: [...tr.routes, { 
                  id: `r-${Date.now()}`, 
                  targetSectionId: '', 
                  conditions: [], 
                  logicOperator: 'AND' 
                }]
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const updateRoute = (sectionId: string, trId: string, rId: string, updates: Partial<Route>) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: tr.routes.map(r => r.id === rId ? { ...r, ...updates } : r)
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const removeRoute = (sectionId: string, trId: string, rId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: tr.routes.filter(r => r.id !== rId)
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const addNotificationRecipient = (sectionId: string, trId: string, routeId: string, channel: NotificationChannel) => {
    const defaultTpl = messageTemplates.find(t => t.channel === channel);
    const newRecipient: NotificationRecipient = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      channel,
      mode: 'automatic',
      targetRole: 'next_stage_assignee',
      value: '',
      label: '',
      socialPlatform: channel === 'social' ? 'bale' : undefined,
      selectedTemplateId: defaultTpl ? defaultTpl.id : undefined,
      emailSubject: channel === 'email' ? (defaultTpl?.subject || 'ارجاع پرونده {عنوان_فرم} - کد پیگیری {کد_پیگیری}') : undefined,
      messageTemplate: defaultTpl ? defaultTpl.body : (
        channel === 'sms' 
          ? 'همکار گرامی؛ فرم {عنوان_فرم} جهت بررسی به کارتابل شما در مرحله "{مقصد}" ارجاع شد. کد پیگیری: {کد_پیگیری}'
          : channel === 'email'
            ? 'با سلام و احترام،\nبدین‌وسیله به استحضار می‌رساند پرونده با عنوان "{عنوان_فرم}" و شماره رهگیری {کد_پیگیری} به کارتابل شما در مرحله "{مقصد}" ارسال گردید.'
            : '⚡ همکار گرامی، پرونده جدیدی به کارتابل شما افزوده شد:\n📋 فرم: {عنوان_فرم}\n🔑 کد رهگیری: {کد_پیگیری}\n📍 مرحله مقصد: {مقصد}'
      ),
      enabled: true
    };

    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: tr.routes.map(r => {
                  if (r.id === routeId) {
                    return {
                      ...r,
                      notifications: [...(r.notifications || []), newRecipient]
                    };
                  }
                  return r;
                })
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const updateNotificationRecipient = (
    sectionId: string, 
    trId: string, 
    routeId: string, 
    recipientId: string, 
    updates: Partial<NotificationRecipient>
  ) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: tr.routes.map(r => {
                  if (r.id === routeId) {
                    return {
                      ...r,
                      notifications: (r.notifications || []).map(n => n.id === recipientId ? { ...n, ...updates } : n)
                    };
                  }
                  return r;
                })
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const removeNotificationRecipient = (sectionId: string, trId: string, routeId: string, recipientId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: tr.routes.map(r => {
                  if (r.id === routeId) {
                    return {
                      ...r,
                      notifications: (r.notifications || []).filter(n => n.id !== recipientId)
                    };
                  }
                  return r;
                })
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const addDefaultNotificationRecipient = (sectionId: string, trId: string, channel: NotificationChannel) => {
    const defaultTpl = messageTemplates.find(t => t.channel === channel);
    const newRecipient: NotificationRecipient = {
      id: `def-notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      channel,
      mode: 'automatic',
      targetRole: 'next_stage_assignee',
      value: '',
      label: '',
      socialPlatform: channel === 'social' ? 'bale' : undefined,
      selectedTemplateId: defaultTpl ? defaultTpl.id : undefined,
      emailSubject: channel === 'email' ? (defaultTpl?.subject || 'ارجاع پرونده {عنوان_فرم} - کد پیگیری {کد_پیگیری}') : undefined,
      messageTemplate: defaultTpl ? defaultTpl.body : (
        channel === 'sms' 
          ? 'همکار گرامی؛ فرم {عنوان_فرم} جهت بررسی به کارتابل شما در مرحله "{مقصد}" ارجاع شد. کد پیگیری: {کد_پیگیری}'
          : channel === 'email'
            ? 'با سلام و احترام،\nبدین‌وسیله به استحضار می‌رساند پرونده با عنوان "{عنوان_فرم}" و شماره رهگیری {کد_پیگیری} به کارتابل شما در مرحله "{مقصد}" ارسال گردید.'
            : '⚡ همکار گرامی، پرونده جدیدی به کارتابل شما افزوده شد:\n📋 فرم: {عنوان_فرم}\n🔑 کد رهگیری: {کد_پیگیری}\n📍 مرحله مقصد: {مقصد}'
      ),
      enabled: true
    };

    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                defaultNotifications: [...(tr.defaultNotifications || []), newRecipient]
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const updateDefaultNotificationRecipient = (
    sectionId: string, 
    trId: string, 
    recipientId: string, 
    updates: Partial<NotificationRecipient>
  ) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                defaultNotifications: (tr.defaultNotifications || []).map(n => n.id === recipientId ? { ...n, ...updates } : n)
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const removeDefaultNotificationRecipient = (sectionId: string, trId: string, recipientId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                defaultNotifications: (tr.defaultNotifications || []).filter(n => n.id !== recipientId)
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const getTargetSectionAssigneesInfo = (targetSectionId: string) => {
    if (!targetSectionId || targetSectionId === 'end') {
      return { title: 'پایان روند', people: [], positionTitle: 'اتمام فرآیند' };
    }
    const targetSec = sections.find(s => s.id === targetSectionId);
    if (!targetSec) return { title: 'نامشخص', people: [], positionTitle: '' };

    const pos = ORGANIZATION_DATA.positions.find(p => p.id === targetSec.assigneeValue);
    const people = targetSec.selectedPeople && targetSec.selectedPeople.length > 0 
      ? targetSec.selectedPeople 
      : (pos ? pos.people : []);
      
    return {
      title: targetSec.title || 'بدون عنوان',
      positionTitle: pos?.title || '',
      people: people
    };
  };

  const resolveTemplatePreview = (
    template: string | undefined,
    notif: NotificationRecipient,
    targetSectionId: string
  ) => {
    if (!template) return '';
    const targetInfo = getTargetSectionAssigneesInfo(targetSectionId);
    const now = new Date();
    const dateStr = now.toLocaleDateString('fa-IR');
    const recipientName = notif.mode === 'automatic'
      ? (targetInfo.people.length > 0 ? targetInfo.people.join('، ') : 'مالک کارتابل بعد')
      : (notif.label || notif.value || 'گیرنده');

    return template
      .replace(/\{عنوان_فرم\}/g, formTitle || 'فرم فرآیند سازمانی')
      .replace(/\{کد_پیگیری\}/g, 'TRK-98421')
      .replace(/\{مقصد\}/g, targetInfo.title || 'کارتابل بعدی')
      .replace(/\{فرستنده\}/g, 'کارشناس واحد')
      .replace(/\{نام_گیرنده\}/g, recipientName)
      .replace(/\{سمت_گیرنده\}/g, targetInfo.positionTitle || 'سمت سازمانی')
      .replace(/\{تاریخ_زمان\}/g, dateStr)
      .replace(/\{لینک_فرم\}/g, 'https://system.company.ir/workflow/task/TRK-98421');
  };

  const handleInsertTag = (
    sectionId: string,
    trId: string,
    routeId: string | undefined,
    recipientId: string,
    tag: string,
    targetField: 'body' | 'subject'
  ) => {
    if (routeId) {
      setSections(sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            transitions: sec.transitions.map(tr => {
              if (tr.id === trId) {
                return {
                  ...tr,
                  routes: tr.routes.map(r => {
                    if (r.id === routeId) {
                      return {
                        ...r,
                        notifications: (r.notifications || []).map(n => {
                          if (n.id === recipientId) {
                            if (targetField === 'subject') {
                              const cur = n.emailSubject || '';
                              return { ...n, emailSubject: cur ? `${cur} ${tag}` : tag };
                            } else {
                              const cur = n.messageTemplate || '';
                              return { ...n, messageTemplate: cur ? `${cur} ${tag}` : tag };
                            }
                          }
                          return n;
                        })
                      };
                    }
                    return r;
                  })
                };
              }
              return tr;
            })
          };
        }
        return sec;
      }));
    } else {
      setSections(sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            transitions: sec.transitions.map(tr => {
              if (tr.id === trId) {
                return {
                  ...tr,
                  defaultNotifications: (tr.defaultNotifications || []).map(n => {
                    if (n.id === recipientId) {
                      if (targetField === 'subject') {
                        const cur = n.emailSubject || '';
                        return { ...n, emailSubject: cur ? `${cur} ${tag}` : tag };
                      } else {
                        const cur = n.messageTemplate || '';
                        return { ...n, messageTemplate: cur ? `${cur} ${tag}` : tag };
                      }
                    }
                    return n;
                  })
                };
              }
              return tr;
            })
          };
        }
        return sec;
      }));
    }
  };

  const applyTemplateToRecipient = (
    sectionId: string,
    trId: string,
    routeId: string | undefined,
    recipientId: string,
    templateId: string
  ) => {
    const tpl = messageTemplates.find(t => t.id === templateId);
    if (!tpl) return;
    const updates: Partial<NotificationRecipient> = {
      selectedTemplateId: templateId,
      messageTemplate: tpl.body,
      ...(tpl.subject ? { emailSubject: tpl.subject } : {})
    };
    if (routeId) {
      updateNotificationRecipient(sectionId, trId, routeId, recipientId, updates);
    } else {
      updateDefaultNotificationRecipient(sectionId, trId, recipientId, updates);
    }
  };

  const triggerTestNotification = (recipient: NotificationRecipient, targetSectionTitle: string, targetSectionId?: string) => {
    const targetLabel = recipient.mode === 'automatic' 
      ? 'مالک خودکار کارتابل مقصد' 
      : (recipient.value ? `${recipient.label ? recipient.label + ': ' : ''}${recipient.value}` : 'شماره/اکانت ثبت‌شده');
    const channelTitle = recipient.channel === 'sms' 
      ? 'پیامک (SMS)' 
      : recipient.channel === 'email' 
        ? 'ایمیل (Email)' 
        : `پیام در پیام‌رسان ${recipient.socialPlatform === 'bale' ? 'بله' : recipient.socialPlatform === 'eitaa' ? 'ایتا' : recipient.socialPlatform === 'telegram' ? 'تلگرام' : recipient.socialPlatform === 'whatsapp' ? 'واتساپ' : 'روبیکا'}`;
    
    const previewText = resolveTemplatePreview(recipient.messageTemplate, recipient, targetSectionId || '');
    const previewSubject = recipient.channel === 'email' && recipient.emailSubject 
      ? ` [موضوع: ${resolveTemplatePreview(recipient.emailSubject, recipient, targetSectionId || '')}]` 
      : '';
    
    setNotificationToast({
      message: `تست موفق: ارسال ${channelTitle} به مقصد "${targetSectionTitle}" برای [${targetLabel}] شبیه‌سازی شد.${previewSubject}\nمتن پیام: "${previewText.slice(0, 80)}${previewText.length > 80 ? '...' : ''}"`,
      channel: recipient.channel
    });
    setTimeout(() => setNotificationToast(null), 5500);
  };

  const addCondition = (sectionId: string, trId: string, rId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: tr.routes.map(r => {
                  if (r.id === rId) {
                    return {
                      ...r,
                      conditions: [...r.conditions, { id: `c-${Date.now()}`, fieldId: '', operator: '==', value: '' }]
                    };
                  }
                  return r;
                })
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const updateCondition = (sectionId: string, trId: string, rId: string, cId: string, updates: Partial<Condition>) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: tr.routes.map(r => {
                  if (r.id === rId) {
                    return {
                      ...r,
                      conditions: r.conditions.map(c => c.id === cId ? { ...c, ...updates } : c)
                    };
                  }
                  return r;
                })
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const removeCondition = (sectionId: string, trId: string, rId: string, cId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => {
            if (tr.id === trId) {
              return {
                ...tr,
                routes: tr.routes.map(r => {
                  if (r.id === rId) {
                    return {
                      ...r,
                      conditions: r.conditions.filter(c => c.id !== cId)
                    };
                  }
                  return r;
                })
              };
            }
            return tr;
          })
        };
      }
      return sec;
    }));
  };

  const updateTransition = (sectionId: string, trId: string, updates: Partial<Transition>) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.map(tr => tr.id === trId ? { ...tr, ...updates } : tr)
        };
      }
      return sec;
    }));
  };

  const removeTransition = (sectionId: string, trId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          transitions: sec.transitions.filter(tr => tr.id !== trId)
        };
      }
      return sec;
    }));
  };

  const deleteQuestion = (sectionId: string, qId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          questions: sec.questions.filter(q => q.id !== qId)
        };
      }
      return sec;
    }));
  };

  const updateQuestion = (sectionId: string, qId: string, updates: Partial<Question>) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          questions: sec.questions.map(q => q.id === qId ? { ...q, ...updates } : q)
        };
      }
      return sec;
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(sec => sec.id === sectionId ? { ...sec, ...updates } : sec));
  };

  const duplicateQuestion = (sectionId: string, qId: string) => {
    const section = sections.find(sec => sec.id === sectionId);
    if (!section) return;
    const question = section.questions.find(q => q.id === qId);
    if (!question) return;
    
    const newId = `q-${Date.now()}`;
    const newQuestion = { ...question, id: newId };
    
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        const index = sec.questions.findIndex(q => q.id === qId);
        const newQuestions = [...sec.questions];
        newQuestions.splice(index + 1, 0, newQuestion);
        return { ...sec, questions: newQuestions };
      }
      return sec;
    }));
    setActiveId(newId);
  };

  const addOption = (sectionId: string, qId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          questions: sec.questions.map(q => {
            if (q.id === qId && q.options) {
              return {
                ...q,
                options: [...q.options, { id: `opt-${Date.now()}`, text: `گزینه ${q.options.length + 1}` }]
              };
            }
            return q;
          })
        };
      }
      return sec;
    }));
  };

  const updateOption = (sectionId: string, qId: string, optId: string, text: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          questions: sec.questions.map(q => {
            if (q.id === qId && q.options) {
              return {
                ...q,
                options: q.options.map(opt => opt.id === optId ? { ...opt, text } : opt)
              };
            }
            return q;
          })
        };
      }
      return sec;
    }));
  };

  const removeOption = (sectionId: string, qId: string, optId: string) => {
    setSections(sections.map(sec => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          questions: sec.questions.map(q => {
            if (q.id === qId && q.options && q.options.length > 1) {
              return {
                ...q,
                options: q.options.filter(opt => opt.id !== optId)
              };
            }
            return q;
          })
        };
      }
      return sec;
    }));
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'short_answer': return <Type className="w-4 h-4" />;
      case 'paragraph': return <AlignLeft className="w-4 h-4" />;
      case 'multiple_choice': return <Circle className="w-4 h-4" />;
      case 'checkbox': return <Square className="w-4 h-4" />;
      case 'dropdown': return <ChevronDown className="w-4 h-4" />;
      case 'calculation': return <Calculator className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'time': return <ClockIcon className="w-4 h-4" />;
      case 'duration': return <Hourglass className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'system_form': return <Database className="w-4 h-4" />;
    }
  };

  const getAllFields = () => {
    const fields: { id: string; title: string; sectionTitle: string }[] = [];
    sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (q.title) {
          fields.push({ id: q.id, title: q.title, sectionTitle: sec.title });
        }
      });
    });
    return fields;
  };

  const renderNotificationPanel = (
    targetSectionId: string,
    notifications: NotificationRecipient[] | undefined,
    drawerKey: string,
    onAddRecipient: (channel: NotificationChannel) => void,
    onUpdateRecipient: (recipientId: string, updates: Partial<NotificationRecipient>) => void,
    onRemoveRecipient: (recipientId: string) => void,
    onInsertTagToRecipient: (recipientId: string, tag: string, targetField: 'body' | 'subject') => void,
    onApplyTemplateToRecipient: (recipientId: string, templateId: string) => void,
    titleText: string,
    subtitleText: string
  ) => {
    const isDrawerOpen = activeTemplateDrawerKey === drawerKey;
    const targetInfo = getTargetSectionAssigneesInfo(targetSectionId);
    const smsCount = messageTemplates.filter(t => t.channel === 'sms').length;
    const emailCount = messageTemplates.filter(t => t.channel === 'email').length;
    const socialCount = messageTemplates.filter(t => t.channel === 'social').length;

    return (
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2.5 bg-gradient-to-br from-slate-50 to-blue-50/20 p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BellRing className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-800 flex items-center gap-1.5 flex-wrap">
                <span>{titleText}</span>
                {notifications && notifications.length > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {notifications.length} گیرنده فعال
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                {subtitleText}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onAddRecipient('sms')}
              className="px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all shadow-2xs hover:scale-102 active:scale-98 cursor-pointer"
              title="افزودن شماره تماس جهت ارسال پیامک"
            >
              <Smartphone className="w-3 h-3 text-blue-600" />
              <span>+ پیامک</span>
            </button>
            <button
              type="button"
              onClick={() => onAddRecipient('email')}
              className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all shadow-2xs hover:scale-102 active:scale-98 cursor-pointer"
              title="افزودن آدرس ایمیل"
            >
              <Mail className="w-3 h-3 text-emerald-600" />
              <span>+ ایمیل</span>
            </button>
            <button
              type="button"
              onClick={() => onAddRecipient('social')}
              className="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all shadow-2xs hover:scale-102 active:scale-98 cursor-pointer"
              title="افزودن اکانت سوشال مدیا (بله، ایتا، تلگرام، واتساپ، روبیکا)"
            >
              <MessageSquare className="w-3 h-3 text-purple-600" />
              <span>+ سوشال مدیا</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTemplateDrawerKey(isDrawerOpen ? null : drawerKey)}
              className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all border cursor-pointer ${
                isDrawerOpen
                  ? 'bg-slate-800 text-white border-slate-700 shadow-md'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-amber-300 hover:bg-amber-100 shadow-2xs'
              }`}
              title="مدیریت و ساخت قالب متن جدید"
            >
              <LayoutTemplate className="w-3 h-3 text-amber-600" />
              <span>{isDrawerOpen ? 'بستن مدیریت قالب‌ها' : '🛠️ ساخت و مدیریت قالب‌ها'}</span>
            </button>
          </div>
        </div>

        {/* بازشونده ساخت و مدیریت قالب‌های متن در همین دیو */}
        {isDrawerOpen && (
          <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-700 shadow-xl flex flex-col gap-3 my-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-amber-300">بانک و کارگاه ساخت قالب‌های متن پیام (SMS، ایمیل، سوشال)</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setTemplateDrawerTab('create')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    templateDrawerTab === 'create' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  + ایجاد قالب جدید
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateDrawerTab('sms')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    templateDrawerTab === 'sms' ? 'bg-blue-600 text-white font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  پیامک ({smsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateDrawerTab('email')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    templateDrawerTab === 'email' ? 'bg-emerald-600 text-white font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ایمیل ({emailCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateDrawerTab('social')}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    templateDrawerTab === 'social' ? 'bg-purple-600 text-white font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  سوشال ({socialCount})
                </button>
              </div>
            </div>

            {/* محتوای تب ساخت قالب جدید */}
            {templateDrawerTab === 'create' ? (
              <div className="flex flex-col gap-2.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">کانال ارسال:</label>
                    <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setNewTemplateData(prev => ({ ...prev, channel: 'sms' }))}
                        className={`flex-1 py-1 rounded text-center cursor-pointer ${
                          newTemplateData.channel === 'sms' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        📱 پیامک
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTemplateData(prev => ({ ...prev, channel: 'email' }))}
                        className={`flex-1 py-1 rounded text-center cursor-pointer ${
                          newTemplateData.channel === 'email' ? 'bg-emerald-600 text-white font-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        📧 ایمیل
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTemplateData(prev => ({ ...prev, channel: 'social' }))}
                        className={`flex-1 py-1 rounded text-center cursor-pointer ${
                          newTemplateData.channel === 'social' ? 'bg-purple-600 text-white font-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        💬 سوشال
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">عنوان قالب جدید:</label>
                    <input
                      type="text"
                      value={newTemplateData.title}
                      onChange={(e) => setNewTemplateData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="مثال: اعلان ارجاع پرونده مالی به مدیرعامل..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-bold outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                {newTemplateData.channel === 'email' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold text-emerald-400">موضوع ایمیل (Subject):</label>
                      <span className="text-[9px] text-slate-400">متغیرها در موضوع نیز جایگذاری می‌شوند</span>
                    </div>
                    <input
                      type="text"
                      value={newTemplateData.subject}
                      onChange={(e) => setNewTemplateData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="مثال: ارجاع پرونده {عنوان_فرم} با کد رهگیری {کد_پیگیری}"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-hidden focus:border-emerald-400"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-slate-400">متن بدنه قالب:</label>
                    {newTemplateData.channel === 'sms' && (
                      <span className="text-[9px] text-blue-400 font-mono">
                        {calculateSmsParts(newTemplateData.body).chars} کاراکتر | {calculateSmsParts(newTemplateData.body).parts} پیامک فارسی
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={newTemplateData.body}
                    onChange={(e) => setNewTemplateData(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="متن قالب را بنویسید یا از تگ‌های هوشمند زیر استفاده فرمایید..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 leading-relaxed outline-hidden focus:border-amber-400"
                  />
                </div>

                {/* نوار متغیرهای پویا */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-amber-300">درج سریع متغیرهای فرآیند در متن:</span>
                  <div className="flex flex-wrap gap-1">
                    {DYNAMIC_TAGS.map(t => (
                      <button
                        key={t.tag}
                        type="button"
                        onClick={() => setNewTemplateData(prev => ({ ...prev, body: (prev.body ? prev.body + ' ' : '') + t.tag }))}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[9px] font-mono font-bold text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                        title={t.tip}
                      >
                        <Tag className="w-2.5 h-2.5 text-amber-400" />
                        <span>{t.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* دکمه ذخیره */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTemplateData.title.trim() || !newTemplateData.body.trim()) {
                        setNotificationToast({
                          message: 'لطفاً عنوان و متن قالب را تکمیل فرمایید.',
                          channel: newTemplateData.channel
                        });
                        setTimeout(() => setNotificationToast(null), 3000);
                        return;
                      }
                      const saved = saveNewMessageTemplate(
                        newTemplateData.title,
                        newTemplateData.channel,
                        newTemplateData.body,
                        newTemplateData.channel === 'email' ? newTemplateData.subject : undefined
                      );
                      if (saved) {
                        setNotificationToast({
                          message: `قالب "${newTemplateData.title}" با موفقیت ذخیره شد و در لیست قالب‌های آماده در دسترس است.`,
                          channel: newTemplateData.channel
                        });
                        setTimeout(() => setNotificationToast(null), 4000);
                        setNewTemplateData({ title: '', channel: 'sms', subject: '', body: '' });
                        setTemplateDrawerTab(saved.channel);
                      }
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-lg text-xs font-black hover:brightness-110 flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>ثبت قالب جدید در سیستم</span>
                  </button>
                </div>
              </div>
            ) : (
              /* لیست قالب‌های موجود بر اساس کانال انتخابی */
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {messageTemplates.filter(t => t.channel === templateDrawerTab).map(tpl => (
                  <div key={tpl.id} className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-1.5 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">{tpl.title}</span>
                        {tpl.isCustom && (
                          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold px-1.5 py-0.2 rounded">
                            سفارشی
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {tpl.isCustom && (
                          <button
                            type="button"
                            onClick={() => deleteMessageTemplate(tpl.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="حذف این قالب سفارشی"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    {tpl.subject && (
                      <div className="text-[10px] text-emerald-400 font-bold">
                        موضوع: {tpl.subject}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-300 leading-relaxed font-sans whitespace-pre-line bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                      {tpl.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* فهرست گیرندگان */}
        {(!notifications || notifications.length === 0) ? (
          <div className="py-2.5 px-3 bg-white/80 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 text-[10px] font-bold flex items-center justify-center gap-2">
            <Bell className="w-3.5 h-3.5 text-slate-300" />
            <span>هنوز گیرنده‌ای تعریف نشده است. با دکمه‌های بالا می‌توانید نامحدود شماره تماس، ایمیل یا اکانت پیام‌رسان (اتوماتیک یا دستی) به همراه قالب متن اختصاصی تنظیم کنید.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {notifications.map((notif) => {
              const channelTemplates = messageTemplates.filter(t => t.channel === notif.channel);
              const isPreviewOpen = !!expandedPreviewIds[notif.id];
              const isDirectSaveOpen = saveDirectTemplateRecipientId === notif.id;
              const smsStats = calculateSmsParts(notif.messageTemplate);

              return (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded-xl border transition-all ${
                    notif.enabled 
                      ? 'bg-white border-slate-200/90 shadow-2xs' 
                      : 'bg-slate-100/70 border-slate-200 opacity-60'
                  }`}
                >
                  {/* سطر هدر هر کارت گیرنده */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 ${
                        notif.channel === 'sms' 
                          ? 'bg-blue-100 text-blue-700' 
                          : notif.channel === 'email' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-purple-100 text-purple-700'
                      }`}>
                        {notif.channel === 'sms' ? <Smartphone className="w-3.5 h-3.5" /> : notif.channel === 'email' ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                      </div>

                      <select
                        value={notif.channel}
                        onChange={(e) => {
                          const nextChannel = e.target.value as NotificationChannel;
                          const nextDefaultTpl = messageTemplates.find(t => t.channel === nextChannel);
                          onUpdateRecipient(notif.id, { 
                            channel: nextChannel,
                            socialPlatform: nextChannel === 'social' ? (notif.socialPlatform || 'bale') : undefined,
                            selectedTemplateId: nextDefaultTpl?.id,
                            emailSubject: nextChannel === 'email' ? (nextDefaultTpl?.subject || 'ارجاع پرونده {عنوان_فرم} - کد پیگیری {کد_پیگیری}') : undefined,
                            messageTemplate: nextDefaultTpl ? nextDefaultTpl.body : notif.messageTemplate
                          });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-black outline-hidden"
                      >
                        <option value="sms">📱 پیامک (SMS)</option>
                        <option value="email">📧 ایمیل (Email)</option>
                        <option value="social">💬 سوشال مدیا / پیام‌رسان</option>
                      </select>

                      {notif.channel === 'social' && (
                        <select
                          value={notif.socialPlatform || 'bale'}
                          onChange={(e) => onUpdateRecipient(notif.id, { 
                            socialPlatform: e.target.value as SocialPlatform 
                          })}
                          className="bg-purple-50 text-purple-900 border border-purple-200 rounded-lg px-2 py-1 text-[10px] font-black outline-hidden"
                        >
                          <option value="bale">پیام‌رسان بله (Bale)</option>
                          <option value="eitaa">پیام‌رسان ایتا (Eitaa)</option>
                          <option value="telegram">تلگرام (Telegram)</option>
                          <option value="whatsapp">واتساپ (WhatsApp)</option>
                          <option value="rubika">روبیکا (Rubika)</option>
                        </select>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[9px] font-black">
                        <button
                          type="button"
                          onClick={() => onUpdateRecipient(notif.id, { mode: 'automatic' })}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            notif.mode === 'automatic'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          🤖 اتوماتیک (مالک کارتابل بعد)
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateRecipient(notif.id, { mode: 'manual' })}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            notif.mode === 'manual'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          ✍️ دستی (شماره / ایمیل / اکانت)
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onUpdateRecipient(notif.id, { enabled: !notif.enabled })}
                        className={`p-1 rounded-md border text-[9px] font-bold cursor-pointer transition-colors ${
                          notif.enabled 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-200 text-slate-500 border-slate-300'
                        }`}
                        title={notif.enabled ? "اعلان فعال است" : "اعلان غیرفعال است"}
                      >
                        <Check className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerTestNotification(notif, targetInfo.title, targetSectionId)}
                        className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all hover:scale-102"
                        title="تست ارسال پیام با داده‌های واقعی"
                      >
                        <Send className="w-2.5 h-2.5 text-blue-500" />
                        <span>تست</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveRecipient(notif.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        title="حذف این گیرنده"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* بدنه اطلاعات تماس گیرنده (اتوماتیک یا دستی) */}
                  <div className="pt-2">
                    {notif.mode === 'automatic' ? (
                      <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-2.5 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[10px] flex-wrap gap-1">
                          <span className="font-black text-blue-900 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            استخراج هوشمند گیرنده از کارتابل مقصد:
                          </span>
                          <select
                            value={notif.targetRole || 'next_stage_assignee'}
                            onChange={(e) => onUpdateRecipient(notif.id, { 
                              targetRole: e.target.value as any 
                            })}
                            className="bg-white border border-blue-200 rounded px-2 py-0.5 text-[9px] font-bold text-blue-800 outline-hidden"
                          >
                            <option value="next_stage_assignee">مالک / متولیان کارتابل مقصد (Next Assignee)</option>
                            <option value="all_assignees">کلیه کاربران سمت شغلی مقصد</option>
                            <option value="form_creator">ایجادکننده اولیه فرم (ثبت‌کننده)</option>
                          </select>
                        </div>

                        <div className="text-[10px] text-slate-600 flex items-center gap-1 flex-wrap">
                          <span className="font-bold text-slate-400">شناسایی متولیان مقصد:</span>
                          <span className="font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-100">
                            {targetInfo.people.length > 0 
                              ? `${targetInfo.people.join('، ')} (${targetInfo.positionTitle || 'سمت سازمانی'})` 
                              : (targetSectionId === 'end' 
                                  ? 'پایان روند (ارسال به ایجادکننده)' 
                                  : 'پس از انتخاب مقصد، مشخصات تماس افراد متولی کارتابل خودکار فراخوانی می‌شوند')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 block mb-1">
                            {notif.channel === 'sms' 
                              ? 'شماره موبایل گیرنده (پیامک):' 
                              : notif.channel === 'email' 
                                ? 'آدرس ایمیل گیرنده:' 
                                : `شناسه یا شماره در ${notif.socialPlatform === 'bale' ? 'بله' : notif.socialPlatform === 'eitaa' ? 'ایتا' : notif.socialPlatform === 'telegram' ? 'تلگرام' : notif.socialPlatform === 'whatsapp' ? 'واتساپ' : 'روبیکا'}:`}
                          </label>
                          <input
                            type={notif.channel === 'email' ? 'email' : 'text'}
                            dir={notif.channel === 'email' ? 'ltr' : 'rtl'}
                            value={notif.value || ''}
                            onChange={(e) => onUpdateRecipient(notif.id, { value: e.target.value })}
                            placeholder={
                              notif.channel === 'sms' 
                                ? 'مثال: 09121234567' 
                                : notif.channel === 'email' 
                                  ? 'مثال: user@company.ir' 
                                  : 'مثال: @username یا شماره تماس'
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-hidden focus:bg-white focus:border-blue-300 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] font-black text-slate-400 block mb-1">نام یا عنوان شخص (اختیاری):</label>
                          <input
                            type="text"
                            value={notif.label || ''}
                            onChange={(e) => onUpdateRecipient(notif.id, { label: e.target.value })}
                            placeholder="مثال: مدیر فنی، ناظر پروژه..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-hidden focus:bg-white focus:border-blue-300"
                          />
                        </div>
                      </div>
                    )}

                    {/* بخش حرفه‌ای ساخت و تنظیم قالب متن پیام */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[10px] font-black text-slate-700">
                            قالب متن پیام ({notif.channel === 'sms' ? 'پیامک' : notif.channel === 'email' ? 'ایمیل' : 'سوشال مدیا'}):
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* انتخاب از بین قالب‌های آماده */}
                          <select
                            value={notif.selectedTemplateId || ''}
                            onChange={(e) => onApplyTemplateToRecipient(notif.id, e.target.value)}
                            className="bg-amber-50/70 border border-amber-200 text-amber-900 rounded-lg px-2 py-0.5 text-[9px] font-bold outline-hidden cursor-pointer"
                          >
                            <option value="">انتخاب از قالب‌های آماده...</option>
                            {channelTemplates.map(tpl => (
                              <option key={tpl.id} value={tpl.id}>
                                {tpl.isCustom ? '⭐ ' : ''}{tpl.title}
                              </option>
                            ))}
                          </select>

                          {/* دکمه ذخیره این متن به عنوان قالب جدید */}
                          <button
                            type="button"
                            onClick={() => {
                              if (isDirectSaveOpen) {
                                setSaveDirectTemplateRecipientId(null);
                              } else {
                                setSaveDirectTemplateRecipientId(notif.id);
                                setSaveDirectTemplateTitle('');
                              }
                            }}
                            className="px-2 py-0.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            title="ذخیره این متن به عنوان قالب جدید در سیستم"
                          >
                            <BookmarkPlus className="w-2.5 h-2.5 text-amber-600" />
                            <span>{isDirectSaveOpen ? 'بستن' : '+ ذخیره به عنوان قالب'}</span>
                          </button>

                          {/* کلید مشاهده پیش‌نمایش زنده */}
                          <button
                            type="button"
                            onClick={() => togglePreview(notif.id)}
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors border ${
                              isPreviewOpen
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <Eye className="w-2.5 h-2.5" />
                            <span>{isPreviewOpen ? 'مخفی کردن پیش‌نمایش' : 'پیش‌نمایش زنده'}</span>
                          </button>
                        </div>
                      </div>

                      {/* فرم ثبت نام برای ذخیره قالب جدید */}
                      {isDirectSaveOpen && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center gap-2 animate-in fade-in duration-100">
                          <span className="text-[9px] font-black text-amber-900 shrink-0">عنوان قالب جدید:</span>
                          <input
                            type="text"
                            value={saveDirectTemplateTitle}
                            onChange={(e) => setSaveDirectTemplateTitle(e.target.value)}
                            placeholder="مثال: اعلان ارجاع به امور مشتریان..."
                            className="flex-1 bg-white border border-amber-300 rounded px-2 py-1 text-xs text-slate-800 outline-hidden font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!saveDirectTemplateTitle.trim()) {
                                setNotificationToast({
                                  message: 'لطفاً نامی برای قالب جدید وارد نمایید.',
                                  channel: notif.channel
                                });
                                setTimeout(() => setNotificationToast(null), 3000);
                                return;
                              }
                              const saved = saveNewMessageTemplate(
                                saveDirectTemplateTitle,
                                notif.channel,
                                notif.messageTemplate || '',
                                notif.channel === 'email' ? notif.emailSubject : undefined
                              );
                              if (saved) {
                                onUpdateRecipient(notif.id, { selectedTemplateId: saved.id });
                                setNotificationToast({
                                  message: `قالب "${saveDirectTemplateTitle}" در سیستم ذخیره شد.`,
                                  channel: notif.channel
                                });
                                setTimeout(() => setNotificationToast(null), 4000);
                                setSaveDirectTemplateRecipientId(null);
                                setSaveDirectTemplateTitle('');
                              }
                            }}
                            className="px-2.5 py-1 bg-amber-600 text-white rounded text-[10px] font-black hover:bg-amber-700 cursor-pointer"
                          >
                            ثبت در بانک قالب‌ها
                          </button>
                        </div>
                      )}

                      {/* موضوع ایمیل در صورت انتخاب کانال Email */}
                      {notif.channel === 'email' && (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-slate-500">موضوع ایمیل (Subject):</span>
                            <span className="text-[9px] text-emerald-600 font-bold">متغیرها در موضوع هم اعمال می‌شوند</span>
                          </div>
                          <input
                            type="text"
                            value={notif.emailSubject || ''}
                            onChange={(e) => onUpdateRecipient(notif.id, { emailSubject: e.target.value })}
                            placeholder="مثال: ارجاع پرونده {عنوان_فرم} - کد پیگیری {کد_پیگیری}"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-bold outline-hidden focus:bg-white focus:border-emerald-300"
                          />
                        </div>
                      )}

                      {/* ادیتور چندخطی متن پیام */}
                      <div className="flex flex-col gap-1">
                        <textarea
                          rows={2}
                          value={notif.messageTemplate || ''}
                          onChange={(e) => onUpdateRecipient(notif.id, { messageTemplate: e.target.value })}
                          placeholder="متن پیام را وارد کنید یا با کلیک روی متغیرهای زیر آن را شخصی‌سازی کنید..."
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-bold outline-hidden focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed"
                        />
                      </div>

                      {/* نوار متغیرهای هوشمند پویا با کلیک جهت درج */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5 text-blue-500" />
                            متغیرهای هوشمند پویا (با کلیک در متن درج می‌شوند):
                          </span>
                          {notif.channel === 'sms' && (
                            <span className={`text-[9px] font-mono font-bold ${smsStats.parts > 1 ? 'text-amber-600' : 'text-slate-500'}`}>
                              📊 {smsStats.chars} کاراکتر | {smsStats.parts} پیامک فارسی
                            </span>
                          )}
                          {notif.channel === 'email' && (
                            <span className="text-[9px] text-emerald-600 font-bold">
                              ✉️ قالب HTML رسمی به صورت خودکار اعمال می‌شود
                            </span>
                          )}
                          {notif.channel === 'social' && (
                            <span className="text-[9px] text-purple-600 font-bold">
                              💬 ارسال به {notif.socialPlatform === 'bale' ? 'بله' : notif.socialPlatform === 'eitaa' ? 'ایتا' : notif.socialPlatform === 'telegram' ? 'تلگرام' : notif.socialPlatform === 'whatsapp' ? 'واتساپ' : 'روبیکا'}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {DYNAMIC_TAGS.map(t => (
                            <button
                              key={t.tag}
                              type="button"
                              onClick={() => onInsertTagToRecipient(notif.id, t.tag, 'body')}
                              className={`px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold transition-all cursor-pointer ${t.color}`}
                              title={`کلیک برای درج ${t.tag} در متن پیام`}
                            >
                              + {t.tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* پیش‌نمایش زنده خروجی نهایی پیام */}
                      {isPreviewOpen && (
                        <div className="mt-1 bg-slate-900 text-white rounded-xl p-3 border border-slate-700 shadow-md flex flex-col gap-1.5 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                            <span className="font-bold flex items-center gap-1">
                              <Eye className="w-3 h-3 text-blue-400" />
                              پیش‌نمایش خروجی پیام دریافتی توسط کاربر ({notif.channel === 'sms' ? 'پیامک' : notif.channel === 'email' ? 'ایمیل' : 'سوشال مدیا'}):
                            </span>
                            <span className="text-[9px] text-amber-300 font-mono">متغیرها با داده‌های فرآیند جایگزین شدند</span>
                          </div>

                          {notif.channel === 'email' && (
                            <div className="bg-slate-800 px-2.5 py-1 rounded text-[11px] font-bold text-emerald-300">
                              موضوع: {resolveTemplatePreview(notif.emailSubject, notif, targetSectionId)}
                            </div>
                          )}

                          <div className={`p-2.5 rounded-lg text-xs leading-relaxed whitespace-pre-line font-sans ${
                            notif.channel === 'sms'
                              ? 'bg-blue-950/70 border border-blue-800/60 text-blue-100'
                              : notif.channel === 'email'
                                ? 'bg-slate-800/80 border border-slate-700 text-slate-100'
                                : 'bg-purple-950/70 border border-purple-800/60 text-purple-100'
                          }`}>
                            {resolveTemplatePreview(notif.messageTemplate, notif, targetSectionId)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f0ebf8] font-['Vazirmatn'] rtl overflow-hidden" dir="rtl">
      {/* Google Forms Header */}
      <header className="bg-white px-4 py-2 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-700" />
            </div>
            <input 
              type="text" 
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-lg font-bold text-slate-800 bg-transparent border-b-2 border-transparent focus:border-purple-600 outline-hidden transition-colors px-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode(viewMode === 'FLOWCHART' ? 'DESIGN' : 'FLOWCHART')}
            className={`p-2 rounded-full transition-colors ${viewMode === 'FLOWCHART' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100 text-slate-600'}`} 
            title={viewMode === 'FLOWCHART' ? "بازگشت به ویرایش" : "نمایش فلوچارت"}
          >
            <GitGraph className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'PREVIEW' ? 'DESIGN' : 'PREVIEW')}
            className={`p-2 rounded-full transition-colors ${viewMode === 'PREVIEW' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100 text-slate-600'}`} 
            title={viewMode === 'PREVIEW' ? "بازگشت به ویرایش" : "پیش‌نمایش"}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onSave({ title: formTitle, description: formDescription, sections })}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md text-sm font-bold shadow-md transition-all active:scale-95"
          >
            ذخیره روند
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === 'PREVIEW' ? (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center gap-6 custom-scrollbar bg-slate-50">
           {/* Preview Process Header */}
           <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border-t-[14px] border-purple-800 p-10">
              <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{formTitle || "روند بدون عنوان"}</h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">{formDescription || "بدون توضیحات..."}</p>
           </div>

           {/* Preview Stages */}
           {sections.map((section, idx) => (
             <div key={section.id} className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg">{idx + 1}</div>
                      <div>
                         <h2 className="text-xl font-black text-slate-800">{section.title || "مرحله بدون عنوان"}</h2>
                         <div className="flex flex-col gap-1 mt-1">
                            {section.assigneeValue ? (
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                     {ORGANIZATION_DATA.positions.find(p => p.id === section.assigneeValue)?.title}
                                  </span>
                                  {section.selectedPeople.length > 0 && (
                                     <span className="text-[10px] font-bold text-slate-400">
                                        (توسط: {section.selectedPeople.join('، ')})
                                     </span>
                                  )}
                               </div>
                            ) : (
                               <span className="text-xs font-bold text-slate-400">بدون واگذاری</span>
                            )}
                            {section.selectedDuties.length > 0 && (
                               <div className="flex items-center gap-1.5 overflow-hidden">
                                  <CheckCircle2 className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="text-[9px] font-bold text-slate-400 truncate">وظایف: {section.selectedDuties.join(' | ')}</span>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
                <div className="p-10 flex flex-col gap-8">
                   {section.description && <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">{section.description}</p>}
                   
                   <div className="grid grid-cols-1 gap-6">
                      {section.questions.map(question => (
                        <div key={question.id} className="flex flex-col gap-3 group">
                           <label className="text-base font-black text-slate-700 flex items-center gap-2">
                              {question.title}
                              {question.required && <span className="text-rose-500">*</span>}
                           </label>
                           
                           {question.type === 'short_answer' && (
                             <input type="text" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-hidden focus:border-purple-600 transition-all font-medium" placeholder="پاسخ خود را بنویسید..." />
                           )}
                           
                           {question.type === 'paragraph' && (
                             <textarea className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-hidden focus:border-purple-600 transition-all font-medium min-h-[120px]" placeholder="پاسخ خود را بنویسید..." />
                           )}
                           
                           {(question.type === 'multiple_choice' || question.type === 'dropdown') && (
                             <div className="flex flex-col gap-2">
                               {question.options?.map(opt => (
                                 <label key={opt.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-transparent hover:border-purple-100 cursor-pointer transition-all">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                                    <span className="text-sm font-bold text-slate-600">{opt.text}</span>
                                 </label>
                               ))}
                             </div>
                           )}

                           {question.type === 'checkbox' && (
                             <div className="flex flex-col gap-2">
                               {question.options?.map(opt => (
                                 <label key={opt.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 border-transparent hover:border-purple-100 cursor-pointer transition-all">
                                    <div className="w-5 h-5 rounded border-2 border-slate-300" />
                                    <span className="text-sm font-bold text-slate-600">{opt.text}</span>
                                 </label>
                               ))}
                             </div>
                           )}

                           {question.type === 'date' && (
                             <div className="relative">
                                <input type="text" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-12 py-3 outline-hidden focus:border-purple-600 transition-all font-medium" placeholder="انتخاب تاریخ..." />
                                <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
                             </div>
                           )}

                           {question.type === 'number' && (
                             <input type="number" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-hidden focus:border-purple-600 transition-all font-bold" placeholder="0" />
                           )}

                           {question.type === 'system_form' && (
                             <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 p-4 bg-blue-50 border-2 border-blue-100 rounded-2xl">
                                   <Database className="w-6 h-6 text-blue-600" />
                                   <div className="flex-1">
                                      <p className="text-sm font-black text-blue-900">اتصال به: {question.systemEntity || 'فاکتور فروش'}</p>
                                      <p className="text-[10px] font-bold text-blue-500">قابلیت جستجو در سوابق و ایجاد رکورد جدید</p>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <button className="flex-1 bg-white border-2 border-blue-100 text-blue-600 py-2.5 rounded-xl text-xs font-black hover:bg-blue-50 transition-colors">انتخاب از لیست...</button>
                                   <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-black hover:bg-blue-700 transition-colors shadow-sm">+ ایجاد جدید</button>
                                </div>
                             </div>
                           )}

                           {question.type === 'calculation' && (
                             <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                                   <Calculator className="w-5 h-5" />
                                   خروجی محاسباتی: {question.title}
                                </div>
                                <div className="text-lg font-black text-purple-900">--</div>
                             </div>
                           )}
                        </div>
                      ))}
                   </div>

                   {/* Preview Transitions */}
                   <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-4">
                      {section.transitions.map(tr => (
                        <button key={tr.id} className="bg-purple-700 hover:bg-purple-800 text-white px-10 py-3.5 rounded-2xl font-black shadow-lg transition-all active:scale-95 flex items-center gap-3">
                           {tr.label}
                           <ArrowLeft className="w-5 h-5" />
                        </button>
                      ))}
                      {section.transitions.length === 0 && (
                        <button className="bg-slate-200 text-slate-500 px-10 py-3.5 rounded-2xl font-black cursor-not-allowed">بدون خروجی</button>
                      )}
                   </div>
                </div>
             </div>
           ))}
           <div className="h-20" />
        </div>
      ) : viewMode === 'FLOWCHART' ? (
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center gap-10 custom-scrollbar bg-slate-50">
           <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-12 border border-slate-100">
              <div className="flex items-center justify-between mb-12">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">نقشه راه روند عملیاتی</h2>
                    <p className="text-slate-500 font-bold mt-2">نمای گرافیکی ارتباطات و منطق‌های شرطی بین مراحل</p>
                 </div>
                 <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 flex items-center gap-3 text-blue-700 font-bold">
                    <GitGraph className="w-6 h-6" />
                    تعداد مراحل: {sections.length}
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                 {sections.map((section, idx) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     key={section.id} 
                     className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group relative"
                   >
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-4 border-white">
                         {idx + 1}
                      </div>
                      
                      <div className="flex flex-col gap-4">
                         <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                               <Layers className="w-7 h-7" />
                            </div>
                            <div>
                               <h3 className="text-xl font-black text-slate-800">{section.title}</h3>
                               <div className="flex flex-col gap-1 mt-1">
                                  {section.assigneeValue && (
                                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                        <Layers className="w-3 h-3" />
                                        {ORGANIZATION_DATA.positions.find(p => p.id === section.assigneeValue)?.title}
                                     </p>
                                  )}
                                  {section.selectedPeople.length > 0 && (
                                     <p className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                        <User className="w-2.5 h-2.5" />
                                        {section.selectedPeople.join('، ')}
                                     </p>
                                  )}
                               </div>
                            </div>
                         </div>

                         <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">خروجی‌ها و اتصالات:</span>
                            {section.transitions.map(tr => (
                               <div key={tr.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
                                  <div className="flex items-center justify-between">
                                     <span className="text-sm font-black text-slate-700">{tr.label}</span>
                                     <ArrowLeft className="w-4 h-4 text-blue-600" />
                                  </div>
                                  
                                  <div className="flex flex-col gap-2">
                                     {tr.routes.map((route, rIdx) => {
                                        const target = sections.find(s => s.id === route.targetSectionId);
                                        return (
                                          <div key={route.id} className="flex flex-col gap-1.5 pl-3 border-l-2 border-blue-200 py-1">
                                             <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">مسیر {rIdx + 1}</span>
                                                <span className="text-[10px] font-black text-slate-500">مقصد: {target?.title || 'نامشخص'}</span>
                                                {route.notifications && route.notifications.length > 0 && (
                                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100 flex items-center gap-1">
                                                    <BellRing className="w-2.5 h-2.5" />
                                                    {route.notifications.length} گیرنده پیام
                                                  </span>
                                                )}
                                             </div>
                                             {route.conditions.length > 0 && (
                                               <div className="flex flex-wrap gap-1">
                                                  {route.conditions.map((c, cIdx) => (
                                                    <span key={c.id} className="text-[9px] font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                                                       {cIdx > 0 && <span className="text-blue-500 mr-1">{route.logicOperator}</span>}
                                                       فیلد {c.fieldId.slice(-4)} {c.operator} {c.value}
                                                    </span>
                                                  ))}
                                               </div>
                                             )}
                                          </div>
                                        );
                                     })}
                                     <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">پیش‌فرض</span>
                                        <span className="text-[10px] font-black text-slate-500">
                                           مقصد: {sections.find(s => s.id === tr.defaultTargetSectionId)?.title || 'توقف در مرحله'}
                                        </span>
                                     </div>
                                  </div>
                               </div>
                            ))}
                            {section.transitions.length === 0 && (
                              <div className="text-xs font-bold text-slate-300 italic py-2">مرحله نهایی (بدون خروجی)</div>
                            )}
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
           <div className="h-20" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center gap-4 custom-scrollbar">
          {/* Global Process Name & Description */}
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg border-t-[12px] border-purple-800 p-8 flex flex-col gap-6 mb-4">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-purple-700 uppercase tracking-widest">نام و عنوان روند عملیاتی</label>
              <div className="flex items-end justify-between gap-6">
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="flex-1 text-3xl font-black text-slate-900 border-b-2 border-transparent focus:border-purple-600 outline-hidden pb-2 transition-all"
                  placeholder="مثلاً: روند تایید پرداخت‌های تنخواه"
                />
                 <div className="flex items-center gap-4">
                   <div className="bg-purple-700 text-white px-6 py-3 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-purple-200 shrink-0 min-w-[120px]">
                      <span className="text-[10px] font-black opacity-80 uppercase tracking-tighter mb-0.5">امتیاز کل روند</span>
                      <span className="text-xl font-black">
                         {sections.reduce((total, sec) => 
                            total + sec.questions.reduce((qTotal, q) => qTotal + (q.score || 0), 0)
                         , 0)}
                      </span>
                   </div>
                   <div className="bg-blue-700 text-white px-6 py-3 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-blue-200 shrink-0 min-w-[120px]">
                      <span className="text-[10px] font-black opacity-80 uppercase tracking-tighter mb-0.5">زمان کل روند (دقیقه)</span>
                      <span className="text-xl font-black">
                         {sections.reduce((total, sec) => 
                            total + sec.questions.reduce((qTotal, q) => qTotal + (q.standardTime || 0), 0)
                         , 0)}
                      </span>
                   </div>
                 </div>
              </div>
           </div>
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">توضیحات کلی و راهنما</label>
              <textarea 
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="text-sm text-slate-600 border-b border-transparent focus:border-slate-200 outline-hidden resize-none py-1 font-medium"
                placeholder="هدف از این روند و مراحل کلی آن را شرح دهید..."
                rows={2}
              />
           </div>
        </div>

        {/* Sections and Questions */}
        <div className="w-full max-w-5xl flex flex-col gap-10 mb-32">
          {sections.map((section, secIdx) => (
            <div key={section.id} className="flex flex-col gap-2">
              {/* Section Container (Integrated Title & Assignment) */}
              <div 
                onClick={() => setActiveId(section.id)}
                className={`bg-white rounded-xl shadow-md border-r-8 ${activeId === section.id ? 'border-purple-600 ring-4 ring-purple-50' : 'border-slate-200'} transition-all overflow-hidden`}
              >
                {/* Section Identification Header */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-sm">{secIdx + 1}</div>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider">مرحله {secIdx + 1} از {sections.length}</span>
                      <div className="mr-2 px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
                         <span className="text-[9px] font-black text-slate-400 uppercase">امتیاز مرحله:</span>
                         <span className="text-xs font-black text-purple-600">
                            {section.questions.reduce((total, q) => total + (q.score || 0), 0)}
                         </span>
                      </div>
                      <div className="mr-1 px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
                         <span className="text-[9px] font-black text-slate-400 uppercase">زمان مرحله:</span>
                         <span className="text-xs font-black text-blue-600">
                            {section.questions.reduce((total, q) => total + (q.standardTime || 0), 0)} <span className="text-[9px]">دقیقه</span>
                         </span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={() => addSection()} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-purple-600 transition-colors" title="افزودن مرحله جدید بعد از این"><Plus className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>

                <div className="p-8 flex flex-col gap-8">
                  {/* Title & Description */}
                  <div className="flex flex-col gap-3">
                    <input 
                      type="text" 
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="text-2xl font-black text-slate-800 border-b-2 border-transparent focus:border-purple-600 outline-hidden w-full transition-colors pb-2"
                      placeholder="عنوان مرحله (مثلاً: تایید مدیر واحد)"
                    />
                    <textarea 
                      value={section.description}
                      onChange={(e) => updateSection(section.id, { description: e.target.value })}
                      className="text-sm text-slate-500 border-b border-transparent focus:border-slate-200 outline-hidden w-full resize-none font-medium"
                      placeholder="توضیحات و راهنمای این مرحله..."
                      rows={1}
                    />
                  </div>

                  {/* Assignment & Duty Panel */}
                  <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100 flex flex-col gap-6">
                    <div className="flex items-center justify-between mb-1">
                       <div className="flex items-center gap-2 text-purple-800 font-black text-xs">
                          <User className="w-4 h-4" />
                          تنظیمات واگذاری مرحله و وظایف
                       </div>
                       <div className="text-[10px] font-bold text-purple-400 bg-white px-3 py-1 rounded-full border border-purple-100">واگذاری سلسله‌مراتبی</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Position Selection */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-purple-600 pr-1 uppercase tracking-widest flex items-center gap-1">
                           <Layers className="w-3 h-3" />
                           ۱. انتخاب سمت سازمانی
                        </label>
                        <select 
                          value={section.assigneeValue}
                          onChange={(e) => updateSection(section.id, { 
                            assigneeValue: e.target.value,
                            selectedPeople: [],
                            selectedDuties: [] 
                          })}
                          className="w-full bg-white border-2 border-purple-100 rounded-xl px-4 py-3 text-sm font-black outline-hidden focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all cursor-pointer"
                        >
                          <option value="">انتخاب سمت...</option>
                          {ORGANIZATION_DATA.positions.map(pos => (
                            <option key={pos.id} value={pos.id}>{pos.title}</option>
                          ))}
                        </select>
                      </div>

                      {/* People Selection (Multi) */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-purple-600 pr-1 uppercase tracking-widest flex items-center gap-1">
                           <User className="w-3 h-3" />
                           ۲. انتخاب اشخاص (زیرمجموعه سمت)
                        </label>
                        <div className="bg-white border-2 border-purple-100 rounded-xl p-2 min-h-[120px] max-h-[200px] overflow-y-auto custom-scrollbar">
                           {!section.assigneeValue ? (
                             <div className="h-full flex items-center justify-center text-[10px] font-bold text-slate-300 py-10">ابتدا سمت را انتخاب کنید</div>
                           ) : (
                             <div className="flex flex-col gap-1">
                                {ORGANIZATION_DATA.positions.find(p => p.id === section.assigneeValue)?.people.map(person => {
                                  const isSelected = section.selectedPeople.includes(person);
                                  return (
                                    <button
                                      key={person}
                                      onClick={() => {
                                        const next = isSelected 
                                          ? section.selectedPeople.filter(p => p !== person)
                                          : [...section.selectedPeople, person];
                                        updateSection(section.id, { selectedPeople: next });
                                      }}
                                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-black transition-all ${
                                        isSelected 
                                          ? 'bg-purple-600 text-white shadow-md' 
                                          : 'bg-slate-50 text-slate-600 hover:bg-purple-50'
                                      }`}
                                    >
                                       {person}
                                       {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </button>
                                  );
                                })}
                             </div>
                           )}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 px-1 italic">میتوانید چندین شخص را همزمان انتخاب کنید</p>
                      </div>

                      {/* Duties Selection (Multi) */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-purple-600 pr-1 uppercase tracking-widest flex items-center gap-1">
                           <CheckCircle2 className="w-3 h-3" />
                           ۳. انتخاب وظایف (مرتبط با سمت)
                        </label>
                        <div className="bg-white border-2 border-purple-100 rounded-xl p-2 min-h-[120px] max-h-[200px] overflow-y-auto custom-scrollbar">
                           {!section.assigneeValue ? (
                             <div className="h-full flex items-center justify-center text-[10px] font-bold text-slate-300 py-10">ابتدا سمت را انتخاب کنید</div>
                           ) : (
                             <div className="flex flex-col gap-1">
                                {ORGANIZATION_DATA.positions.find(p => p.id === section.assigneeValue)?.duties.map(duty => {
                                  const isSelected = section.selectedDuties.includes(duty);
                                  return (
                                    <button
                                      key={duty}
                                      onClick={() => {
                                        const next = isSelected 
                                          ? section.selectedDuties.filter(d => d !== duty)
                                          : [...section.selectedDuties, duty];
                                        updateSection(section.id, { selectedDuties: next });
                                      }}
                                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-black transition-all ${
                                        isSelected 
                                          ? 'bg-blue-600 text-white shadow-md' 
                                          : 'bg-slate-50 text-slate-600 hover:bg-blue-50'
                                      }`}
                                    >
                                       {duty}
                                       {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </button>
                                  );
                                })}
                             </div>
                           )}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 px-1 italic">میتوانید چندین وظیفه را همزمان انتخاب کنید</p>
                      </div>
                    </div>
                  </div>

                  {/* Questions in this section */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">
                       <FileText className="w-3.5 h-3.5" />
                       سوالات و فیلدهای اطلاعاتی
                    </div>
                    <Reorder.Group 
                      axis="y" 
                      values={section.questions} 
                      onReorder={(newQuestions) => setSections(sections.map(s => s.id === section.id ? { ...s, questions: newQuestions } : s))}
                      className="flex flex-col gap-4"
                    >
                      {section.questions.map((question) => (
                        <Reorder.Item 
                          key={question.id} 
                          value={question}
                          onPointerDown={() => setActiveId(question.id)}
                          className={`relative bg-slate-50/50 rounded-xl border-2 ${activeId === question.id ? 'border-blue-500 bg-white' : 'border-transparent'} transition-all`}
                        >
                          <div className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                              <div className="flex-1 w-full">
                                <input 
                                  type="text" 
                                  value={question.title}
                                  onChange={(e) => updateQuestion(section.id, question.id, { title: e.target.value })}
                                  className="w-full bg-transparent border-b border-slate-200 focus:border-purple-600 outline-hidden p-2 text-slate-800 text-sm font-bold"
                                  placeholder="عنوان سوال یا فیلد..."
                                />
                              </div>
                              <div className="w-full md:w-64 shrink-0 flex items-center gap-3">
                                <div className="flex-1 flex flex-col gap-1">
                                  <label className="text-[9px] font-black text-slate-400 mr-1">امتیاز فیلد</label>
                                  <div className="relative">
                                    <Hash className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                                    <input 
                                      type="number"
                                      min="0"
                                      value={question.score}
                                      onChange={(e) => updateQuestion(section.id, question.id, { score: Number(e.target.value) })}
                                      className="w-full bg-white border border-slate-200 rounded-lg pl-2 pr-7 py-2 text-[10px] font-black outline-hidden focus:border-purple-500"
                                    />
                                  </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                  <label className="text-[9px] font-black text-slate-400 mr-1">زمان (دقیقه)</label>
                                  <div className="relative">
                                    <ClockIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                                    <input 
                                      type="number"
                                      min="0"
                                      value={question.standardTime}
                                      onChange={(e) => updateQuestion(section.id, question.id, { standardTime: Number(e.target.value) })}
                                      className="w-full bg-white border border-slate-200 rounded-lg pl-2 pr-7 py-2 text-[10px] font-black outline-hidden focus:border-blue-500"
                                    />
                                  </div>
                                </div>
                                <div className="w-28 shrink-0 flex flex-col gap-1">
                                  <label className="text-[9px] font-black text-slate-400 mr-1">نوع فیلد</label>
                                  <select 
                                    value={question.type}
                                    onChange={(e) => updateQuestion(section.id, question.id, { type: e.target.value as QuestionType })}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold outline-hidden cursor-pointer h-[34px]"
                                  >
                                    <option value="short_answer">پاسخ کوتاه</option>
                                    <option value="paragraph">پاسخ بلند</option>
                                    <option value="multiple_choice">چهارگزینه‌ای</option>
                                    <option value="checkbox">چک‌باکس</option>
                                    <option value="dropdown">منوی کشویی</option>
                                    <option value="calculation">محاسباتی (فرمول‌نویسی)</option>
                                    <option value="date">تاریخ</option>
                                    <option value="time">ساعت</option>
                                    <option value="duration">مدت زمان (Duration)</option>
                                    <option value="number">عدد</option>
                                    <option value="system_form">اتصال به فرم سیستمی</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Options Area, Calculation Panel, or Simple Input Placeholder */}
                            {question.type === 'calculation' ? (
                              <div className="bg-slate-100/50 rounded-xl p-5 border border-slate-200 flex flex-col gap-4">
                                 {/* ... Calculation Editor ... */}
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-blue-700 font-bold text-[10px] uppercase">
                                       <FunctionSquare className="w-4 h-4" />
                                       ویرایشگر فرمول محاسباتی
                                    </div>
                                    <div className="flex items-center gap-1">
                                       {['(', ')', '+', '-', '*', '/', '^', '√', '%'].map(op => (
                                         <button 
                                           key={op}
                                           onClick={() => updateQuestion(section.id, question.id, { formula: (question.formula || '') + `${op}` })}
                                           className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-xs font-black hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 shadow-sm transition-all active:scale-90"
                                         >
                                           {op}
                                         </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="relative">
                                    <textarea 
                                      value={question.formula || ''}
                                      onChange={(e) => updateQuestion(section.id, question.id, { formula: e.target.value })}
                                      className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-mono focus:border-blue-500 outline-hidden min-h-[80px]"
                                      placeholder="فرمول خود را اینجا بنویسید یا از متغیرها استفاده کنید..."
                                    />
                                    <div className="absolute left-3 bottom-3 flex items-center gap-2">
                                       <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold rounded border border-blue-100 flex items-center gap-1">
                                          <Variable className="w-3 h-3" />
                                          Real-time Output
                                       </div>
                                    </div>
                                 </div>

                                 <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">متغیرهای در دسترس (فیلدهای تعریف شده)</label>
                                    <div className="flex flex-wrap gap-2">
                                       {getAllFields().filter(f => f.id !== question.id).map(field => (
                                         <button 
                                           key={field.id}
                                           onClick={() => updateQuestion(section.id, question.id, { formula: (question.formula || '') + ` {${field.title}} ` })}
                                           className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center gap-1.5"
                                         >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {field.title}
                                            <span className="text-[8px] text-slate-400 opacity-60">[{field.sectionTitle}]</span>
                                         </button>
                                       ))}
                                       {getAllFields().length <= 1 && <span className="text-[10px] text-slate-300 italic">هنوز فیلدی برای استفاده در فرمول تعریف نشده است.</span>}
                                    </div>
                                 </div>
                              </div>
                            ) : question.type === 'system_form' ? (
                               <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-200 flex flex-col gap-4">
                                  <div className="flex items-center gap-2 text-blue-700 font-bold text-[10px] uppercase">
                                     <Database className="w-4 h-4" />
                                     تنظیمات اتصال سیستمی
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                     <label className="text-[10px] font-black text-slate-500 pr-1 uppercase">انتخاب موجودیت مقصد</label>
                                     <select 
                                       value={question.systemEntity || 'sales_invoice'}
                                       onChange={(e) => updateQuestion(section.id, question.id, { systemEntity: e.target.value })}
                                       className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-black outline-hidden focus:ring-2 focus:ring-blue-100"
                                     >
                                        <option value="sales_invoice">فاکتور فروش</option>
                                        <option value="purchase_order">سفارش خرید</option>
                                        <option value="inventory_item">کالا و انبار</option>
                                        <option value="customer">مشتری / طرف حساب</option>
                                        <option value="human_resources">پرسنل و احکام</option>
                                     </select>
                                  </div>
                                  <div className="bg-blue-100/30 p-3 rounded-lg border border-blue-100 flex items-start gap-3">
                                     <div className="p-1.5 bg-blue-100 rounded-md">
                                        <Variable className="w-3.5 h-3.5 text-blue-600" />
                                     </div>
                                     <div>
                                        <p className="text-[10px] font-black text-blue-800">پیش‌نمایش اتصال</p>
                                        <p className="text-[9px] font-bold text-blue-500 mt-0.5 leading-relaxed">این فیلد در زمان اجرا، لیستی از {question.systemEntity === 'sales_invoice' ? 'فاکتورهای فروش' : 'رکوردها'} را جهت جستجو نمایش داده و امکان ایجاد رکورد جدید را فراهم می‌کند.</p>
                                     </div>
                                  </div>
                               </div>
                             ) : ['multiple_choice', 'checkbox', 'dropdown'].includes(question.type) ? (
                              <div className="flex flex-col gap-2 pr-4">
                                {question.options?.map((option, idx) => (
                                  <div key={option.id} className="flex items-center gap-2 group">
                                    <div className={`w-4 h-4 border-2 border-slate-300 ${question.type === 'multiple_choice' ? 'rounded-full' : 'rounded'}`} />
                                    <input 
                                      type="text" 
                                      value={option.text}
                                      onChange={(e) => updateOption(section.id, question.id, option.id, e.target.value)}
                                      className="flex-1 bg-transparent border-b border-transparent focus:border-slate-300 outline-hidden py-1 text-xs text-slate-600"
                                    />
                                    <button onClick={() => removeOption(section.id, question.id, option.id)} className="opacity-0 group-hover:opacity-100 p-1 text-rose-500"><X className="w-3.5 h-3.5" /></button>
                                  </div>
                                ))}
                                <button onClick={() => addOption(section.id, question.id)} className="text-[10px] font-bold text-blue-600 hover:underline mt-1">+ افزودن گزینه</button>
                              </div>
                            ) : (
                              <div className="w-2/3 border-b border-dashed border-slate-300 py-2 text-slate-400 text-xs italic">
                                {question.type === 'short_answer' && 'متن پاسخ کوتاه'}
                                {question.type === 'paragraph' && 'متن پاسخ بلند'}
                                {question.type === 'date' && 'انتخاب تاریخ (تقویم)'}
                                {question.type === 'time' && 'انتخاب ساعت'}
                                {question.type === 'duration' && 'ورود مدت زمان (مثلاً: ۲ ساعت و ۳۰ دقیقه)'}
                                {question.type === 'number' && 'ورود عدد'}
                                {question.type === 'system_form' && 'اتصال به فرم سیستمی (آماده استفاده)'}
                              </div>
                            )}

                            <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                               <button onClick={() => duplicateQuestion(section.id, question.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Copy className="w-4 h-4" /></button>
                               <button onClick={() => deleteQuestion(section.id, question.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Trash2 className="w-4 h-4" /></button>
                               <div className="w-px h-4 bg-slate-200 mx-1" />
                               <div className="flex items-center gap-2 mr-2">
                                  <span className="text-[10px] font-bold text-slate-500">اجباری</span>
                                  <button 
                                    onClick={() => updateQuestion(section.id, question.id, { required: !question.required })}
                                    className={`w-8 h-4 rounded-full relative transition-colors ${question.required ? 'bg-purple-600' : 'bg-slate-300'}`}
                                  >
                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${question.required ? 'right-4.5' : 'right-0.5'}`} />
                                  </button>
                               </div>
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                    
                    <button 
                      onClick={() => addQuestion(section.id)}
                      className="mt-2 w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50/30 transition-all flex items-center justify-center gap-2 text-xs font-black"
                    >
                      <Plus className="w-4 h-4" />
                      افزودن فیلد سوال جدید به این مرحله
                    </button>
                  </div>

                  {/* Transitions / Action Buttons Panel */}
                  <div className="border-t border-slate-100 pt-6 mt-2">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                          <Play className="w-4 h-4" />
                          دکمه‌های انتقال و خروجی مرحله
                       </div>
                       <button 
                         onClick={() => addTransition(section.id)}
                         className="flex items-center gap-1.5 text-[10px] font-black bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
                       >
                         <Plus className="w-3.5 h-3.5" />
                         تعریف دکمه جدید
                       </button>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                       {section.transitions.map(tr => (
                         <div key={tr.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col gap-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                                  <input 
                                    type="text"
                                    value={tr.label}
                                    onChange={(e) => updateTransition(section.id, tr.id, { label: e.target.value })}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-black outline-hidden w-48 focus:ring-2 focus:ring-rose-100"
                                    placeholder="عنوان دکمه..."
                                  />
                               </div>
                               <button onClick={() => removeTransition(section.id, tr.id)} className="text-slate-300 hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            {/* Multi-Route Logic Builder */}
                            <div className="flex flex-col gap-4">
                               {tr.routes.map((route, rIdx) => (
                                 <div key={route.id} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm relative">
                                    <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
                                       <div className="flex items-center gap-2">
                                          <div className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded">مسیر {rIdx + 1}</div>
                                          <div className="text-[10px] font-black text-slate-500">اگر شروط زیر برقرار بود:</div>
                                       </div>
                                       <button onClick={() => removeRoute(section.id, tr.id, route.id)} className="text-slate-300 hover:text-rose-500"><X className="w-3.5 h-3.5" /></button>
                                    </div>

                                    <div className="flex flex-col gap-2 mb-4">
                                       {route.conditions.map((condition, cIdx) => (
                                         <div key={condition.id} className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 group">
                                            {cIdx > 0 && (
                                              <select 
                                                value={route.logicOperator}
                                                onChange={(e) => updateRoute(section.id, tr.id, route.id, { logicOperator: e.target.value as 'AND' | 'OR' })}
                                                className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded outline-hidden appearance-none cursor-pointer"
                                              >
                                                <option value="AND">AND</option>
                                                <option value="OR">OR</option>
                                              </select>
                                            )}
                                            <span className="text-[10px] font-bold text-slate-400">اگر</span>
                                            <select 
                                              value={condition.fieldId}
                                              onChange={(e) => updateCondition(section.id, tr.id, route.id, condition.id, { fieldId: e.target.value })}
                                              className="bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-bold outline-hidden"
                                            >
                                              <option value="">انتخاب فیلد...</option>
                                              {section.questions.map(q => (
                                                <option key={q.id} value={q.id}>{q.title || 'بدون عنوان'}</option>
                                              ))}
                                            </select>
                                            <select 
                                              value={condition.operator}
                                              onChange={(e) => updateCondition(section.id, tr.id, route.id, condition.id, { operator: e.target.value as any })}
                                              className="bg-white border border-slate-200 rounded px-1 py-1 text-[10px] font-bold outline-hidden"
                                            >
                                              <option value="==">=</option>
                                              <option value="!=">≠</option>
                                              <option value=">">&gt;</option>
                                              <option value="<">&lt;</option>
                                              <option value="contains">شامل</option>
                                              <option value="empty">خالی باشد</option>
                                              <option value="not_empty">پر باشد</option>
                                            </select>
                                            {condition.operator !== 'empty' && condition.operator !== 'not_empty' && (
                                              <input 
                                                type="text"
                                                value={condition.value}
                                                onChange={(e) => updateCondition(section.id, tr.id, route.id, condition.id, { value: e.target.value })}
                                                className="bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-bold outline-hidden w-20"
                                                placeholder="مقدار..."
                                              />
                                            )}
                                            <button onClick={() => removeCondition(section.id, tr.id, route.id, condition.id)} className="opacity-0 group-hover:opacity-100 p-1 text-rose-400"><X className="w-3 h-3" /></button>
                                         </div>
                                       ))}
                                       <button 
                                         onClick={() => addCondition(section.id, tr.id, route.id)}
                                         className="text-[9px] font-black text-blue-500 hover:underline self-start mt-1"
                                       >
                                         + افزودن شرط به این مسیر
                                       </button>
                                    </div>

                                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-50">
                                       <label className="text-[10px] font-black text-slate-500 pr-1 uppercase flex items-center gap-1.5">
                                          <ArrowRight className="w-3 h-3 text-blue-500" />
                                          انتقال به مقصد:
                                       </label>
                                       <select 
                                         value={route.targetSectionId}
                                         onChange={(e) => updateRoute(section.id, tr.id, route.id, { targetSectionId: e.target.value })}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-black outline-hidden focus:ring-2 focus:ring-blue-100 transition-all"
                                        >
                                         <option value="">انتخاب مقصد برای این مسیر...</option>
                                         <option value="end">پایان روند (اتمام)</option>
                                         {sections.filter(s => s.id !== section.id).map(s => (
                                           <option key={s.id} value={s.id}>{s.title || 'بدون عنوان'}</option>
                                         ))}
                                       </select>

                                        {/* پنل ارسال پیام و اطلاع‌رسانی پس از انتقال به مقصد با امکان ساخت قالب متن و گیرندگان نامحدود */}
                                        {renderNotificationPanel(
                                          route.targetSectionId,
                                          route.notifications,
                                          `route-${route.id}`,
                                          (channel) => addNotificationRecipient(section.id, tr.id, route.id, channel),
                                          (recipientId, updates) => updateNotificationRecipient(section.id, tr.id, route.id, recipientId, updates),
                                          (recipientId) => removeNotificationRecipient(section.id, tr.id, route.id, recipientId),
                                          (recipientId, tag, targetField) => handleInsertTag(section.id, tr.id, route.id, recipientId, tag, targetField),
                                          (recipientId, templateId) => applyTemplateToRecipient(section.id, tr.id, route.id, recipientId, templateId),
                                          'ارسال پیامک، ایمیل و پیام در سوشال مدیا',
                                          'وقتی تمام شروط دکمه رعایت شد و به مقصد رفت، به این افراد اطلاع داده می‌شود (اتوماتیک یا دستی).'
                                        )}
                                      </div>
                                  </div>
                                ))}
                                
                                <button 
                                  onClick={() => addRoute(section.id, tr.id)}
                                  className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-[10px] font-black"
                                >
                                   <Plus className="w-3.5 h-3.5" />
                                   افزودن مسیر شرطی جدید (Else If)
                                </button>

                                <div className="bg-slate-100/50 rounded-lg p-3 border border-slate-200">
                                   <div className="flex flex-col gap-1.5">
                                      <label className="text-[10px] font-black text-slate-500 pr-1 uppercase flex items-center gap-1.5">
                                         <ArrowRight className="w-3 h-3 text-slate-400" />
                                         مقصد پیش‌فرض (اگر هیچ شرطی برقرار نشد):
                                      </label>
                                      <select 
                                        value={tr.defaultTargetSectionId}
                                        onChange={(e) => updateTransition(section.id, tr.id, { defaultTargetSectionId: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-black outline-hidden focus:ring-2 focus:ring-slate-100"
                                       >
                                        <option value="">توقف در همین مرحله</option>
                                        <option value="end">پایان روند (اتمام)</option>
                                        {sections.filter(s => s.id !== section.id).map(s => (
                                          <option key={s.id} value={s.id}>{s.title || 'بدون عنوان'}</option>
                                        ))}
                                      </select>
                                   </div>

                                   {/* بخش ارسال پیام برای مقصد پیش‌فرض با امکان ساخت قالب متن و گیرندگان نامحدود */}
                                   {renderNotificationPanel(
                                     tr.defaultTargetSectionId,
                                     tr.defaultNotifications,
                                     `default-${tr.id}`,
                                     (channel) => addDefaultNotificationRecipient(section.id, tr.id, channel),
                                     (recipientId, updates) => updateDefaultNotificationRecipient(section.id, tr.id, recipientId, updates),
                                     (recipientId) => removeDefaultNotificationRecipient(section.id, tr.id, recipientId),
                                     (recipientId, tag, targetField) => handleInsertTag(section.id, tr.id, undefined, recipientId, tag, targetField),
                                     (recipientId, templateId) => applyTemplateToRecipient(section.id, tr.id, undefined, recipientId, templateId),
                                     'اطلاع‌رسانی پیامک / ایمیل / سوشال در مقصد پیش‌فرض',
                                     'در صورتی که هیچ‌یک از شروط بالا برقرار نشود و به این مقصد برود، به این افراد اطلاع داده می‌شود.'
                                   )}
                                </div>
                             </div>
                          </div>
                        ))}
                        {section.transitions.length === 0 && (
                          <div className="md:col-span-2 py-4 text-center border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-[10px] font-bold">
                             هنوز دکمه‌ای برای انتقال از این مرحله تعریف نشده است.
                          </div>
                        )}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={addSection}
            className="w-full py-8 border-4 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-purple-600 hover:border-purple-300 hover:bg-white transition-all flex flex-col items-center justify-center gap-3 group"
          >
             <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                <Plus className="w-6 h-6" />
             </div>
             <span className="text-lg font-black tracking-tight">افزودن مرحله (سکشن) عملیاتی جدید</span>
          </button>
        </div>
      </div>
    )}

    {/* نمایش بازخورد شبیه‌سازی تست پیام */}
    {notificationToast && (
      <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          notificationToast.channel === 'sms' 
            ? 'bg-blue-600 text-white' 
            : notificationToast.channel === 'email' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-purple-600 text-white'
        }`}>
          {notificationToast.channel === 'sms' ? <Smartphone className="w-4 h-4" /> : notificationToast.channel === 'email' ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
        </div>
        <div className="text-xs font-bold leading-relaxed">{notificationToast.message}</div>
        <button onClick={() => setNotificationToast(null)} className="text-slate-400 hover:text-white mr-auto p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);
};
