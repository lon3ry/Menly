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

const getFeatureText = (language, featureName) => {
  return translations[language]['features'][featureName];
}

const getErrorsText = (language) => {
  return translations[language]['errors'];
}


module.exports = {
  getCommandText: getCommandText,
  getFeatureText: getFeatureText,
  getErrorsText: getErrorsText
}