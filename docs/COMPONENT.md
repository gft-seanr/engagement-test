Component

- Naming Convention
- Props
- Theme/Colors
- Variants?
- States?

Component Names

- {commonName/categoryName/groupName}-{descriptiveWords}-{modifier/variant}

Sample

- button-primary-large
- card-promo-outlined
- form-login-compact

Props

- string | boolean | number | markdown | icon

Sample Props
heading-component-1
props: {
title: 'Security Bank Mid Year Gadget Raffle Promo',
description: 'Lorem ipsum dolor sit amet consectetur at et enim cursus adipiscing diam scelerisqe integer.'
link?: See terms and condition
logoIcon: 'far-signout'
}

Theme/Colors

- Components should be themeable
  theme: {
  colors: {
  primary: '#1e3a8a',
  secondary: '#1e1e1e',
  tertiary: ''
  },
  fonts: {
  heading: 'Inter, sans-serif',
  body: 'Roboto, sans-serif'
  }
  }

Variants

- Primary, Secondary, Outlined, Compact

States

- Default, Active, Hover, Disabled, Focus, Loading

Customization Methods

- Props value
- Props Classes
- Props styles
- Markdown
- $schema?
