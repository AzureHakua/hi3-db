# Prometheus DB - A Honkai Impact 3rd Database (WIP) ⚔️

A comprehensive full-stack web application for managing and exploring Honkai Impact 3rd game equipment data. **Currently live (WIP) and serving the gaming community** with a custom REST API, interactive frontend, and robust database architecture deployed on Fly.io with global accessibility.

## 🚀 Live Demo

[View Live Site](https://hi3.azurehakua.moe/stigmata) | [View Repository](https://github.com/AzureHakua/hi3-db) | [API Documentation](https://hi3.azurehakua.moe/swagger)

## ✨ Key Features

### **Game Data Management**
- **Stigmata Database** - Complete equipment database with position-based stats and set effects
- **Weapon System** - Comprehensive weapon data with skills and stat progression
- **Interactive Search** - Real-time search functionality with HTMX-powered filtering
- **Position Switching** - Dynamic stigmata position viewing with smooth transitions

### **Full-Stack Architecture**
- **Custom REST API** - Elysia.js backend with OpenAPI documentation and Swagger integration
- **Database Operations** - Full CRUD operations with transaction support and data integrity
- **Authentication System** - Secure API key-based authentication for data management
- **Type Safety** - End-to-end TypeScript implementation with Drizzle ORM

### **Modern User Experience**
- **Responsive Design** - Mobile-first design optimized for all devices
- **Interactive Components** - HTMX-powered dynamic content loading without page refreshes
- **Advanced Search** - Real-time filtering with debounced input and partial matching
- **Sidebar Navigation** - Collapsible navigation with mobile/desktop responsiveness

### **Production Infrastructure**
- **Cloud Database** - Turso (libSQL) for scalable, edge-distributed data storage
- **Global Deployment** - Fly.io hosting with automatic scaling and health monitoring
- **CI/CD Pipeline** - GitHub Actions for automated testing and deployment
- **Docker Containerization** - Multi-stage builds for optimized production deployment

## 🛠️ Technology Stack

### **Backend**
- **Bun Runtime** - High-performance JavaScript runtime with native TypeScript support
- **Elysia.js** - Fast, type-safe web framework with built-in OpenAPI generation
- **Drizzle ORM** - Type-safe database toolkit with migration support
- **Turso Database** - Edge-optimized SQLite-compatible database with global replication

### **Frontend**
- **HTMX** - Modern approach to building dynamic web applications
- **JSX/TSX** - Component-based architecture with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Responsive Design** - Mobile-first approach with breakpoint-specific layouts

### **Development & Deployment**
- **TypeScript** - Full type safety across frontend and backend
- **Docker** - Containerized deployment with multi-stage builds
- **Fly.io** - Global application platform with edge deployment
- **GitHub Actions** - Automated CI/CD pipeline for testing and deployment

### **API & Documentation**
- **OpenAPI/Swagger** - Auto-generated API documentation with interactive testing
- **CORS Support** - Cross-origin resource sharing for API accessibility
- **Authentication** - Bearer token-based API security
- **Validation** - Runtime type validation with Elysia's type system

## 🏗️ Architecture

The application follows a modern full-stack architecture with clear separation of concerns:

```
src/
├── backend/
│   ├── db/
│   │   ├── schema.ts              # Drizzle database schemas
│   │   ├── index.ts               # Database connection setup
│   │   └── reset/                 # Database reset utilities
│   └── routes/
│       ├── stigmata.ts            # Stigmata CRUD operations
│       └── weapons.ts             # Weapon CRUD operations
├── components/
│   ├── Stigma.tsx                 # Individual stigmata display
│   ├── StigmataList.tsx           # Stigmata grid layout
│   ├── Weapon.tsx                 # Individual weapon display
│   ├── WeaponList.tsx             # Weapon grid layout
│   ├── Sidebar.tsx                # Navigation sidebar
│   └── Topbar.tsx                 # Top navigation
├── styles/
│   └── tailwind.css               # Tailwind configuration
└── index.tsx                      # Main application entry
```

## 🎯 Key Technical Implementations

### **Database Schema Design**
```typescript
// Relational schema with foreign key constraints
export const stigmata = sqliteTable('stigmata', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const stigmataPositions = sqliteTable('stigmata_positions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  stigmataId: integer('stigmata_id').notNull().references(() => stigmata.id),
  position: text('position').notNull(), // T, M, B positions
  name: text('name').notNull(),
  skillName: text('skill_name'),
  skillDescription: text('skill_description'),
});
```

### **Type-Safe API Operations**
- **Elysia.js Integration** - Runtime type validation with TypeScript inference
- **Transaction Support** - Database operations wrapped in transactions for data integrity
- **Partial Updates** - PATCH operations supporting selective field updates
- **Cascading Operations** - Proper foreign key handling for complex data relationships

### **Interactive Frontend Components**
- **HTMX Integration** - Dynamic content loading with server-side rendering
- **Position Switching** - Real-time stigmata position viewing without page reloads
- **Search Functionality** - Debounced search with live results
- **Responsive Images** - Lazy loading with proper aspect ratios

### **Production Deployment**
- **Multi-Stage Docker** - Optimized builds with dependency caching
- **Health Monitoring** - Fly.io health checks and auto-scaling
- **Database Migrations** - Drizzle Kit for schema versioning and updates
- **Environment Management** - Secure environment variable handling

## 🚀 Getting Started

### Prerequisites
- **Bun 1.0+** - Modern JavaScript runtime
- **Turso Account** - For database hosting
- **Fly.io Account** - For deployment (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AzureHakua/hi3-db.git
cd hi3-db
```

2. **Install dependencies**
```bash
bun install
```

3. **Database setup**
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create database
turso db create hi3

# Get connection details
turso db show hi3
turso db tokens create hi3
```

4. **Environment configuration**
```bash
# Create .env file
TURSO_CONNECTION_URL='libsql://your-database-url'
TURSO_AUTH_TOKEN='your-auth-token'
API_KEY='your-chosen-api-key'
```

5. **Database migration**
```bash
bun run drizzle-kit generate
bun run drizzle-kit migrate
```

6. **Run development server**
```bash
bun dev
```

### Production Build
```bash
bun run build
bun start
```

## 📊 API Endpoints

### **Stigmata Operations**
- `GET /api/stigmata` - Retrieve stigmata with optional search
- `POST /api/stigmata` - Create new stigmata (requires auth)
- `PATCH /api/stigmata/:id` - Update existing stigmata (requires auth)
- `DELETE /api/stigmata/:id` - Delete stigmata (requires auth)

### **Weapon Operations**
- `GET /api/weapon` - Retrieve weapons with optional search
- `POST /api/weapon` - Create new weapon (requires auth)
- `PATCH /api/weapon/:id` - Update existing weapon (requires auth)
- `DELETE /api/weapon/:id` - Delete weapon (requires auth)

### **Query Parameters**
```typescript
// Search examples
GET /api/stigmata?name=Mei&limit=10
GET /api/weapon?id=1
GET /api/stigmata?name[%24like]=%25Kiana%25
```

## 🎮 Data Structure Examples

### **Stigmata Entry**
```json
{
  "id": 249,
  "name": "Senadina: Departure",
  "positions": [
    {
      "id": 562,
      "stigmataId": 249,
      "position": "B",
      "name": "Senadina: Departure (B)",
      "skillName": "Interstellar Voyage",
      "skillDescription": "When the character takes DMG, restores <b>100</b> HP and increases Total DMG by <font color=#00C3FF>20</font>% for <b>5</b>s. CD: <b>10</b>s.",
      "stats": {
        "id": 562,
        "positionId": 562,
        "hp": 261,
        "atk": 26,
        "def": 41,
        "crt": 6,
        "sp": 0
      }
    }
  ],
  "images": [
    {
      "id": 567,
      "stigmataId": 249,
      "position": "B",
      "imgUrl": "public/img/stigmata/Senadina__Departure_B.png"
    }
  ],
  "setEffects": {
    "id": 269,
    "stigmataId": 249,
    "setName": null,
    "twoPieceName": null,
    "twoPieceEffect": null,
    "threePieceName": null,
    "threePieceEffect": null
  }
}
```

## 🔧 Development Highlights

### **Type Safety Implementation**
- **Drizzle ORM** - Database operations with full TypeScript inference
- **Elysia.js** - Runtime validation matching TypeScript types
- **Schema Definitions** - Centralized type definitions for consistent data structures
- **Migration System** - Version-controlled database schema changes

### **Performance Optimizations**
- **Bun Runtime** - Significantly faster than Node.js for server operations
- **Edge Database** - Turso's global replication for reduced latency
- **Lazy Loading** - Image optimization with progressive loading
- **Transaction Batching** - Efficient database operations with rollback support

### **Developer Experience**
- **Hot Reloading** - Instant development feedback with Bun's watch mode
- **API Documentation** - Auto-generated Swagger docs from TypeScript definitions
- **Database Introspection** - Drizzle Studio for visual database management
- **Type-Safe Queries** - Compile-time query validation and IntelliSense support

## 🌐 Deployment Architecture

### **Fly.io Configuration**
- **Auto-scaling** - Dynamic resource allocation based on traffic
- **Health Checks** - Automatic restart on application failures
- **Zero-downtime** - Rolling deployments with traffic shifting
- **Global Edge** - Multi-region deployment for optimal performance

### **Database Architecture**
- **Turso Edge** - SQLite-compatible with global replication
- **Connection Pooling** - Efficient database connection management
- **Backup Strategy** - Automated backups with point-in-time recovery
- **Schema Versioning** - Drizzle migrations for safe schema updates

### **CI/CD Pipeline**
- **GitHub Actions** - Automated testing and deployment on push
- **Docker Registry** - Containerized builds for consistent deployments
- **Environment Isolation** - Separate staging and production environments
- **Rollback Capability** - Quick reversion to previous stable deployments

## 🎯 Real-World Impact & Metrics

**Technical Achievements:**
- **Full-Stack TypeScript** - End-to-end type safety from database to frontend
- **Modern Architecture** - Leveraging cutting-edge tools like Bun and Elysia.js
- **Production Deployment** - Live application serving real gaming community needs
- **Comprehensive API** - RESTful endpoints with proper authentication and validation
- **Responsive Design** - Optimized experience across desktop, tablet, and mobile devices
- **Database Design** - Normalized schema with proper foreign key relationships
- **Interactive UX** - HTMX-powered dynamic content without traditional SPA complexity

**Learning & Growth:**
- **Emerging Technologies** - Early adoption of Bun runtime and Elysia.js framework
- **Database Architecture** - Hands-on experience with modern SQLite-based edge databases
- **API Design** - RESTful API development with OpenAPI documentation
- **DevOps Integration** - Docker containerization and cloud deployment strategies
- **Type-Safe Development** - Advanced TypeScript patterns for runtime validation

## 🔒 Security Features

- **API Authentication** - Bearer token-based access control
- **Input Validation** - Runtime type checking with Elysia's validation system
- **SQL Injection Prevention** - Parameterized queries through Drizzle ORM
- **CORS Configuration** - Controlled cross-origin access policies
- **Environment Security** - Secure handling of database credentials and API keys

## 📱 Responsive Design

- **Mobile-First** - Optimized for smartphone gaming enthusiasts
- **Tablet Adaptation** - Enhanced layouts for medium-screen devices
- **Desktop Experience** - Full-featured interface with expanded navigation
- **Touch Optimization** - Gesture-friendly interactions for mobile users
- **Progressive Enhancement** - Core functionality accessible across all device types

---

*This project demonstrates advanced full-stack development including modern runtime adoption, type-safe API development, edge database architecture, and production deployment strategies for serving gaming community data.*