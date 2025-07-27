# CodeFlow AI - Complete SaaS Platform

A comprehensive full-stack SaaS platform that competes with Netlify and Vercel, featuring AI-powered development assistance, visual editors, deployment pipelines, and complete business management tools.

## 🚀 Features

### Core Platform
- **User Authentication** - OAuth2 with GitHub integration
- **Project Management** - Import GitHub repos, create pull requests, manage deployments
- **Visual Editor** - Drag-and-drop interface synced with Monaco code editor
- **AI Assistant (Josey AI)** - Step-by-step coding help, debugging, and app generation
- **Deployment Pipeline** - Preview → Build → Production with real-time logs
- **Domain Management** - Custom domains with clean8.online integration
- **Analytics Dashboard** - Traffic, performance, and usage analytics

### Business Features
- **Billing & Subscriptions** - Stripe integration with Free and Premium tiers
- **Affiliate System** - Multi-tier referral program with automated payouts
- **Social Media Management** - AI-powered content creation and scheduling
- **Team Management** - Collaborative development tools
- **Blog System** - CMS with AI-generated content

### AI-Powered Tools
- **Josey AI Chat** - Integrated AI assistant for development help
- **Code Generation** - AI-powered component and feature generation
- **Content Creation** - Automated social media and blog content
- **Debugging Assistant** - AI-powered error analysis and solutions

## 🛠 Tech Stack

- **Frontend**: React 18 + React Router 6 + TypeScript + Vite
- **Styling**: TailwindCSS + Radix UI components
- **Backend**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: NextAuth.js with GitHub OAuth
- **Payments**: Stripe for subscriptions and billing
- **Code Editor**: Monaco Editor (VS Code engine)
- **Drag & Drop**: React DnD
- **Charts**: Recharts for analytics
- **AI Integration**: OpenAI API (configurable)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeflow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Environment Variables section)

5. **Set up database**
   - Create a Supabase project
   - Run the schema from `schema.sql`
   - Configure Row Level Security policies

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Authentication
NEXTAUTH_URL=http://localhost:8080
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI
OPENAI_API_KEY=your_openai_api_key

# Payments
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=your_premium_price_id

# Deployment
VERCEL_TOKEN=your_vercel_token

# Domain Management
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ZONE_ID=your_cloudflare_zone_id

# Social Media APIs (Optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id
```

## 🗄 Database Schema

The platform uses Supabase with the following main tables:

- **users** - User accounts and subscription info
- **projects** - User projects and GitHub integration
- **ai_edits** - AI usage tracking and limits
- **domains** - Custom domain management
- **deployments** - Deployment history and logs
- **social_posts** - Social media content and scheduling
- **analytics** - Platform usage analytics
- **referrals** - Affiliate tracking and payouts
- **blog_posts** - CMS content management

Run `schema.sql` in your Supabase SQL editor to set up the database.

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t codeflow-ai .
docker run -p 8080:8080 codeflow-ai
```

### Environment-specific Deployments
- **Vercel**: Deploy with `vercel` CLI
- **Netlify**: Deploy with `netlify` CLI  
- **Railway**: Connect GitHub repo for auto-deploy

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/deploy` - Deploy project

### AI Assistant
- `POST /api/ai/chat` - Chat with Josey AI
- `POST /api/ai/generate-code` - Generate code
- `POST /api/ai/debug-code` - Debug assistance

### Billing
- `POST /api/billing/create-checkout-session` - Create Stripe session
- `POST /api/billing/create-portal-session` - Billing portal
- `GET /api/billing/subscription` - Get subscription
- `POST /api/billing/webhook` - Stripe webhooks

### Domains
- `GET /api/domains` - Get user domains
- `POST /api/domains` - Add domain
- `POST /api/domains/:id/verify` - Verify domain

## 🎨 UI Components

The platform includes a comprehensive UI library built on Radix UI:

- **Forms**: Input, Textarea, Select, Checkbox, Radio
- **Navigation**: Navbar, Sidebar, Breadcrumbs, Tabs
- **Feedback**: Toast, Alert, Badge, Progress
- **Overlay**: Dialog, Sheet, Popover, Tooltip
- **Data**: Table, Card, Accordion, Collapsible

## 🤖 AI Integration

### Josey AI Features
- **Code Generation**: Create components, functions, and full features
- **Debugging**: Analyze errors and suggest fixes
- **Content Creation**: Generate social media posts and blog content
- **Step-by-step Guidance**: Interactive development assistance

### Usage Limits
- **Free Tier**: 25 AI edits per month
- **Premium Tier**: 1,000 AI edits per month
- Real-time usage tracking and warnings

## 💰 Subscription Tiers

### Free Plan ($0/month)
- 1 project
- 25 AI edits per month
- Community support
- Basic analytics

### Premium Plan ($29/month)
- Unlimited projects
- 1,000 AI edits per month
- Priority support
- Advanced analytics
- Custom domains
- Team collaboration
- GitHub integration
- Deployment automation

## 🔗 Integrations

### Third-party Services
- **GitHub**: Repository management and OAuth
- **Stripe**: Payment processing and subscriptions
- **Supabase**: Database and authentication
- **Vercel**: Deployment platform
- **OpenAI**: AI-powered features
- **Cloudflare**: Domain and DNS management

### Social Media
- **Facebook**: Post scheduling and analytics
- **Instagram**: Content management
- **Twitter/X**: Automated posting

## 📊 Analytics & Monitoring

- **Traffic Analytics**: Page views, unique visitors, session data
- **Deployment Metrics**: Build times, success rates, deployment frequency
- **Business Metrics**: Revenue, subscriptions, churn rates
- **AI Usage**: Edit counts, feature usage, performance metrics

## 🎯 Affiliate Program

### Commission Tiers
- **Bronze**: 10% commission (0+ referrals)
- **Silver**: 15% commission (10+ referrals)
- **Gold**: 20% commission (25+ referrals)
- **Platinum**: 25% commission (50+ referrals)

### Features
- Real-time tracking
- Automated payouts (minimum $50)
- Custom referral codes
- Performance analytics

## 🛡 Security

- **Row Level Security** on all database tables
- **JWT-based authentication** with secure session management
- **Environment variable protection** for sensitive data
- **Stripe webhook signature verification**
- **CORS protection** and request validation
- **Rate limiting** on API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: https://www.builder.io/c/docs/projects
- **Community**: Join our Discord server
- **Email**: support@codeflow-ai.com
- **GitHub Issues**: Report bugs and feature requests

## 🔮 Roadmap

### Q1 2024
- [ ] Team collaboration features
- [ ] Advanced deployment configurations
- [ ] Mobile app for project management
- [ ] Enhanced AI code review

### Q2 2024
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Automated testing integration
- [ ] Performance monitoring

### Q3 2024
- [ ] Enterprise features
- [ ] White-label solutions
- [ ] Advanced security features
- [ ] API rate limiting tiers

---

Built with ❤️ by the CodeFlow AI team. Powered by clean8.online.
