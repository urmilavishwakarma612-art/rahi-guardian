import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.volunteers': 'Volunteers',
    'nav.firstAid': 'First Aid',
    'nav.nearbyServices': 'Nearby Services',
    'nav.quickDial': 'Quick Dial',
    'nav.notifications': 'Notifications',
    'nav.analytics': 'Analytics',
    'nav.about': 'About',
    'nav.sos': 'SOS Emergency',
    'nav.signIn': 'Sign In',
    
    // Homepage
    'home.badge': '🚨 Real-time Emergency Response',
    'home.title': 'Your Guardian on the',
    'home.titleHighlight': 'Highway',
    'home.subtitle': 'RAHI uses AI-powered emergency detection to connect you with help in seconds. Voice-activated reports, instant volunteer alerts, and real-time location tracking.',
    'home.reportEmergency': 'Report Emergency Now',
    'home.installApp': 'Install App (Offline Mode)',
    'home.livesSaved': 'Lives Saved',
    'home.volunteers': 'Active Volunteers',
    'home.responseTime': 'Avg Response Time',
    'home.howItWorks': 'How RAHI Works',
    'home.howItWorksSubtitle': 'Four simple steps between emergency and help',
    'home.whyChoose': 'Why Choose RAHI',
    'home.whyChooseSubtitle': 'Advanced technology meets compassionate care',
    'home.ctaTitle': 'Every Second Counts in an Emergency',
    'home.ctaSubtitle': 'Join thousands who trust RAHI for highway safety. Install the app to work offline during emergencies.',
    'home.tryDemo': 'Try Emergency Demo',
    
    // Emergency
    'emergency.active': 'Emergency Mode Active',
    'emergency.title': 'Report Highway Emergency',
    'emergency.subtitle': 'Stay calm. We\'re here to help. Provide details and we\'ll dispatch assistance immediately.',
    'emergency.yourLocation': 'Your Location',
    'emergency.locationAcquired': 'Location Acquired',
    'emergency.describe': 'Describe the Emergency',
    'emergency.recording': 'Recording...',
    'emergency.tapToStop': 'Tap to Stop',
    'emergency.pressToReport': 'Press to Report SOS',
    'emergency.submit': 'Submit Emergency Report',
    'emergency.submitting': 'Submitting...',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  hi: {
    // Navbar
    'nav.home': 'होम',
    'nav.volunteers': 'स्वयंसेवक',
    'nav.firstAid': 'प्राथमिक चिकित्सा',
    'nav.nearbyServices': 'नजदीकी सेवाएं',
    'nav.quickDial': 'त्वरित डायल',
    'nav.notifications': 'सूचनाएं',
    'nav.analytics': 'विश्लेषण',
    'nav.about': 'हमारे बारे में',
    'nav.sos': 'एसओएस आपातकाल',
    'nav.signIn': 'साइन इन',
    
    // Homepage
    'home.badge': '🚨 रियल-टाइम आपातकालीन प्रतिक्रिया',
    'home.title': 'आपका संरक्षक',
    'home.titleHighlight': 'राजमार्ग पर',
    'home.subtitle': 'RAHI एआई-संचालित आपातकालीन पहचान का उपयोग करके आपको सेकंड में मदद से जोड़ता है। आवाज-सक्रिय रिपोर्ट, तत्काल स्वयंसेवक अलर्ट, और रियल-टाइम स्थान ट्रैकिंग।',
    'home.reportEmergency': 'आपातकाल रिपोर्ट करें',
    'home.installApp': 'ऐप इंस्टॉल करें (ऑफलाइन मोड)',
    'home.livesSaved': 'जानें बचाई',
    'home.volunteers': 'सक्रिय स्वयंसेवक',
    'home.responseTime': 'औसत प्रतिक्रिया समय',
    'home.howItWorks': 'RAHI कैसे काम करता है',
    'home.howItWorksSubtitle': 'आपातकाल और मदद के बीच चार सरल कदम',
    'home.whyChoose': 'RAHI क्यों चुनें',
    'home.whyChooseSubtitle': 'उन्नत तकनीक करुणामय देखभाल से मिलती है',
    'home.ctaTitle': 'आपातकाल में हर सेकंड मायने रखता है',
    'home.ctaSubtitle': 'हजारों लोगों में शामिल हों जो राजमार्ग सुरक्षा के लिए RAHI पर भरोसा करते हैं। आपात स्थिति के दौरान ऑफ़लाइन काम करने के लिए ऐप इंस्टॉल करें।',
    'home.tryDemo': 'आपातकालीन डेमो आज़माएं',
    
    // Emergency
    'emergency.active': 'आपातकालीन मोड सक्रिय',
    'emergency.title': 'राजमार्ग आपातकाल रिपोर्ट करें',
    'emergency.subtitle': 'शांत रहें। हम मदद के लिए यहां हैं। विवरण प्रदान करें और हम तुरंत सहायता भेजेंगे।',
    'emergency.yourLocation': 'आपका स्थान',
    'emergency.locationAcquired': 'स्थान प्राप्त',
    'emergency.describe': 'आपातकाल का वर्णन करें',
    'emergency.recording': 'रिकॉर्डिंग...',
    'emergency.tapToStop': 'रोकने के लिए टैप करें',
    'emergency.pressToReport': 'SOS रिपोर्ट करने के लिए दबाएं',
    'emergency.submit': 'आपातकालीन रिपोर्ट जमा करें',
    'emergency.submitting': 'जमा किया जा रहा है...',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('rahi-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('rahi-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
