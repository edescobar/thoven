# Thoven - Music Teacher Platform

A modern web application connecting students with qualified music teachers for online and in-person lessons.

## Project Structure

```
thoven/
├── thoven-music-app-front/    # Next.js frontend application
│   ├── app/                   # Next.js app router pages
│   ├── components/            # React components
│   ├── contexts/              # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and configurations
│   ├── public/                # Static assets
│   ├── styles/                # Global styles
│   └── supabase/              # Database migrations and schemas
└── README.md                  # Project documentation
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel/Railway

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/thoven.git
cd thoven
```

2. Install dependencies:
```bash
cd thoven-music-app-front
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

- Teacher profile management
- Student booking system
- Lesson scheduling
- Bundle purchases and credits
- Real-time availability updates
- Secure payment processing
- Video lesson integration

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Database Schema

The application uses Supabase with the following main tables:
- `teachers` - Teacher profiles and information
- `students` - Student accounts
- `bookings` - Lesson bookings
- `bundles` - Lesson bundles and pricing
- `credit_transactions` - Credit purchase and usage tracking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

For questions or support, please contact the development team.