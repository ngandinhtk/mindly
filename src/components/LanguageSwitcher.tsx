import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher-button"
      data-testid="language-switcher"
      style={{
        // position: 'absolute',
        // top: '45px',
        // right: '20px',
        // border: '1px solid #707070ff',
        padding: '7px 10px',
        borderRadius: '5px',

        fontSize: '12px',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        color: 'white',
        fontWeight: 'bold'
      }}
    >
      {i18n.language === 'en' ? 'EN' : 'VI'}
    </button>
  );
};

export default LanguageSwitcher;