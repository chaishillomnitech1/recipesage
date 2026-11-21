# ScrollVerse Command Hub

## Overview

ScrollVerse Command Hub is a comprehensive full-stack web application designed to manage and track blockchain-based Guardian NFT ecosystems. The application provides real-time monitoring capabilities, administrative controls, and analytics for ceremonial NFT management across multiple tiers (Omni, Gold, Silver, Bronze). Built as a modern web application with React frontend and Express backend, it integrates with PostgreSQL database through Drizzle ORM and includes WebSocket support for real-time updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for client-side routing
- **Real-time Communication**: WebSocket integration for live updates and system metrics
- **Authentication**: Replit-based OAuth authentication system with session management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API architecture with dedicated route handlers
- **Authentication**: Passport.js with OpenID Connect strategy for Replit authentication
- **Session Management**: Express sessions with PostgreSQL store using connect-pg-simple
- **Real-time Features**: WebSocket server integration for live data streaming

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migration System**: Drizzle Kit for database schema management
- **Connection Pooling**: Neon serverless connection pooling with WebSocket support

### Database Schema Design
The system implements a comprehensive schema including:
- User management with Replit authentication integration
- Guardian NFT management with tier-based classification system
- Smart contract tracking and deployment status monitoring
- System metrics collection for performance monitoring
- API endpoint management and testing capabilities
- Real-time logging system with categorized log levels
- Session storage for authentication persistence

### Authentication and Authorization
- **Provider**: Replit OAuth 2.0 with OpenID Connect
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Security**: HTTP-only cookies with secure flag for production
- **User Roles**: Role-based access control with admin and user permissions
- **Route Protection**: Middleware-based authentication checks for protected routes

### External Dependencies
- **Database Hosting**: Neon PostgreSQL serverless platform
- **Authentication Provider**: Replit's OAuth service
- **UI Components**: Radix UI component library
- **Charts and Visualization**: Recharts library for analytics dashboards
- **Development Tools**: Vite for fast development and building, ESBuild for production bundling
- **Real-time Communication**: Native WebSocket API with custom connection management
- **Blockchain Integration**: Prepared for smart contract interaction with Web3 capabilities