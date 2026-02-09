# Quintet - Frontend (Next.js)

A modern, responsive learning management interface built with Next.js 14, Tailwind CSS, and Shadcn/UI.

## 🌟 Key Features
- **Role-Based Dashboards**: Customized experiences for Students, Instructors, Admins, and Analysts.
- **Analytics Visualization**: Interactive charts for analysts using Recharts.
- **Form Management**: Robust validation for student signup and administrative tasks.
- **Authentication**: JWT-based session management with persistent React Context.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI (Radix UI)
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file (optional, defaults to localhost:8000):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run Development Server**:
   ```bash
   pnpm dev
   ```

## 🏗 Directory Structure
- `app/`: Routing and pages (organized by role)
- `components/`: Reusable UI components and layout parts
- `lib/api.ts`: API client functions for backend communication
- `lib/auth-context.tsx`: Authentication state management
- `hooks/`: Custom React hooks
- `public/`: Static assets
