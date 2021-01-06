const { translations } = require('../messages.json');

const getCommandText = (language, commandName) => {
  if (!translations[language]['commands'][commandName]) {
    let commandTranslations = {};
    commandTranslations['errors'] = translations[language]['errors'];
    return commandTranslations;
    
  } else {
    const commandTranslations = translations[language]['commands'][commandName];
    commandTranslations['errors'] = translations[language]['errors'];
    return commandTranslations;
  }
}

const getErrorsText = (language) => {
  return translations[language]['errors'];
}

module.exports = {
  getCommandText: getCommandText,
  getErrorsText: getErrorsText
}