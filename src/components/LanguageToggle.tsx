import { Button } from './ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
      <span className="sm:hidden">{language === 'en' ? 'HI' : 'EN'}</span>
    </Button>
  );
};
