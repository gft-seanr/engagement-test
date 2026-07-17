/*
    "pages":
    {
        "template": "template-name",
        "sections": [],
        "states": ["state1", "state2"] // Optional based on page type
    }
*/

const formatTemplateSlug = (name: string) => {
  if (name.toLowerCase() === 'withotp') return 'with-otp';

  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

export const createPageStructure = (type: string, templateName: string) => {
  const formattedTemplate = formatTemplateSlug(templateName);
  const fullTemplateId = `${type}-${formattedTemplate}`;

  const base = {
    template: fullTemplateId,
    sections: [],
  };

  switch (type) {
    case 'login':
      if (formattedTemplate === 'with-otp') {
        return {
          ...base,
          states: ['login', 'otp', 'expired'],
        };
      }

      return {
        ...base,
        states: ['login', 'expired'],
      };

    case 'register':
      if (formattedTemplate === 'with-otp') {
        return {
          ...base,
          states: ['registration', 'otp', 'success', 'expired'],
        };
      }

      return {
        ...base,
        states: ['registration', 'success', 'expired'],
      };

    case 'home':
    default:
      return base;
  }
};
