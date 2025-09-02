# ESG Questionnaire Frontend

A comprehensive Next.js frontend application for tracking Environmental, Social, and Governance (ESG) metrics across multiple financial years.

## Features

### 🔐 Authentication
- User registration and login with JWT tokens
- Protected routes for authenticated users only
- Secure password hashing and validation

### 📊 ESG Metrics Tracking
- **Environmental Metrics:**
  - Total electricity consumption (kWh)
  - Renewable electricity consumption (kWh)
  - Total fuel consumption (liters)
  - Carbon emissions (T CO2e)

- **Social Metrics:**
  - Total number of employees
  - Number of female employees
  - Average training hours per employee
  - Community investment spend (INR)

- **Governance Metrics:**
  - % of independent board members
  - Data privacy policy status
  - Total revenue (INR)

### 🧮 Auto-Calculated Metrics
- **Carbon Intensity** = Carbon emissions / Total revenue (T CO2e / INR)
- **Renewable Electricity Ratio** = (Renewable electricity / Total electricity) × 100%
- **Diversity Ratio** = (Female employees / Total employees) × 100%
- **Community Spend Ratio** = (Community investment / Total revenue) × 100%

### 📈 Dashboard & Analytics
- Real-time metric calculations
- Interactive charts using Recharts
- Year-over-year trend analysis
- Summary cards with performance indicators

### 📤 Export Functionality
- PDF export with jsPDF
- Excel export with ExcelJS
- Comprehensive reports with calculated metrics

## Technology Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI, Lucide React icons
- **Charts:** Recharts
- **Forms:** React Hook Form with Zod validation
- **HTTP Client:** Axios
- **Authentication:** JWT tokens with localStorage
- **Notifications:** React Toastify

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Main dashboard
│   ├── questionnaire/     # ESG form
│   └── summary/           # Summary and export
├── components/            # Reusable components
│   ├── auth/              # Authentication forms
│   ├── dashboard/         # Dashboard components
│   ├── esg-form/          # ESG questionnaire sections
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. User Registration
- Navigate to `/auth/register`
- Fill in your name, email, and password
- Create your account

### 2. User Login
- Navigate to `/auth/login`
- Enter your credentials
- Access the dashboard

### 3. ESG Questionnaire
- Navigate to `/questionnaire`
- Select a financial year
- Fill in environmental, social, and governance metrics
- View real-time calculated metrics
- Save your data

### 4. Dashboard
- View summary metrics and trends
- Navigate between different financial years
- Analyze performance over time

### 5. Summary & Export
- View comprehensive ESG reports
- Export data to PDF or Excel
- Analyze trends and performance

## API Integration

The frontend integrates with the backend API endpoints:

- **Authentication:** `/api/auth/*`
- **ESG Responses:** `/api/responses/*`
- **Summary Data:** `/api/summary/*`

## Styling & Design

- **Color Scheme:** Professional blue-based theme with semantic colors
- **Typography:** Geist font family for modern readability
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Component Library:** Consistent UI components with proper accessibility

## Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture

### State Management
- React hooks for local state
- Custom hooks for authentication and API calls
- Context-free design for simplicity

### Performance
- Next.js App Router for optimal routing
- Component lazy loading
- Optimized bundle splitting

## Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API base URL
- Ensure all environment variables are set in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the project documentation or create an issue in the repository.
