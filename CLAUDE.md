# Purple UI Craft - Architecture Documentation

## Project Overview
This is a **surgical reporting web application** built with React, TypeScript, and Vite. It's designed for medical professionals to document and validate surgical procedures in Spanish. The app is built for the Lovable AI platform and integrates with Supabase and external webhook services (n8n) for AI-powered suggestions and validation.

**Tech Stack:**
- **Frontend Framework:** React 18.3 + TypeScript
- **Build Tool:** Vite 5.4
- **Routing:** React Router v6
- **State Management:** React Query (TanStack) v5.83 + local component state
- **UI Library:** shadcn-ui with Radix UI components
- **Styling:** Tailwind CSS 3.4
- **Forms:** React Hook Form + Zod (installed but minimal usage)
- **Notifications:** Sonner (toast notifications)
- **Backend Integration:** Supabase + Edge Functions
- **Development:** Lovable AI platform with component tagging

---

## Directory Structure

```
purple-ui-craft/
├── src/
│   ├── main.tsx                          # React app entry point
│   ├── App.tsx                           # Root component with routing & providers
│   ├── index.css                         # Global Tailwind CSS import
│   ├── vite-env.d.ts                    # Vite environment types
│   │
│   ├── components/
│   │   ├── Header.tsx                    # Header with navigation
│   │   ├── PatientInfo.tsx               # Patient card display
│   │   ├── SurgicalDescription.tsx       # Form: surgical findings & details
│   │   ├── SurgicalIntervention.tsx      # Form: procedures management
│   │   ├── ValidationAlerts.tsx          # Validation feedback UI
│   │   ├── NavLink.tsx                   # Navigation link component
│   │   └── ui/                           # 49 shadcn/ui components
│   │       ├── card.tsx, button.tsx, input.tsx, textarea.tsx
│   │       ├── tabs.tsx, accordion.tsx, alert.tsx
│   │       ├── table.tsx, select.tsx, checkbox.tsx
│   │       └── ... (other Radix UI based components)
│   │
│   ├── pages/
│   │   ├── Index.tsx                     # Main page with tab system
│   │   └── NotFound.tsx                  # 404 page
│   │
│   ├── hooks/
│   │   ├── use-toast.ts                  # Toast notification hook
│   │   └── use-mobile.tsx                # Mobile responsive detection
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts                 # Supabase client initialization
│   │       └── types.ts                  # Auto-generated Database types
│   │
│   ├── lib/
│   │   └── utils.ts                      # cn() utility for Tailwind merging
│   │
│   └── types/
│       └── validation.ts                 # Validation response types
│
├── supabase/                             # Supabase project configuration
├── public/                               # Static assets
├── index.html                            # HTML entry point
│
├── Configuration Files:
├── tsconfig.json                         # TypeScript configuration (paths alias)
├── tsconfig.app.json                     # App-specific TS config
├── tsconfig.node.json                    # Node-specific TS config
├── vite.config.ts                        # Vite build configuration
├── tailwind.config.ts                    # Tailwind CSS configuration
├── components.json                       # shadcn-ui configuration
├── package.json                          # Project dependencies
├── .env                                  # Environment variables (Supabase)
├── eslint.config.js                      # ESLint configuration
├── postcss.config.js                     # PostCSS configuration
└── README.md                             # Project information
```

---

## Key Architectural Patterns

### 1. Application Root Setup (App.tsx)
```
QueryClientProvider (React Query)
└── TooltipProvider (shadcn-ui)
    └── Toaster components (notifications)
        └── BrowserRouter (React Router)
            └── Routes
                ├── Route "/" → Index.tsx
                └── Route "*" → NotFound.tsx
```

**Pattern:** Layered provider pattern for global state management and UI context.

### 2. Page Structure (Index.tsx)
The main page implements a **tab-based architecture** for surgical reporting:

- **Header** - Application branding and navigation
- **PatientInfo** - Static patient details display
- **Tabbed Content:**
  - Tab 1: **Descripción quirúrgica** - Surgical findings form
  - Tab 2: **Intervención practicada** - Procedure management form

**State Management:** Local component state with React hooks (useState) for:
- Active tab selection
- Surgical description fields (hallazgos, detalleQuirurgico, complicaciones)
- Procedure lists (suggestedProcedures, scheduledProcedures, performedProcedures)

### 3. Form Architecture

#### SurgicalDescription Component
**Purpose:** Collects surgical findings, details, and complications
**Form Pattern:** Uncontrolled with external state management
**Validation Flow:**
1. User fills 3 textarea fields
2. Clicks "Siguiente" button
3. Data sent to webhook (n8n service)
4. Validation response received
5. If alerts exist → show ValidationAlerts UI
6. If "alta" (high) severity → block navigation for 5 seconds
7. If "baja/media" (low/medium) → allow continuation with warning

**Key Integration:** n8n webhook configured via `VITE_N8N_WEBHOOK_VALIDATION_URL` environment variable

**Payload Structure:**
```json
{
  "hallazgos": "string",
  "Detalle quirurgico": "string",
  "complicaciones": "string",
  "procedimientos_programados": [
    {
      "codigo": "string",
      "descripcion": "string",
      "via": "string"
    }
  ]
}
```

#### SurgicalIntervention Component
**Purpose:** Manage scheduled and performed surgical procedures
**Features:**
- AI-powered suggestions via Supabase Edge Function
- Add/remove procedures to scheduled list
- Add/remove procedures to performed list
- Procedure tracking with code, name, via, quantity, isPrimary

**Supabase Integration:**
- Calls `suggest-procedures` Edge Function
- Sends: diagnosis, surgeryType, patientInfo
- Receives: array of suggested procedures

**Procedure Interface:**
```typescript
interface Procedure {
  code: string;
  name: string;
  via: string;
  reason?: string;
  quantity?: number;
  isPrimary?: boolean;
}
```

---

## Supabase Integration

### Client Initialization
**File:** `src/integrations/supabase/client.ts`

```typescript
const supabase = createClient<Database>(
  VITE_SUPABASE_URL, 
  VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

**Environment Variables** (from .env):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

### Supabase Types
**File:** `src/integrations/supabase/types.ts`
- Auto-generated Database types from Supabase schema
- Currently contains empty tables definition (schema not yet populated)
- Provides type-safe database queries when schema is populated
- Follows Supabase CLI conventions (auto-updated)

### Usage in Components
- Direct import: `import { supabase } from "@/integrations/supabase/client"`
- Used in SurgicalIntervention for Edge Function invocation
- Not currently used for table operations (tables undefined)

---

## UI Component Library (shadcn-ui)

### Structure
All components located in `src/components/ui/` (49 components total)
Built on **Radix UI** primitives with **Tailwind CSS** styling

### Key Components Used in App
- **Card** - Container for surgical forms
- **Input** - Text fields for procedure search
- **Textarea** - Multi-line text for surgical descriptions
- **Button** - Form actions and navigation
- **Tabs** - Tab switching between description and intervention
- **Table** - Display procedures in lists
- **Select** - Dropdown menus
- **Checkbox** - Multiple selection
- **Label** - Form field labels
- **Accordion** - Collapsible validation alerts
- **Alert** - Display validation messages
- **Badge** - Display severity levels
- **Skeleton** - Loading state placeholders
- **Toast** - Notifications (via Sonner integration)

### Styling System
- **Tailwind CSS** with CSS variables for theming
- **Custom colors:** medical-blue, medical-green (for medical domain)
- **Sidebar colors** for potential future sidebar navigation
- **Dark mode support** via class-based approach
- **Responsive grid** (grid-cols-1 md:grid-cols-2)

---

## Form Handling Patterns

### Current Form Pattern
**Not using react-hook-form or zod currently**, despite being in dependencies.

**Pattern Used:** React state + manual event handlers
```typescript
const [hallazgos, setHallazgos] = useState("");
const handleChange = (e) => setHallazgos(e.target.value);
<Textarea value={hallazgos} onChange={handleChange} />
```

### Validation Strategy
**Webhook-based validation** (not client-side):
1. Form data sent to n8n endpoint
2. n8n processes data (likely calls AI service)
3. Response contains validation alerts with:
   - Field reference
   - Alert type (dato_faltante, dato_incompleto, etc.)
   - Severity level (alto, medio, bajo)
   - Guidance questions

### Type Definitions
**File:** `src/types/validation.ts`
```typescript
interface ValidationAlert {
  campo: string;  // Field name
  tipo: "dato_faltante" | "dato_incompleto" | "dato_confuso" | "inconsistencia";
  descripcion_alerta: string;
  impacto: "alto" | "medio" | "bajo";
  preguntas_guia: string[];  // Guidance questions
}

interface ValidationResponse {
  tiene_alertas: boolean;
  nivel_gravedad_global: "alta" | "media" | "baja";
  alertas: ValidationAlert[];
}
```

---

## Data Flow Architecture

### Flow 1: Surgical Description Validation
```
User Input (3 textareas)
    ↓
Click "Siguiente" button
    ↓
handleNext() → fetch to n8n webhook
    ↓
Validation Response
    ├─ Has Alerts?
    │  ├─ Yes (gravedad=alta) → Block nav, 5s countdown
    │  └─ Yes (gravedad=media/baja) → Warn, allow continue
    └─ No → Proceed to next tab
    ↓
Tab Switch + Toast Notification
```

### Flow 2: AI Procedure Suggestions
```
Click "Generar Sugerencias con IA"
    ↓
supabase.functions.invoke("suggest-procedures")
    ├─ diagnosis: "A013 - FIEBRE PARATIFOIDEA C"
    ├─ surgeryType: "Cirugía urgente"
    └─ patientInfo: "Paciente con anestesia regional..."
    ↓
Receives: suggestions array
    ↓
setSuggestedProcedures() + Toast
    ↓
Display in table with move options
```

### Flow 3: Procedure Movement
```
User clicks move button in Suggested
    ↓
addToScheduled() or addToPerformed()
    ↓
Updates component state
    ↓
Toast confirmation
    ↓
Table updates automatically (React reactivity)
```

---

## State Management Strategy

### React Query Setup
```typescript
const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}>
  {/* App */}
</QueryClientProvider>
```
**Current Usage:** Minimal - mainly for provider setup
**Potential:** Could cache Supabase queries, API calls

### Local Component State
**Primary strategy:** React hooks at page and component level
```typescript
// Index.tsx maintains all shared state
const [activeTab, setActiveTab] = useState("description");
const [hallazgos, setHallazgos] = useState("");
const [scheduledProcedures, setScheduledProcedures] = useState<Procedure[]>([]);
```

**Prop Drilling:** State passed to child components via props
```typescript
<SurgicalDescription 
  hallazgos={hallazgos}
  setHallazgos={setHallazgos}
  // ... other props
/>
```

### No Global State Management
- No Redux, Zustand, Context API (except providers)
- State isolated to page level
- Works for current scope, may need refactor as app grows

---

## Validation & Error Handling

### Alert System
**ValidationAlerts Component:**
- Displays accordion of issues
- Shows severity badges (alto=destructive, medio=default, bajo=secondary)
- Provides guidance questions for each alert
- Visual indicators (icons per alert type)

### Loading States
- **Skeleton components** for AI suggestion loading
- **Loader2 spinners** on buttons during API calls
- **Disabled buttons** to prevent double submission
- **Toast notifications** for feedback

### Error Handling
- Try-catch blocks around API calls
- Toast error messages to user
- Console logging for debugging
- Graceful degradation if Supabase unavailable

---

## Configuration Files

### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // Path alias for imports
    },
    "noImplicitAny": false,
    "noUnusedParameters": false,
    "skipLibCheck": true
  }
}
```
**Pattern:** Loose TS checking for rapid development

### vite.config.ts
```typescript
export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  plugins: [
    react(),
    mode === "development" && componentTagger()  // Lovable integration
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  }
}));
```
**Features:** 
- Component tagging for Lovable AI
- Path alias configuration
- IPv6 support
- Port 8080 for dev server

### tailwind.config.ts
```typescript
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        medical: { blue, green },  // Medical domain colors
        sidebar: { /* ... */ }      // Future sidebar support
      }
    }
  }
}
```

### components.json
```json
{
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```
**Purpose:** shadcn-ui configuration for component generation

---

## Development Workflow

### Project Origin
- **Created via:** Lovable AI platform
- **Repository:** Git-based with automatic commits from Lovable
- **Development mode:** Can edit in IDE or Lovable interface

### Running Locally
```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (port 8080)
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

### Key Dependencies
- **react, react-dom** - UI library
- **react-router-dom** - Client-side routing
- **@tanstack/react-query** - Server state management
- **@supabase/supabase-js** - Backend integration
- **react-hook-form, zod** - Form validation (available, not heavily used)
- **sonner** - Toast notifications
- **lucide-react** - Icon library (49 icons)
- **date-fns** - Date manipulation
- **recharts** - Data visualization (available)

---

## Design Patterns & Conventions

### Component Organization
1. **UI Components** - Reusable from shadcn-ui in `components/ui/`
2. **Feature Components** - Domain-specific (SurgicalDescription, etc.)
3. **Layout Components** - Header, structural elements
4. **Page Components** - Route-level (Index, NotFound)

### Naming Conventions
- **Components:** PascalCase (SurgicalDescription.tsx)
- **Hooks:** use- prefix (use-toast.ts)
- **Utilities:** camelCase (utils.ts)
- **Files:** Consistent with React conventions

### CSS Classes
- **Utility-first:** Tailwind CSS throughout
- **Component merging:** Uses `cn()` utility (clsx + tailwind-merge)
- **Medical styling:** Custom medical-blue, medical-green colors

### Type Safety
```typescript
// Interfaces defined in component files
interface SurgicalInterventionProps { /* ... */ }
interface Procedure { /* ... */ }

// Exported from types folder
export interface ValidationResponse { /* ... */ }
export interface ValidationAlert { /* ... */ }
```

---

## External Service Integrations

### 1. n8n Webhooks

The application uses **two separate n8n webhooks** configured via environment variables:

#### Validation Webhook (SurgicalDescription)
**Environment Variable:** `VITE_N8N_WEBHOOK_VALIDATION_URL`
**Method:** POST
**Purpose:** Surgical description validation with AI
**Security:** URL stored in `.env` (not in version control)
**Request:** Hallazgos, surgical details, complications, scheduled procedures
**Response:** Validation alerts with severity levels

#### Suggestions Webhook (SurgicalIntervention)
**Environment Variable:** `VITE_N8N_WEBHOOK_SUGGESTIONS_URL`
**Method:** POST
**Purpose:** Generate AI-powered procedure suggestions
**Security:** URL stored in `.env` (not in version control)
**Request:** Hallazgos, surgical details, complications, scheduled procedures (all sanitized)
**Response:** Array of suggested procedures with codes, descriptions, and vias

**Security Measures:**
- All inputs sanitized before sending to webhooks
- Zod schema validation before API calls
- Error handling prevents data exposure
- See `SECURITY.md` for detailed security guidelines

### 2. Supabase Edge Functions
**Function:** `suggest-procedures`
**Purpose:** AI-generated procedure suggestions
**Inputs:** diagnosis, surgeryType, patientInfo
**Outputs:** Array of suggested procedures

### 3. Supabase Auth
**Not currently used** but configured for:
- localStorage session persistence
- Auto token refresh
- Future authentication features

---

## Future Considerations

### Scalability Improvements
1. **Replace prop-drilling:** Implement Context API or state management library
2. **Form validation:** Move to react-hook-form + zod (already installed)
3. **API layer:** Create services/queries folder for API calls
4. **Error boundaries:** Add React Error Boundary for crash handling
5. **Testing:** Add vitest, React Testing Library

### Feature Expansion
- Authentication/Authorization system
- Database schema population (currently empty)
- Patient search/selection
- Report export/printing
- Audit logging
- Multi-language support (currently Spanish-only)

### Performance
- Code splitting at route level
- Lazy load modals and heavy components
- Memoization for expensive computations
- Image optimization

---

## Summary

This is a **medical domain web application** focused on surgical reporting with:
- **Simple routing:** Two pages (Index + NotFound)
- **Form-centric architecture:** Two main forms in tabs
- **External validation:** AI-powered via webhook
- **Rich UI:** 49 shadcn-ui components available
- **Minimal state management:** Local component state
- **Lovable AI integration:** Component tagging enabled
- **TypeScript:** Loose configuration for rapid development

The app prioritizes **user-friendly validation feedback** with severity-based navigation blocking and guidance questions to improve data quality.

