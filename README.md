# SecureShare - Protected File Sharing Platform

## Overview
SecureShare is a secure file sharing application that allows users to upload and share files with enhanced security features to prevent unauthorized access, copying, or downloading.

## Features
- **Secure Authentication**: Email-based authentication with auto-generated passwords
- **File Management**: Upload, view, and share files securely
- **Security Features**: Watermarking, screenshot prevention, and content protection
- **Sharing Controls**: Expiry dates, password protection, and download prevention
- **User Interface**: Clean dashboard with grid/list views and dark/light mode

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Supabase account for backend services

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/secureshare.git
cd secureshare
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit the `.env` file with your Supabase credentials and other configuration.

4. Start the development server
```bash
npm run dev
```

## Deployment

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations/`
3. Create a storage bucket named `secure-files`
4. Set up appropriate storage policies

### Frontend Deployment
The application can be deployed to any static hosting service:

```bash
npm run build
```

Then deploy the contents of the `dist` folder to your hosting provider.

## Security Considerations
- Client-side security measures (like screenshot prevention) are best-effort and can be circumvented
- For maximum security, implement server-side rendering and DRM solutions
- Always use HTTPS in production
- Implement rate limiting to prevent brute force attacks

## License
MIT
