# Giftaway Frontend - Code Convention Guide

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [File and Folder Names](#file-and-folder-names)
3. [Folder Structure](#folder-structure)
4. [General Coding Guide](#general-coding-guide)
5. [Code Quality Standards](#code-quality-standards)
6. [Error Handling Standards](#error-handling-standards)
7. [Performance Best Practices](#performance-best-practices)
8. [Type Definitions](#type-definitions)
9. [Guards and Type Narrowing](#guards-and-type-narrowing)
10. [Global Types and Declarations](#global-types-and-declarations)
11. [Import and Export Conventions](#import-and-export-conventions)
12. [Composables Style Guide](#composables-style-guide)
13. [Component Development](#component-development)
14. [Vue Component Documentation](#vue-component-documentation)
15. [Vue Template Patterns](#vue-template-patterns)
16. [Template Complexity Guidelines](#template-complexity-guidelines)
17. [Layout and Styling Conventions](#layout-and-styling-conventions)
18. [State Management Patterns](#state-management-patterns)
19. [Event Handling Conventions](#event-handling-conventions)
20. [Watchers and Lifecycle](#watchers-and-lifecycle)
21. [Advanced Vue Patterns](#advanced-vue-patterns)
22. [Server API Development](#server-api-development)

---

## Naming Conventions

### 1. Data Properties and Variables

- Use **camelCase** for data property and variable names.

  - **Good**: `customerData`, `raffleEntries`, `totalAmount`
  - **Bad**: `customer_data`, `RaffleEntries`, `total-amount`

- Boolean properties should start with `can`, `has`, or `is`.

  - **Good**: `isCustomerActive`, `hasRaffleEntries`, `canSubmitForm`
  - **Bad**: `customerActive`, `raffleEntries`, `submitForm`

- Pluralize property names if they represent a collection or array.

  - **Good**: `raffleEntries`, `customerList`, `transactions`
  - **Bad**: `raffleEntry`, `customer`, `transaction` (when representing arrays)

- Use `Id` instead of `ID` for identifiers.

  - **Good**: `userId`, `transactionId`, `campaignId`
  - **Bad**: `userID`, `transactionID`, `campaignID`

- If a data property contains an acronym, capitalize only the first letter of the acronym.

  - **Good**: `apiResponse`, `httpRequest`, `uiSettings`
  - **Bad**: `APIResponse`, `HTTPRequest`, `UISettings`

- Use meaningful and descriptive names that convey the purpose of the variable.

  - **Good**: `totalAmount`, `userProfile`, `visibleTransactions`
  - **Bad**: `total`, `profile`, `visible`

- Avoid single-letter names entirely.

  - **Good**: `index`, `counter`, `transactionItem`
  - **Bad**: `i`, `j`, `t`

- Avoid abbreviations; use the full name instead. _Exception: Widely-recognized abbreviations like `auth`, `config`, `env`, and `api` are acceptable._

  - **Good**: `transactions`, `authToken`, `apiConfig`, `userSettings`
  - **Bad**: `trans`, `tkn`, `cfg`, `usrSettings`

- For intermediate or short-lived variables, use descriptive names that explain their content or purpose rather than generic prefixes.
  - **Good**: `normalizedName`, `previousValue`, `filteredResults`, `sanitizedInput`
  - **Bad**: `temp`, `tmp`, `temp1`, `temp2`

### 2. Methods and Functions

- Use **camelCase** for method names.

  - **Good**: `fetchRaffleEntries`, `getCustomerData`, `toggleDialog`
  - **Bad**: `FetchRaffleEntries`, `get_customer_data`, `toggle-dialog`

- Method names should start with a verb to indicate action.

  - **Good**: `updateCustomerInfo`, `calculateTotalAmount`, `setSorting`
  - **Bad**: `customerInfo`, `totalAmount`, `sorting`

- Use meaningful and descriptive names that convey the purpose of the method.

  - **Good**: `validateUserInput`, `processPayment`, `toggleSort`
  - **Bad**: `validate`, `process`, `toggle`

- If a method returns a boolean, prefix it with `is`, `has`, or `can`.

  - **Good**: `isUserLoggedIn`, `hasPermission`, `canSubmitForm`
  - **Bad**: `userLoggedIn`, `permission`, `submitForm`

- For asynchronous data fetching methods, use consistent prefixes:
  - **`get`** for simpler data retrieval or internal operations
    - **Good**: `getTransactions`, `getCustomerData`, `getSettings`
  - **`load`** for initialization or heavy operations
    - **Good**: `loadCustomerDetails`, `loadConfiguration`
  - **Bad**: `retrieveData`, `obtainTransactions`, `pullSettings`

### 3. Template Elements

- Use **PascalCase** for custom component tags.

  - **Good**: `<RewardTransaction>`, `<DialogFooter>`, `<CarouselContent>`
  - **Bad**: `<rewardTransaction>`, `<dialog-footer>`, `<carouselcontent>`

- Use meaningful and descriptive names that convey the purpose of the element.

  - **Good**: `<UserProfile>`, `<TransactionList>`, `<CardCounter>`
  - **Bad**: `<Profile>`, `<List>`, `<Card1>`

- Avoid abbreviations; use the full name instead.

  - **Good**: `<CustomerDetails>`, `<TransactionSummary>`
  - **Bad**: `<CustDetails>`, `<TranSum>`

- Ensure that custom component names are unique to avoid conflicts.

  - **Good**: `<AppHeader>`, `<AppFooter>`, `<CardTokenTotalCount>`
  - **Bad**: `<Header>`, `<Footer>`, `<Card>`

- Use self-closing tags for components without children.
  - **Good**: `<LoadingSpinner />`, `<IconButton />`, `<NuxtImg />`
  - **Bad**: `<LoadingSpinner></LoadingSpinner>`, `<IconButton></IconButton>`

### 4. CSS Classes

- Use **kebab-case** for CSS class names (following Tailwind CSS convention).

  - **Good**: `text-center`, `font-normal`, `bg-accent-700`
  - **Bad**: `textCenter`, `fontNormal`, `bgAccent700`

- Use meaningful and descriptive names that convey the purpose of the class.

  - **Good**: `primary-button`, `error-message`, `transaction-card`
  - **Bad**: `btn-1`, `msg`, `card`

- Prefix state classes with `is-` or `has-` to indicate their state.
  - **Good**: `is-active`, `has-error`, `is-loading`
  - **Bad**: `active`, `error`, `loading`

---

## File and Folder Names

### 1. Component Names

- Use **PascalCase** for component names.

  - **Good**: `CustomerPage.vue`, `RewardTransaction.vue`, `CardTokenTotalCount.vue`
  - **Bad**: `customerPage.vue`, `reward-transaction.vue`, `cardtokentotalcount.vue`

- Prefix component names with the parent folder name for clarity.

  - **Good**:
    - `components/global/ui/card/CardCounter.vue`
    - `components/global/ui/cover/CoverLogo.vue`
    - `components/global/campaigns/SpinTheWheel.vue`
  - **Bad**:
    - `components/global/ui/card/Component1.vue`
    - `components/global/ui/cover/Component2.vue`

- For **Campaign Components**, follow a structured 4-segment naming pattern:

  ```
  [CampaignType] + [RewardQuantity] + [GroupingMethod] + [Variant?].vue
  ```

  - **CampaignType**: Use descriptive names like `SpinTheWheel`, `RewardRedemption`, `AccumulatedSpend`, `FrequencySpend`, etc.
  - **RewardQuantity**: `Single`, `Multiple` (optional if not relevant)
  - **GroupingMethod**: `ByGroup`, `ByTier`, `ByCategory` (optional if not grouped)
  - **Variant**: `WithPuzzle`, `WithProgress`, `Simplified` (optional, for distinguishing similar components)

  - **Good**:
    - `SpinTheWheelSingle.vue`
    - `RewardRedemptionMultipleByTier.vue`
    - `AccumulatedSpendSingleWithProgress.vue`
    - `FrequencySpendMultipleByGroup.vue`
    - `DualSpendMultipleByGroup.vue`
    - `AccumulatedSpendSingleWithPuzzle.vue`
  - **Bad**:

    - `AccumulatedAndFrequencySpendMultipleRewardsByGroup.vue` (too long, inconsistent)
    - `Accumulated.vue` (not descriptive enough)
    - `SpendRewards.vue` (missing campaign type and grouping info)

  - **Good**:
    - `AccumulatedSpendSingleByGroup.vue`
    - `AccumulatedSpendMultipleByTier.vue`
    - `FrequencySpendMultipleByGroup.vue`
    - `DualSpendMultipleByGroup.vue`
    - `AccumulatedSpendSingleWithPuzzle.vue`
  - **Bad**:
    - `AccumulatedAndFrequencySpendMultipleRewardsByGroup.vue` (too long, inconsistent)
    - `Accumulated.vue` (not descriptive enough)
    - `SpendRewards.vue` (missing program type and grouping info)

### 2. File Names

- Use **kebab-case** for utility and service file names.

  - **Good**: `user-service.ts`, `api-client.ts`, `environment.ts`
  - **Bad**: `userService.ts`, `apiClient.ts`, `Environment.ts`

- Use **camelCase** for composable file names with `use` prefix.
  - **Good**: `useTransactionsQuery.ts`, `useAuthState.ts`, `useSettings.ts`
  - **Bad**: `use-transactions-query.ts`, `useauth_state.ts`, `UseSettings.ts`

### 3. Folder Names

- Use **kebab-case** for folder names.

  - **Good**: `user-services`, `api-clients`, `ui-settings`
  - **Bad**: `userServices`, `apiClients`, `uiSettings`

- Use descriptive folder names that clearly indicate their purpose.
  - **Good**: `mutations`, `queries`, `utilities`, `states`
  - **Bad**: `mut`, `qry`, `util`, `state`

---

## Folder Structure

This project follows **Nuxt 3** conventions with a structured approach to organizing components, composables, and utilities:

```
root/
├── assets/                     # Static assets (styles, images, fonts)
│   ├── formkit-themes/        # FormKit theme configurations
│   └── styles/                # Global CSS files
├── components/                 # Vue components
│   ├── admin/                 # Admin-specific components
│   ├── dev/                   # Development/debug components
│   ├── global/                # Globally available components
│   │   ├── campaigns/         # Campaign-specific components
│   │   ├── templates/         # Template components
│   │   └── ui/               # UI components by category
│   │       ├── alert/        # Alert components
│   │       ├── card/         # Card components
│   │       ├── carousel/     # Carousel components
│   │       ├── cover/        # Cover/header components
│   │       └── table/        # Table components
│   ├── markdown/             # Markdown rendering components
│   ├── section-renderer/     # Section rendering components
│   └── shadcn-ui/           # Shadcn UI components
├── composables/              # Vue composables organized by purpose
│   ├── mutations/           # Data mutation composables
│   ├── queries/             # Data fetching composables
│   ├── settings/            # Settings management composables
│   ├── states/              # State management composables
│   └── utilities/           # Utility composables
├── constants/               # Application constants
├── content/                # Content management
├── layouts/                # Nuxt layout components
├── middleware/             # Nuxt middleware
├── pages/                  # Nuxt pages (file-based routing)
├── plugins/                # Nuxt plugins
├── public/                 # Static public assets
├── server/                 # Server-side code
│   ├── api/               # API endpoints
│   ├── plugins/           # Server plugins
│   └── utils/             # Server utilities
├── services/              # External service integrations
├── types/                 # TypeScript type definitions
└── utils/                 # Client-side utilities
```

### Folder Organization Principles

1. **By Feature**: Group related components in feature-specific folders
2. **By Type**: Within features, organize by component type (UI, business logic, etc.)
3. **Global vs Local**: Global components are automatically imported, local ones are not
4. **Composables Categories**: Separate by purpose (queries, mutations, states, utilities)

---

## General Coding Guide

### Reusability, Scalability, & Readability

- **Rule 1.1**: Always consider generic coding instead of one-off implementations. Design components and functions with flexibility in mind.

  - **Good**:

    ```typescript
    function filterByProperty<T>(items: T[], key: keyof T, value: any): T[] {
      return items.filter((item) => item[key] === value);
    }

    const activeUsers = filterByProperty(users, 'status', 'active');
    ```

  - **Bad**:
    ```typescript
    function getActiveUsers(users: any[]) {
      return users.filter((user) => user.status === 'active');
    }
    ```

- **Rule 1.2**: Avoid large, complex functions with multiple logical responsibilities. Always separate concerns. _Skip if the whole function is highly cohesive._

  - **Good**:
    ```typescript
    function handle() {
      process1();
      process2();
      process3();
    }
    function process1() {
      /* logic for process 1 */
    }
    function process2() {
      /* logic for process 2 */
    }
    function process3() {
      /* logic for process 3 */
    }
    ```
  - **Bad**:
    ```typescript
    function handle() {
      // logic for process 1
      // logic for process 2
      // logic for process 3
    }
    ```

- **Rule 1.3**: Avoid repetition of logic. If you notice the same logic appearing **two or more times**, refactor it immediately into a **util/helper function or composable** — don't wait for more occurrences.

  - **Good**:

    ```typescript
    function calculateTotal(items: { price: number }[]) {
      return items.reduce((sum, item) => sum + item.price, 0);
    }

    const totalCart = calculateTotal(cartItems);
    const totalOrder = calculateTotal(orderItems);
    ```

  - **Bad**:
    ```typescript
    const totalCart = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalOrder = orderItems.reduce((sum, item) => sum + item.price, 0);
    ```

- **Rule 1.4**: Prefer configuration over branching logic. Move decision-making outside functions using config objects, maps, or parameters. _Skip only if you're certain the function will have at most one or two paths._

  - **Good**:

    ```typescript
    const buttonStyles = {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-black',
      danger: 'bg-red-500 text-white',
    };

    function getButtonStyle(type: keyof typeof buttonStyles) {
      return buttonStyles[type];
    }
    ```

  - **Bad**:
    ```typescript
    function getButtonStyle(type: string) {
      if (type === 'primary') return 'bg-blue-500 text-white';
      if (type === 'secondary') return 'bg-gray-200 text-black';
      if (type === 'danger') return 'bg-red-500 text-white';
    }
    ```

- **Rule 1.5**: Keep templates clean and readable; avoid complex inline expressions. _Skip for trivial bindings._

  - **Good**:

    ```vue
    <template>
      <div v-if="showMessage">{{ message }}</div>
    </template>

    <script setup lang="ts">
    const showMessage = computed(() => {
      status.value === 'success' && isActive.value && hasPermission.value;
    });

    const message = computed(() => {
      switch (status.value) {
        case 'success':
          return 'Operation successful';
        case 'warning':
          return 'Check your input';
        case 'error':
          return 'Something went wrong';
      }
    });
    </script>
    ```

  - **Bad**:
    ```vue
    <template>
      <div v-if="status === 'success' && isActive && hasPermission">
        {{
          status === 'success'
            ? 'Operation successful'
            : status === 'warning'
              ? 'Check your input'
              : 'Something went wrong'
        }}
      </div>
    </template>
    ```

### Error Handling & Safety

- **Rule 2.1**: Guard against null, undefined, and empty states where applicable. Always handle these cases explicitly to prevent runtime errors and unexpected behavior.

  - **Good**:

    ```typescript
    function sumPrices(items?: { price: number }[]) {
      if (!items || items.length === 0) return 0;
      return items.reduce((total, item) => total + item.price, 0);
    }

    sumPrices(); // 0
    sumPrices([]); // 0
    sumPrices([{ price: 5 }]); // 5
    ```

  - **Bad**:

    ```typescript
    function sumPrices(items: { price: number }[]) {
      return items.reduce((total, item) => total + item.price, 0);
    }

    sumPrices([]); // Runtime error
    sumPrices(undefined); // Runtime error
    ```

### Accessibility and UX

- **Rule 3.1**: Ensure components are responsive. Design with responsiveness from the start — follow a mobile-first approach and scale up for larger screens.
- **Rule 3.2**: Always include ARIA attributes where appropriate. Use ARIA roles, labels, and properties to communicate meaning and state to assistive technologies. _Not mandatory but recommended._
- **Rule 3.3**: Ensure components handle keyboard and screen reader interactions. Make interactive elements focusable, navigable via keyboard, and announce state changes to assistive technologies. This ensures users relying on keyboards or screen readers can use your UI effectively. _Not mandatory but recommended._

### Documentation

- **Rule 4.1**: Use JSDoc for shared and non-trivial function/composables. Clearly describe their purpose, parameters, return values, and usage expectations. _Skip for simple, self-explanatory code where implementation is obvious._

  ```typescript
  /**
   * Paginates a list of items for display.
   *
   * @param items - Full list of items
   * @param page - Current page number (1-based)
   * @param pageSize - Number of items per page
   * @param options - Optional pagination behavior
   * @param options.clampPage - Clamp page number within valid range
   * @returns An object containing paginated items and pagination metadata
   */
  function paginate<T>(
    items: T[],
    page: number,
    pageSize: number,
    options?: {
      clampPage?: boolean;
    }
  ): {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  } {
    /* ... */
  }
  ```

---

## Composables Style Guide

### File Naming

- **Rule 1.1**: Prefix composable files with "use" and follow camelCase.
  - **Good**: `useTransactionsQuery.ts`, `useAuthState.ts`, `useSettings.ts`
  - **Bad**: `transactionsQuery.ts`, `auth-state.ts`, `Settings.ts`

### Composable Naming

- **Rule 2.1**: Use descriptive names for composables that indicate their purpose.
  - **Good**: `export function useTransactionsQuery() {}`
  - **Bad**: `export function useQuery() {}`

### Folder Structure for Composables

- **Rule 3.1**: Organize composables by category in dedicated subdirectories.
  ```
  composables/
  ├── mutations/          # Data mutation operations
  ├── queries/           # Data fetching operations
  ├── settings/          # Application settings
  ├── states/            # State management
  └── utilities/         # Helper functions and utilities
  ```

### Argument Passing

- **Rule 4.1**: Use options objects for composables with multiple parameters.

  - **Good**:
    ```typescript
    useTransactionsQuery({
      size: 300,
      itemsPerPage: 10,
      sortDateBy: 'desc',
    });
    ```
  - **Bad**:
    ```typescript
    useTransactionsQuery(300, 10, undefined, 'desc');
    ```

- **Rule 4.2**: Make options parameter optional with sensible defaults.
  - **Good**:
    ```typescript
    export function useTransactionsQuery(options: QueryOptions = {}) {
      const { size = 300, itemsPerPage = 0 } = options;
    }
    ```

### Error Handling

- **Rule 5.1**: Always expose error states in composables.
  - **Good**:
    ```typescript
    const { data, error, isLoading } = useQuery(...);
    return { data, error, isLoading };
    ```
  - **Bad**:
    ```typescript
    const { data } = useQuery(...);
    return { data }; // Missing error handling
    ```

### TypeScript Integration

- **Rule 6.1**: Use proper TypeScript interfaces for options and return types.

  - **Good**:

    ```typescript
    interface QueryOptions {
      size?: number;
      itemsPerPage?: number;
      sortDateBy?: 'asc' | 'desc';
    }

    export function useTransactionsQuery(options: QueryOptions = {}) {
      // implementation
    }
    ```

### Composable Categories

- **Rule 7.1**: Follow naming conventions by category:
  - **Queries**: `useXxxQuery` (e.g., `useTransactionsQuery`, `useTokensQuery`)
  - **Mutations**: `useXxxMutation` (e.g., `useLoginMutation`, `useRegisterMutation`)
  - **States**: `useXxxState` (e.g., `useAuthState`, `useCampaignState`)
  - **Utilities**: `useXxx` (e.g., `useSettings`, `useAlertMap`)

### File Structure of a Composable

- **Rule 8.1**: Maintain consistent ordering of Composition API features.

  ```typescript
  import { ref, computed, onMounted } from 'vue';

  export function useExample(options: ExampleOptions = {}) {
    // 1. Destructure options/parameters
    const { param1 = 'default', param2 = 0 } = options;

    // 2. External dependencies
    const campaign = useCampaignState();

    // 3. Reactive state
    const loading = ref(false);
    const error = ref<Error | null>(null);

    // 4. Computed properties
    const isReady = computed(() => !loading.value && !error.value);

    // 5. Methods/functions
    const fetchData = async () => {
      loading.value = true;
      // implementation
      loading.value = false;
    };

    // 6. Lifecycle hooks
    onMounted(() => {
      fetchData();
    });

    // 7. Return object
    return {
      // State
      loading: readonly(loading),
      error: readonly(error),
      // Computed
      isReady,
      // Methods
      fetchData,
    };
  }
  ```

---

## Component Development

### Component Naming and Organization

- **Rule 1.1**: Components should be organized by feature and prefixed by their folder name.
  - **Good**: `CardTokenTotalCount.vue`, `CoverLogo.vue`, `CarouselWithDialog.vue`
  - **Bad**: `Component1.vue`, `Component2.vue`, `Card.vue`

### Props Definition

- **Rule 2.1**: Use TypeScript interfaces for complex props.

  - **Good**:

    ```typescript
    interface TransactionTableProps {
      title?: string;
      description?: string;
      itemsPerPage?: number;
      sortDateBy?: 'asc' | 'desc';
    }

    defineProps<TransactionTableProps>();
    ```

- **Rule 2.2**: Use classes prop pattern for styling flexibility.
  - **Good**:
    ```typescript
    interface Classes extends NestedClasses<Props> {
      outer?: HTMLAttributes['class'];
      wrapper?: HTMLAttributes['class'];
    }
    ```

### Script Setup Pattern

- **Rule 3.1**: Use `<script setup lang="ts">` for all new components.
- **Rule 3.2**: Order script setup content consistently:

  ```typescript
  // 1. Imports
  import { ref, computed } from 'vue';

  // 2. Type definitions
  interface Props { ... }

  // 3. Props definition
  const props = defineProps<Props>();

  // 4. Composables
  const { data } = useTransactionsQuery();

  // 5. Reactive state
  const isOpen = ref(false);

  // 6. Computed properties
  const filteredData = computed(() => ...);

  // 7. Methods
  const handleClick = () => { ... };
  ```

- **Rule 3.3**: For complex scripts, group related logic into local composables while still following **Rule 3.2**'s order. This keeps your `<script setup>` organized, improves readability, and makes code easier to maintain, without breaking the consistent structure of imports, refs, computed properties, methods, and watchers.

  ```typescript
  // Composables
  const { formData, isValid } = useForm();
  const { isOpen, toggle } = useDialog();

  // Composable Calls
  function useForm() {
    const formData = ref({});
    const isValid = computed(() => true);
    return { formData, isValid };
  }

  function useDialog() {
    const isOpen = ref(false);
    const toggle = () => {
      isOpen.value = !isOpen.value;
    };
    return { isOpen, toggle };
  }
  ```

### Template Structure

- **Rule 4.1**: Use consistent class binding patterns.

  - **Good**: `:class="cn('base-classes', classes?.override)"`
  - **Bad**: `:class="'base-classes ' + (classes?.override || '')"`

- **Rule 4.2**: Use conditional rendering patterns consistently.
  - **Good**: `<template v-if="loading">`, `<div v-else>`
  - **Bad**: `<div v-show="!loading">`

### Modular Composition

- **Rule 5.1**: Break components that are large or contains multiple logical parts into smaller subcomponents for improved readability and scalability. _Skip for small, simple components._
  - Each subcomponent should only have a single responsibility.
- **Rule 5.2**: Create a root component to orchestrate the **layout, state, and slots** of its subcomponents. Manage shared states using Vue's `provide` and `inject`.
  - Could be named after the component itself or suffixed with `Root`.
    - `Widget.vue` or `WidgetRoot.vue`
- **Rule 5.3**: Provide centralized exports and global definitions (e.g. variant styles, types, etc.) for the component using `index.ts`.

  ```
  widget/
  ├── Widget.vue          # Root/Parent (handles layout of subcomponents and global states)
  ├── WidgetTitle.vue     # Subcomponent
  ├── WidgetActions.vue   # Subcomponent
  ├── WidgetIcon.vue      # Subcomponent
  ├── WidgetContent.vue   # Subcomponent
  └── index.ts            # Exports, constants, variants, types
  ```

---

## Type Definitions

### Global Types

- **Rule 1.1**: Use global type declarations in `types/components.ts` for commonly used types.
  - **Good**:
    ```typescript
    declare global {
      interface Alert {
        type: 'error' | 'success' | 'warning' | 'info';
        title?: string;
        description?: string;
      }
    }
    ```

### Interface Naming

- **Rule 2.1**: Use descriptive names with proper suffixes.

  - **Good**: `TransactionTableProps`, `AlertMap`, `QueryOptions`
  - **Bad**: `Props`, `Map`, `Options`

- **Rule 2.2**: Use `Props` suffix for component props interfaces.
  - **Good**: `CardProps`, `TransactionTableProps`
  - **Bad**: `CardInterface`, `TransactionTableType`

### Type Organization

- **Rule 3.1**: Organize types by domain/feature.
  ```
  types/
  ├── components.ts      # Global component types
  ├── api.ts            # API response types
  ├── auth.ts           # Authentication types
  └── transactions.ts   # Transaction-related types
  ```

---

## Guards and Type Narrowing

### Guard Clause Principles

- **Rule 1.1**: Use early returns (guard clauses) to handle edge cases and invalid states first.

  - **Good**:

    ```typescript
    const highestTierToken = computed(() => {
      if (!tokens.value.length) return undefined;

      return tokens.value.reduce((prev, current) => {
        return (prev.tier || 0) > (current.tier || 0) ? prev : current;
      });
    });
    ```

  - **Bad**:
    ```typescript
    const highestTierToken = computed(() => {
      if (tokens.value.length) {
        return tokens.value.reduce((prev, current) => {
          return (prev.tier || 0) > (current.tier || 0) ? prev : current;
        });
      }
      return undefined;
    });
    ```

- **Rule 1.2**: Place guard clauses at the beginning of functions to fail fast.

  - **Good**:

    ```typescript
    function processTransaction(transaction: Transaction | null) {
      if (!transaction) return;
      if (transaction.status !== 'pending') return;
      if (!transaction.amount || transaction.amount <= 0) return;

      // Main logic here
      executeTransaction(transaction);
    }
    ```

  - **Bad**:
    ```typescript
    function processTransaction(transaction: Transaction | null) {
      if (transaction && transaction.status === 'pending' && transaction.amount > 0) {
        executeTransaction(transaction);
      }
    }
    ```

### Null and Undefined Checks

- **Rule 2.1**: Always guard against `null` and `undefined` before accessing properties.

  - **Good**:
    ```typescript
    function getUserName(user: User | undefined): string {
      if (!user) return 'Guest';
      return user.name;
    }
    ```
  - **Bad**:
    ```typescript
    function getUserName(user: User | undefined): string {
      return user?.name || 'Guest'; // Ambiguous if name could be empty string
    }
    ```

- **Rule 2.2**: Use explicit checks instead of relying solely on optional chaining for critical logic.

  - **Good**:
    ```typescript
    if (user && user.permissions && user.permissions.includes('admin')) {
      // Logic here
    }
    ```
  - **OK for non-critical**:
    ```typescript
    const isAdmin = user?.permissions?.includes('admin') ?? false;
    ```

### Array Guards

- **Rule 3.1**: Always check array length before operations that require elements.

  - **Good**:
    ```typescript
    // Before reduce, find, or accessing indices
    if (!items.length) return undefined;
    return items.reduce((acc, item) => acc + item.value, 0);
    ```
  - **Bad**:
    ```typescript
    // reduce() on empty array without initial value throws error
    return items.reduce((acc, item) => acc + item.value);
    ```

- **Rule 3.2**: Provide initial values for array reduce operations when appropriate.

  - **Good**:
    ```typescript
    const total = items.reduce((acc, item) => acc + item.value, 0);
    ```
  - **Also Good** (with guard):
    ```typescript
    if (!items.length) return 0;
    return items.reduce((acc, item) => acc + item.value);
    ```

- **Rule 3.3**: Use `.length` check instead of checking for undefined/null for arrays.

  - **Good**: `if (!array.length)` or `if (array.length === 0)`
  - **Bad**: `if (!array)` when you know it's always an array (could be an empty array)

### Type Narrowing with TypeScript

- **Rule 4.1**: Use type predicates for reusable type guards.

  - **Good**:

    ```typescript
    function isValidToken(token: Token | null): token is Token {
      return token !== null && token.id !== undefined;
    }

    // Usage
    if (isValidToken(token)) {
      // TypeScript knows token is Token here
      console.log(token.id);
    }
    ```

- **Rule 4.2**: Use discriminated unions for complex type narrowing.

  - **Good**:

    ```typescript
    type ApiResponse = { status: 'success'; data: Data } | { status: 'error'; error: Error };

    function handleResponse(response: ApiResponse) {
      if (response.status === 'success') {
        // TypeScript knows response.data exists
        return response.data;
      }
      // TypeScript knows response.error exists
      throw response.error;
    }
    ```

- **Rule 4.3**: Use `typeof` for primitive type guards.

  - **Good**:
    ```typescript
    function formatValue(value: string | number) {
      if (typeof value === 'string') {
        return value.toUpperCase();
      }
      return value.toFixed(2);
    }
    ```

- **Rule 4.4**: Use `instanceof` for class instance checks.

  - **Good**:
    ```typescript
    function handleError(error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
    ```

### Object Property Guards

- **Rule 5.1**: Check for required properties before accessing nested data.

  - **Good**:
    ```typescript
    function getTokenTier(response: TokenResponse | undefined): number {
      if (!response?.data?.tokens) return 0;
      if (!response.data.tokens.length) return 0;
      return response.data.tokens[0].tier || 0;
    }
    ```

- **Rule 5.2**: Use `in` operator for property existence checks in union types.

  - **Good**:

    ```typescript
    type Result = { data: Data } | { error: Error };

    function handleResult(result: Result) {
      if ('data' in result) {
        return result.data;
      }
      throw result.error;
    }
    ```

### Computed Property Guards

- **Rule 6.1**: Guard computed properties that depend on potentially undefined reactive values.

  - **Good**:
    ```typescript
    const userName = computed(() => {
      if (!user.value) return 'Anonymous';
      return user.value.name || 'Unknown User';
    });
    ```

- **Rule 6.2**: Return meaningful defaults instead of `null` or `undefined` when appropriate.

  - **Good**:
    ```typescript
    const sortedTransactions = computed(() => {
      if (!transactions.value) return [];
      return [...transactions.value].sort((a, b) => a.date - b.date);
    });
    ```

### Boolean Coercion Guards

- **Rule 7.1**: Be explicit about what constitutes a truthy/falsy check.

  - **Good**:
    ```typescript
    if (count !== 0) // Explicit check for non-zero
    if (name !== '') // Explicit check for non-empty string
    if (items.length > 0) // Explicit check for array with items
    ```
  - **Acceptable**:
    ```typescript
    if (value) // When any falsy value (0, '', null, undefined, false) should fail
    ```
  - **Bad**:
    ```typescript
    if (count) // Ambiguous - does 0 mean invalid or valid zero count?
    ```

- **Rule 7.2**: Avoid double negation (`!!`) unless converting to strict boolean.

  - **Good**:
    ```typescript
    const hasPermission = Boolean(user?.permissions);
    const isActive = status === 'active';
    ```
  - **Acceptable**:
    ```typescript
    const hasValue = !!value; // When explicitly converting to boolean
    ```

### Error Object Guards

- **Rule 8.1**: Always guard against unknown error types in catch blocks.

  - **Good**:
    ```typescript
    try {
      await riskyOperation();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else if (typeof error === 'string') {
        console.error(error);
      } else {
        console.error('Unknown error occurred');
      }
    }
    ```
  - **Bad**:
    ```typescript
    catch (error) {
      console.error(error.message); // error might not be an Error object
    }
    ```

### Guard Placement Patterns

- **Rule 9.1**: Place guards immediately after parameter/data retrieval.

  - **Good**:

    ```typescript
    export function useTokensQuery(options: QueryOptions = {}) {
      const { programId, alertMap, isEnabled = true } = options;
      const campaign = useCampaignState();

      // Guard early
      if (!campaign.value?.id) {
        return {
          tokens: ref([]),
          error: ref('Campaign ID required'),
          // ... other returns
        };
      }

      // Main logic
      const { data, error } = useQuery({ ... });
    }
    ```

- **Rule 9.2**: Use guard clauses in template computed properties.

  - **Good**:
    ```typescript
    const displayPrice = computed(() => {
      if (!product.value) return 'N/A';
      if (!product.value.price) return 'Free';
      return `$${product.value.price.toFixed(2)}`;
    });
    ```

### Performance Considerations

- **Rule 10.1**: Avoid redundant guards when TypeScript already narrows the type.

  - **Good**:
    ```typescript
    function process(value: string | number) {
      if (typeof value === 'number') {
        return value.toFixed(2); // No need to check again
      }
      // TypeScript knows value is string here
      return value.toLowerCase();
    }
    ```

- **Rule 10.2**: Use early returns to avoid nested if statements.

  - **Good**:
    ```typescript
    function validateUser(user: User | null): boolean {
      if (!user) return false;
      if (!user.email) return false;
      if (!user.isVerified) return false;
      return true;
    }
    ```
  - **Bad**:
    ```typescript
    function validateUser(user: User | null): boolean {
      if (user) {
        if (user.email) {
          if (user.isVerified) {
            return true;
          }
        }
      }
      return false;
    }
    ```

---

## Server API Development

### File Organization

- **Rule 1.1**: Organize API routes in the `server/api/` directory following RESTful patterns.
  ```
  server/api/
  ├── auth/
  │   ├── login.post.ts
  │   └── logout.post.ts
  ├── transactions/
  │   └── index.get.ts
  └── ui-settings/
      └── [id].get.ts
  ```

### API Handler Pattern

- **Rule 2.1**: Use consistent error handling in API routes.

  - **Good**:

    ```typescript
    export default defineEventHandler(async (event) => {
      const params = await getQuery(event);

      if (!params.id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ID parameter is required',
        });
      }

      return await apiHandler(event, `/endpoint/${params.id}`);
    });
    ```

---

## Import and Export Conventions

### Import Organization

- **Rule 1.1**: Order imports by source type:

  ```typescript
  // 1. Vue/Nuxt core imports
  import { ref, computed } from 'vue';
  import { useRoute } from '#app';

  // 2. Third-party library imports
  import { useQuery } from '@tanstack/vue-query';

  // 3. Internal imports (composables, utils, types)
  import { useAuthState } from '~/composables/states/useAuthState';
  import type { Transaction } from '~/types/transactions';
  ```

### Export Patterns

- **Rule 2.1**: Use named exports for composables and utilities.

  - **Good**: `export function useTransactionsQuery() {}`
  - **Bad**: `export default function useTransactionsQuery() {}`

- **Rule 2.2**: Use default exports for Vue components.
  - **Good**: `<script setup>` (automatically creates default export)
  - **Bad**: `export { ComponentName }`

---

## Global Types and Declarations

### Global Type Strategy

- **Rule 1.1**: Use global declarations for types used across multiple components.
- **Rule 1.2**: Prefer global types for common UI patterns (Alert, Classes, Props).
- **Rule 1.3**: Keep domain-specific types in their respective modules.

### NestedClasses Pattern

- **Rule 2.1**: Use the `NestedClasses<T>` pattern for component styling.
  ```typescript
  interface Classes extends NestedClasses<Props> {
    outer?: HTMLAttributes['class'];
    wrapper?: HTMLAttributes['class'];
  }
  ```

### Type Safety Best Practices

- **Rule 3.1**: Always provide proper TypeScript types for props, events, and return values.
- **Rule 3.2**: Use strict null checks and avoid `any` types.
- **Rule 3.3**: Leverage type inference where possible, but be explicit when it improves clarity.

---

## Code Quality Standards

### ESLint and Prettier

- **Rule 1.1**: Follow the configured ESLint rules (extends Nuxt defaults).
- **Rule 1.2**: Use Prettier for consistent code formatting.
- **Rule 1.3**: Run linting before commits: `npm run lint`

### Performance Considerations

- **Rule 2.1**: Use `readonly()` for reactive values that shouldn't be mutated externally.
- **Rule 2.2**: Implement proper loading and error states in composables.
- **Rule 2.3**: Use `computed()` for derived state, `ref()` for simple reactive state.

---

## Vue Component Documentation

### Component Comments

- **Rule 1.1**: Use detailed HTML comments for complex components that explain purpose, features, and state flow.
  - **Good**:
    ```vue
    <!--
      REGISTER MAIN STANDARD TEMPLATE
      Usage: Primary registration template for campaigns requiring user registration
      
      Key Features:
      - Dynamic section rendering based on settings
      - State management with useSectionState
      - Registration success flow
      
      State Flow:
      1. Initial state → renders form
      2. On success → switches to 'otp'
      3. On OTP success → switches to 'success'
      4. If expired → switches to 'expired'
    -->
    ```
  - **Bad**:
    ```vue
    <!-- Registration component -->
    ```

### Script Setup Organization

- **Rule 2.1**: Follow consistent ordering in `<script setup>`:

  ```typescript
  // 1. Imports
  // 2. Interface definitions
  // 3. Props destructuring
  // 4. Composables
  // 5. Reactive state
  // 6. Computed properties
  // 7. Functions/methods
  // 8. Provide/inject
  // 9. Watchers
  // 10. Lifecycle hooks
  ```

## Vue Template Patterns

### Provide/Inject Pattern

- **Rule 1.1**: Use descriptive keys for provide/inject that indicate their purpose.
  - **Good**:
    ```typescript
    provide('register', { handleRegisterSuccess });
    provide('otp', { sharedRegisterData, handleRegisterOtpSuccess });
    ```
  - **Bad**:
    ```typescript
    provide('data', { data, handler });
    provide('callbacks', { success, error });
    ```

### Component Registration

- **Rule 2.1**: Use auto-imported components when they're used globally.
- **Rule 2.2**: Prefer explicit imports for components used in single locations.

---

## State Management Patterns

### Reactive References

- **Rule 1.1**: Use descriptive names for shared state that indicate data flow.
  - **Good**: `sharedRegisterData`, `sharedRegisterModel`, `visibleSections`

### Computed Properties for Template Data

- **Rule 2.1**: Use computed properties for derived data used in templates.
  - **Good**:
    ```typescript
    const registerTemplate = computed(() => {
      return settings.value?.pages?.register || [];
    });
    ```

---

## Event Handling Conventions

### Event Handler Naming

- **Rule 1.1**: Prefix event handlers with `handle` + specific action.
  - **Good**: `handleRegisterSuccess`, `handleRegisterOtpSuccess`, `handleFormSubmit`
  - **Bad**: `onSuccess`, `registerDone`, `success`, `submitHandler`

### Success/Error Callbacks

- **Rule 2.1**: Use consistent callback patterns for async operations.

  - **Good**:
    ```typescript
    function handleRegisterSuccess(data: RegisterData) {
      sharedRegisterData.value = data;
      setSectionState('otp');
    }
    ```

- **Rule 2.2**: Include proper type definitions for callback parameters.
- **Rule 2.3**: Handle both success and error cases in event handlers.

---

## Watchers and Lifecycle

### Watcher Patterns

- **Rule 1.1**: Use arrow functions for reactive dependencies to ensure proper reactivity.
- **Rule 1.2**: Provide descriptive variable names in watcher callbacks.

---

## Layout and Styling Conventions

### Layout Components

- **Rule 1.1**: Use descriptive layout names that indicate their purpose.
  - **Good**: `<NuxtLayout name="centered-compact">`, `<NuxtLayout name="full-width">`
  - **Bad**: `<NuxtLayout name="layout1">`, `<NuxtLayout name="main">`

### CSS Classes Structure

- **Rule 2.1**: Use the `cn()` utility for dynamic class binding.

  - **Good**: `:class="cn('flex flex-col gap-8 px-6 pb-12', classes?.wrapper)"`
  - **Bad**: `:class="'flex flex-col gap-8 px-6 pb-12 ' + (classes?.wrapper || '')"`

- **Rule 2.2**: Group related Tailwind classes logically (layout, spacing, colors, etc.).

### Loading States

- **Rule 3.1**: Include loading indicators for dynamic content.

  - **Good**: `<NuxtLoadingIndicator :color="settings?.theme?.colors?.['--accent-500'] || '#a263f0'" />`

---

## Template Complexity Guidelines

### Conditional Rendering

- **Rule 1.1**: Use `v-if/v-else` for mutually exclusive content.
- **Rule 1.2**: Use `v-show` for frequently toggled elements.
- **Rule 1.3**: Prefer computed properties over complex inline expressions.

### Loop Optimization

- **Rule 2.1**: Always use `:key` with meaningful, stable identifiers.

  - **Good**: `:key="section.id"`, `:key="user.uuid"`
  - **Bad**: `:key="index"`, `:key="Math.random()"`

- **Rule 2.2**: Avoid using array index as key unless list order never changes.

---

## Performance Best Practices

### Reactivity Optimization

- **Rule 1.1**: Use `readonly()` for data passed to children that shouldn't mutate parent state.
- **Rule 1.2**: Use `shallowRef()` for large objects that don't need deep reactivity.
- **Rule 1.3**: Use `markRaw()` for objects that should never be reactive.

### Template Performance

- **Rule 2.1**: Use `v-show` for frequently toggled elements (display: none/block).
- **Rule 2.2**: Use `v-if` for conditionally rendered components or expensive content.
- **Rule 2.3**: Avoid complex computations in template expressions.

### Component Registration

- **Rule 3.1**: Use global registration only for frequently used UI components.
- **Rule 3.2**: Prefer local imports for domain-specific components.

---

## Error Handling Standards

### Template Error Boundaries

- **Rule 1.1**: Wrap risky operations in try-catch within async functions.
- **Rule 1.2**: Provide fallback UI for failed state using conditional rendering.

### User Feedback

- **Rule 2.1**: Always provide loading, success, and error states for async operations.
- **Rule 2.2**: Use consistent alert/notification patterns across the application.
- **Rule 2.3**: Include meaningful error messages that help users understand next steps.

---

## Advanced Vue Patterns

### Composable Integration

- **Rule 1.1**: Use composables for reusable stateful logic.
- **Rule 1.2**: Keep component-specific logic in the component, not in composables.
- **Rule 1.3**: Return consistent objects from composables with clear naming.

### Dynamic Component Patterns

- **Rule 2.1**: Use `<component :is="">` for dynamic component rendering.
- **Rule 2.2**: Provide proper TypeScript types for dynamic component props.

### Slot Patterns

- **Rule 3.1**: Use named slots for complex component APIs.
- **Rule 3.2**: Provide default slot content when appropriate.
- **Rule 3.3**: Use scoped slots for passing data from child to parent components.

---
