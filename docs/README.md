# Giftaway Engagement Frontend

A Nuxt 3 application for managing engagement campaigns with dynamic UI configurations.

## Setup

Install dependencies:

```bash
pnpm install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

Format code with Prettier:

```bash
pnpm format
```

## Production

Build the application for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## Component Organization

This project follows a strict component organization to distinguish between config-referenceable components and shared utilities.

### Campaign Component Naming Convention

Campaign components in `components/global/campaigns/` follow a structured naming pattern:

```
[CampaignType][RewardStructure][GroupingStrategy]
```

**Components:**

- `[CampaignType]`: Type of spend/progress tracking
  - `AccumulatedSpend` - Track cumulative spending over time
  - `FrequencySpend` - Track number of transactions/spends
  - `CategorySpend` - Track spending by category
- `[RewardStructure]`: How rewards are structured
  - `Single` - One reward (single tier or final reward)
  - `Multiple` - Multiple rewards (multiple tiers or progressive rewards)
- `[GroupingStrategy]`: How users/rewards are grouped (optional)
  - `ByGroup` - Grouped by card type/user segment (e.g., `no`, `low`, `mid`)
  - `ByCardType` - Grouped by card type (e.g., `mastercard`, `visa`, `platinum`)
  - _(omitted)_ - No grouping, universal rewards

**Examples:**

- `AccumulatedSpendSingleByGroup` - Accumulate spending, one reward per card group
- `AccumulatedSpendMultipleByTier` - Accumulate spending, multiple tiered rewards
- `FrequencySpendSingle` - Count transactions, one reward (no grouping)
- `FrequencySpendMultipleByGroup` - Count transactions, multiple rewards per card group
- `CategorySpendSingleByGroup` - Category spending, one reward per card group

**Notes:**

- Milestone/progressive steps are handled via data configuration, not separate components
- Same component can handle different progress patterns through props

### Folder Structure

```
components/
├── global/                    # Config-referenceable components (globally auto-imported)
│   ├── campaigns/            # Full campaign components
│   ├── templates/            # Page templates (home, login, register)
│   └── ui/                   # UI components usable in configs
│       ├── alert/
│       ├── button/
│       ├── card/
│       ├── form/
│       └── ...
│
├── shared/                    # Reusable but NOT config-referenceable
│   ├── base/                 # Base UI components
│   ├── layout/               # Layout helpers
│   └── utils/                # Utility components
│
├── features/                  # Feature-specific shared components
│   ├── auth/                 # Auth-related components
│   ├── transactions/         # Transaction-related components
│   └── rewards/              # Reward-related components
│
├── shadcn-ui/                 # Design system components
├── section-renderer/          # Core rendering infrastructure
├── markdown/                  # Markdown processing
└── dev/                       # Development tools
```

### Component Principles

#### `global/` - Config-Referenceable Components

- **Purpose**: Components that can be referenced in UI config JSON files (`content/ui-settings/`)
- **Auto-imported**: Globally registered via `nuxt.config.ts`
- **Naming**: Follow strict naming conventions (e.g., `Component1`, `Component2`)
- **Usage**: Can be used directly in configuration files without imports

#### `shared/` - Internal Shared Components

- **Purpose**: Reusable components NOT exposed to config system
- **Importing**: Must be explicitly imported where needed
- **Naming**: More flexible naming conventions
- **Flexibility**: Can have complex props and internal behavior without config constraints

#### `features/` - Feature-Specific Components

- **Purpose**: Domain-specific shared logic and components
- **Organization**: Grouped by feature/domain (auth, transactions, rewards, etc.)
- **Scope**: Keeps related functionality together

#### `shadcn-ui/` - Design System

- **Purpose**: Base UI library components
- **Source**: Third-party or core design system
- **Rule**: No business logic, pure presentation

#### `section-renderer/` & `markdown/` - Core Infrastructure

- **Purpose**: System-level rendering and processing components
- **Scope**: Framework-level functionality

### Component Decision Tree

Use this decision tree to determine where a component should be placed:

```
Does it render/process OTHER components?
├─ YES → core/ (or keep as standalone like section-renderer/)
└─ NO →
    └─ Can it be used in UI config JSON?
        ├─ YES → global/
        └─ NO →
            └─ Is it domain-specific (auth, transactions, rewards, etc.)?
                ├─ YES → features/
                └─ NO → shared/
```

**Quick Reference:**

- **`core/`** = The engine (system infrastructure, renderers, parsers)
- **`global/`** = The catalog (config-referenceable components)
- **`shared/`** = The parts (reusable UI components, must be imported)
- **`features/`** = The domains (business logic grouped by feature)
- **`shadcn-ui/`** = The design system (base UI library, no business logic)

## Configuration

UI configurations are stored in `content/ui-settings/` organized by program ID. Each configuration file defines the layout and components for a specific campaign.

## Key Technologies

- **Nuxt 3**: Vue framework
- **TypeScript**: Type safety
- **TailwindCSS**: Utility-first CSS
- **FormKit**: Form handling
- **Tanstack Query**: Data fetching and state management

## Important Notes

1. `id` and `name` are required in all FormKit components to avoid hydration mismatch
2. Only components in `global/` can be referenced in UI config JSON files
