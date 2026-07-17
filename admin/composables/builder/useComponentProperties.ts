export interface PropertyConfig {
  default?: any;
  type?: any;
  required?: boolean;
  editor?: {
    root?: boolean;
    label: string;
    type: string;
    [key: string]: any;
  };
}

export interface ComponentDefinition {
  id: string;
  name: string;
  group: string;
  thumbnail: string;
  properties: Record<string, PropertyConfig>;
}

export interface PropertyConfig {
  default?: any;
  type?: any;
  required?: boolean;
  editor?: {
    root?: boolean;
    label: string;
    type: string;
    [key: string]: any;
  };
}

export interface ComponentDefinition {
  id: string;
  name: string;
  group: string;
  thumbnail: string;
  properties: Record<string, PropertyConfig>;
}

const definitions: Record<string, ComponentDefinition> = {};
const categories: Record<string, ComponentDefinition[]> = {};
const semanticCategories: Record<string, ComponentDefinition[]> = {};

const CATEGORY_ORDER = [
  'alerts',
  'tracking',
  'media',
  'forms',
  'navigation',
  'widgets',
  'content',
  'layout',
];

const uiFiles = import.meta.glob('~/components/global/ui/*/*/properties.ts', {
  eager: true,
});

const campaignFiles = import.meta.glob('~/components/global/campaigns/*/properties.ts', {
  eager: true,
});

const allFiles = { ...uiFiles, ...campaignFiles };

for (const [path, module] of Object.entries(allFiles)) {
  const anyModule = module as any;
  const parts = path.split('/');

  const isCampaign = path.includes('/campaigns/');

  const group = isCampaign ? 'campaigns' : parts[parts.length - 3];
  const rawName = parts[parts.length - 2];

  const kebabName = toKebabCase(rawName);
  const id = isCampaign ? kebabName : `${toKebabCase(group)}-${kebabName}`;

  let displayName = anyModule.name;
  if (!displayName) {
    if (rawName.includes('-')) {
      displayName = formatKebab(rawName);
    } else {
      displayName = rawName.replace(/([A-Z])/g, ' $1').trim();
    }
  }

  const def: ComponentDefinition = {
    id,
    name: displayName,
    group: formatKebab(group),
    thumbnail: anyModule.thumbnail || '',
    properties: anyModule.properties || {},
  };

  definitions[id] = def;

  if (!categories[group]) categories[group] = [];
  categories[group].push(def);

  const semanticGroup = anyModule.category || group;
  if (!semanticCategories[semanticGroup]) semanticCategories[semanticGroup] = [];
  semanticCategories[semanticGroup].push(def);
}

const orderedSemanticCategories = CATEGORY_ORDER.reduce(
  (acc, categoryName) => {
    if (semanticCategories[categoryName]) {
      acc[categoryName] = semanticCategories[categoryName];
    }
    return acc;
  },
  {} as Record<string, ComponentDefinition[]>
);


Object.keys(semanticCategories).forEach((categoryName) => {
  if (!CATEGORY_ORDER.includes(categoryName)) {
    orderedSemanticCategories[categoryName] = semanticCategories[categoryName];
  }
});

// for alert components
const alertPropertyFiles = import.meta.glob('~/components/global/ui/alert/*/properties.ts', {
  eager: true,
});

export const useComponentProperties = () => {
  return {
    definitions, // The flat map
    categories, // The grouped list (folder-based)
    semanticCategories: orderedSemanticCategories, // Semantic grouping with ordered display
    alertPropertyFiles, // alert components
  };
};

//// definitions
// {
//   "alert-card": { name: "Card", group: "alert", ... },
//   "alert-modal": { name: "Modal", group: "alert", ... },
//   "form-login": { name: "Login", group: "form", ... },
//   "form-signup": { name: "Signup", group: "form", ... }
// }

//// categories
// {
//   "alert": [
//     { id: "alert-card", name: "Card" },
//     { id: "alert-modal", name: "Modal" }
//   ],
//   "form": [
//     { id: "form-login", name: "Login" },
//     { id: "form-signup", name: "Signup" }
//   ]
// }
