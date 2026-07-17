export function sanitizeNode(node: any): any {
  const { definitions } = useComponentProperties();

  if (!node || typeof node !== 'object') return node;

  const componentId = node.component || node.id;

  if (componentId) {
    const def = definitions[componentId];

    let defaultProps = {};

    if (def && def.properties) {
      const extraction = extractDefaultsAndOverrides(def.properties);
      defaultProps = extraction.props;
    }

    node.props = { ...defaultProps, ...(node.props || {}) };

    node.classes = node.classes || {};
    node.attrs = node.attrs || {};
    node.sections = node.sections || [];

    if (!node.id) node.id = crypto.randomUUID();
  }

  if (Array.isArray(node.sections)) {
    node.sections = node.sections.map((child: any) => sanitizeNode(child));
  }

  return node;
}

export function sanitizeConfig(config: any) {
  if (!config?.pages) return config;

  for (const pageKey in config.pages) {
    const page = config.pages[pageKey];
    if (page.sections) {
      page.sections = page.sections.map((s: any) => sanitizeNode(s));
    }
  }
  return config;
}
