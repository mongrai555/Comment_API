# Comsci - Computer Science Platform

A modern Next.js website for computer science content and tutorials.

## 🚀 Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Turbopack** - Fast bundler

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🏗️ Build

```bash
npm run build
```

## 🚀 Deployment to Vercel

### Prerequisites
1. Create a [Vercel account](https://vercel.com)
2. Install Vercel CLI: `npm install -g vercel`

### Deploy Steps

#### Option 1: Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? (Y/N)
# - What's your project's name? comsci-platform
# - In which directory is your code? ./
# - Want to override settings? (N)
```

#### Option 2: Using GitHub Integration
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import from GitHub
5. Select your repository
6. Click "Deploy"

### Environment Variables (if needed)
No environment variables required for basic functionality.

### Build Settings
Vercel will automatically detect Next.js and use these settings:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 📁 Project Structure

```
src/
├── app/
│   ├── Component/         # Reusable components
│   ├── posts/            # Blog posts pages
│   ├── about/            # About page
│   ├── admin/            # Admin pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── services/             # API services
└── store/               # State management
```

## 🎨 Features

- **Responsive Design** - Works on all devices
- **Modern UI** - Clean and professional design
- **Fast Performance** - Optimized with Turbopack
- **SEO Friendly** - Built-in Next.js SEO
- **Type Safe** - Full TypeScript support

## 🔧 Development Notes

- The project uses Next.js App Router
- Styling is done with Tailwind CSS
- State management with Zustand
- API calls handled by Axios
- Build warnings are expected and don't affect deployment

## 📝 License

This project is for educational purposes.