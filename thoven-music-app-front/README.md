# Thoven Music App

A modern platform connecting music teachers with students for personalized 1-on-1 music lessons.

## Features

- 🎵 Browse and discover qualified music teachers
- 📅 Book personalized music lessons
- 💳 Purchase lesson bundles
- 🗓️ Google Calendar integration
- 👨‍👩‍👧‍👦 Parent dashboard for managing student accounts
- 👩‍🏫 Teacher dashboard for managing availability and lessons

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI with shadcn/ui
- **Backend API**: Ruby on Rails (separate repository)
- **Authentication**: JWT-based auth with Rails backend

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (Rails application)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sidetoolco/thoven-music-app.git
cd thoven-music-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001  # For local development
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Import repository in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your production API URL

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `https://api.thoven.com` |

## API Integration

The application connects to a Rails backend API. Key endpoints include:

- **Authentication**: `/api/v1/auth/*`
- **Teachers**: `/api/v1/teachers/*`
- **Parents**: `/api/v1/parents/*`
- **Bookings**: `/api/v1/parents/bookings/*`
- **Bundles**: `/api/v1/teachers/bundles/*`

## Project Structure

```
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/
│   └── api/         # API service layer
├── public/          # Static assets
└── styles/          # Global styles
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software.

## Support

For support, please contact the development team.