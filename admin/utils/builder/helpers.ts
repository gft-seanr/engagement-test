import type { Component } from 'vue';
import FormTemplate from '~/admin/components/builder/preview/templates/FormTemplate.vue';
import OtpTemplate from '~/admin/components/builder/preview/templates/OtpTemplate.vue';

const TEMPLATE_PREVIEW_MAP = {
  login: FormTemplate,
  register: FormTemplate,
  otp: OtpTemplate,
};

export function extractDefaults(properties: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(properties).map(([key, config]) => [key, config.default])
  );
}

// "cover-image" -> "Cover Image"
// componentId = "cover-image"
export function formatKebab(kebab: string): string {
  if (!kebab?.includes('-')) {
    return kebab;
  }

  return kebab
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function toKebabCase(str: string): string {
  if (!str) return '';

  return (
    str
      // Find a lowercase letter (or number) followed by an uppercase letter and insert a hyphen
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase()
  );
}

export function formatCapitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function splitWord(word: string, index: number = 0): string {
  if (!word) return '';

  const words = word.split(' ');

  return words[index];
}

export function extractDefaultsAndOverrides(properties: Record<string, any> = {}) {
  const props: Record<string, any> = {};
  const rootOverrides: Record<string, any> = {};

  for (const [key, config] of Object.entries(properties)) {
    if (config.default === undefined) continue;

    const value = JSON.parse(JSON.stringify(config.default));

    if (config.root === true) {
      rootOverrides[key] = value;
    } else {
      props[key] = value;
    }
  }

  return { props, rootOverrides };
}

export const resolveTemplateImage = (pageType: string, templateName: string): Component => {
  if (!pageType || !templateName) return TEMPLATE_PREVIEW_MAP.login; // default

  const typeLower = pageType.toLowerCase();
  const nameLower = templateName.toLowerCase();

  if (nameLower === 'withotp') {
    return TEMPLATE_PREVIEW_MAP.otp;
  }

  if (typeLower === 'register') {
    return TEMPLATE_PREVIEW_MAP.register;
  }

  return TEMPLATE_PREVIEW_MAP.login;
};
