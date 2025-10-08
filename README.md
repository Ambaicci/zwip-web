# Zwip Virtual Bank - Modern Digital Banking

A comprehensive virtual banking application built with React, TypeScript, and Vite. Send, receive, invest, and manage your finances with enterprise-grade security.

## Features

-  **Balance Management** - Secure balance visibility with passcode protection
-  **Send Money** - Multi-step flow with contact selection and amount entry  
-  **Receive Money** - QR code and payment request functionality
-  **Banking Services** - Comprehensive financial management
-  **Transactions** - Complete transaction history with filtering
-  **Quick Payments** - Fast payment processing with multiple methods
-  **Modern UI** - Clean, professional design with smooth animations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Inline CSS with design system
- **Icons**: Custom SVG components
- **Backend**: Supabase (PostgreSQL + Auth)

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
\\\ash
# Clone the repository
git clone https://github.com/Ambaicci/zwip-web.git

# Install dependencies
npm install

# Start development server
npm run dev
\\\

### Build
\\\ash
# Build for production
npm run build

# Preview production build
npm run preview
\\\

## Project Structure

\\\
src/
 components/     # Reusable UI components
 store/         # Zustand state management
 theme/         # Design system and theming
 utils/         # Utilities and lazy loading
 [Features]/    # Feature-specific components
\\\

## Deployment

This project is configured for deployment on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the project
2. Create your feature branch (\git checkout -b feature/AmazingFeature\)
3. Commit your changes (\git commit -m 'Add some AmazingFeature'\)
4. Push to the branch (\git push origin feature/AmazingFeature\)
5. Open a Pull Request
