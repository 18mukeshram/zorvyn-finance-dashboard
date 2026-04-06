# Zorvyn Finance Dashboard

A modern, responsive finance dashboard built as a frontend developer assessment. The project demonstrates clean component architecture, centralized state management, thoughtful UI/UX design, and attention to detail — all built with a production-quality fintech SaaS aesthetic.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-000?logo=npm)

---

## Features

### Dashboard Overview
- **Summary Cards** — Total Balance, Total Income, and Total Expenses displayed with color-coded metrics (indigo, green, red) and icon accents
- **Balance Over Time** — Interactive area chart with gradient fill showing the running balance across all transactions
- **Expenses by Category** — Donut chart breaking down spending by category with percentage tooltips

### Transactions
- Full-featured data table with **search**, **type filter** (All / Income / Expense), and **sortable columns** (Date, Amount)
- Color-coded amount display (+green for income, -red for expenses)
- Type badges for quick visual identification
- **CSV export** of filtered transactions
- Responsive column hiding on smaller screens

### Role-Based UI (Frontend Simulation)
- Toggle between **Admin** and **Viewer** roles via dropdown in the header
- **Admin** can add, edit, and delete transactions
- **Viewer** can only view — all mutating controls are conditionally hidden
- Role badge updates dynamically with icon (Shield / Eye)

### Financial Insights
Four insight cards computed from live transaction data:
- **Highest Spending Category** — identifies the top expense category
- **Monthly Expense Comparison** — shows current month total with trend vs previous month
- **Total Transactions** — count with income/expense breakdown
- **Average Expense** — per expense transaction

### Dark Mode
- Full dark mode support toggled via sun/moon button in the header
- Smooth color transitions across all components
- Persisted across sessions via LocalStorage

### Data Persistence
- All transactions, role selection, and dark mode preference persist in LocalStorage via Zustand's `persist` middleware
- Data hydrates automatically on page load

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI library |
| **Vite 8** | Build tool and dev server |
| **Tailwind CSS 3** | Utility-first CSS framework with custom theme |
| **Recharts** | Composable charting library (Area + Pie charts) |
| **Zustand 5** | Lightweight state management with persist middleware |
| **Lucide React** | Modern icon library |
| **Inter** | Google Font for clean SaaS typography |

---

## Project Structure

```
src/
├── components/
│   ├── AddTransactionModal.jsx   # Modal form for add/edit transactions
│   ├── DarkModeToggle.jsx        # Sun/moon toggle with animation
│   ├── EmptyState.jsx            # Reusable empty state component
│   ├── Filters.jsx               # Search bar, type filter pills, CSV export
│   ├── Insights.jsx              # Financial insights cards
│   ├── RoleToggle.jsx            # Admin/Viewer role switcher
│   ├── SummaryCard.jsx           # Reusable metric card
│   ├── TransactionTable.jsx      # Data table with sort/filter/actions
│   └── charts/
│       ├── BalanceLineChart.jsx   # Area chart — balance over time
│       └── ExpensePieChart.jsx    # Donut chart — expenses by category
├── data/
│   └── mockData.js               # 28 mock transactions + category constants
├── pages/
│   └── Dashboard.jsx             # Main page layout (header + sections)
├── store/
│   └── useFinanceStore.js        # Zustand store + persistence + utilities
├── utils/
│   ├── calculations.js           # Pure financial calculation functions
│   └── csv.js                    # CSV export utility
├── App.jsx                       # Root component with dark mode hydration
├── index.css                     # Tailwind directives + custom component classes
└── main.jsx                      # Entry point
```

---

## State Management

The app uses a single **Zustand store** (`useFinanceStore`) that manages:

- **`transactions`** — Array of transaction objects (CRUD operations)
- **`searchQuery`** — Current search string
- **`filterType`** — Active type filter (`all` | `income` | `expense`)
- **`sortBy`** / **`sortOrder`** — Active sort field and direction
- **`role`** — Current user role (`admin` | `viewer`)
- **`darkMode`** — Dark mode toggle state

### Why Zustand?
- Minimal boilerplate compared to Redux
- No context providers needed — direct hook-based access
- Built-in `persist` middleware for LocalStorage integration
- Clean action pattern without reducers

### Derived Values
Financial summaries (totals, insights) are computed from raw transaction data using pure utility functions in `calculations.js`. This avoids stale derived state and ensures consistency. Filtered/sorted transaction lists are computed inside components via `useMemo` for stable rendering.

---

## Role-Based UI

Role switching is **frontend-only** — it simulates access control without a backend:

| Feature | Admin | Viewer |
|---|---|---|
| View transactions | ✅ | ✅ |
| View charts & insights | ✅ | ✅ |
| Add transaction | ✅ | ❌ |
| Edit transaction | ✅ | ❌ |
| Delete transaction | ✅ | ❌ |

The role is stored in Zustand and components conditionally render action buttons based on `role === 'admin'`. The role persists across page reloads via LocalStorage.

---

## Insights Logic

All insights are computed in real-time from the transaction data:

1. **Highest Spending Category** — Groups expense transactions by category, sums each, and returns the highest
2. **Monthly Expense Comparison** — Groups expenses by month, compares the last two months, and shows the percentage change
3. **Total Transactions** — Simple count with income/expense breakdown
4. **Average Expense** — Total expenses divided by the number of expense transactions

All calculations live in `src/utils/calculations.js` as pure, testable functions.

---

## Design Decisions

- **No sidebar** — Single-page dashboard with a sticky header keeps the layout clean and maximizes content space
- **Custom Tailwind theme** — Extended color tokens (`brand`, `income`, `expense`, `surface`) ensure consistent theming across light and dark modes
- **CSS component classes** — Reusable `.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.badge` classes reduce repetition and ensure consistency
- **`useMemo` over Zustand selectors** for derived arrays — Zustand v5 uses `useSyncExternalStore` which requires stable references; selectors returning new arrays cause infinite loops
- **Hover-reveal actions** — Edit/delete buttons appear on row hover, keeping the table clean while maintaining discoverability
- **Responsive column hiding** — Category and Type columns hide on smaller screens, with category shown under the description on mobile
- **Glassmorphism header** — `backdrop-blur-lg` with semi-transparent background creates a premium, modern feel

---

## How to Run

```bash
# Clone the repository
git clone https://github.com/yourusername/zorvyn-finance-dashboard.git
cd zorvyn-finance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs at `http://localhost:5173` by default.

---

## Browser Support

Tested on modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.

---

Built with care by a frontend engineer who believes dashboards should be both functional and beautiful.
