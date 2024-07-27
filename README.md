# SEA Salon Application

This repository contains the SEA Salon Application, a comprehensive web application for managing salon services, bookings, and customer reviews. The application is built using modern web technologies and follows a robust architecture to ensure scalability and maintainability.

## Demo
Accounts for the demo video are:
### Admin
- Email: thomas.n@compfest.id
- Password: Admin123
### User
- Email: user@demo.com
- Password: aaaaaa

Click the image below to watch the demo video on YouTube:
[![demo video](https://img.youtube.com/vi/fuCwaOWZtqI/maxresdefault.jpg)](https://youtu.be/fuCwaOWZtqI)

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Shadcn UI](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS
- [Next Auth](https://next-auth.js.org/) - Authentication and authorization for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases
- [PostgreSQL](https://www.postgresql.org/) - Open-source relational database
- [React Hook Form](https://react-hook-form.com/) - Performant, flexible and extensible forms with easy-to-use validation
- [Zod](https://github.com/colinhacks/zod) - TypeScript-first schema declaration and validation library

## Features

- Home Page: Displays the salon's name, slogan, services offered, and contact details.
- Customer Reviews: Users can leave reviews with a star rating and a comment.
- Reservation System: Users can book appointments for various services.
- Authentication: Users can register and log in to access member-only features.
- Admin Dashboard: Admins can manage services, add new branches, and view reservations.
- Branch Selection: Users can select a branch while making a reservation.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database

## Getting Started

To get this project running locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/mochavin/sea-salon.git
   cd sea-salon
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/sea_salon_db
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

   Replace `username`, `password`, and `sea_salon_db` with your PostgreSQL credentials and database name.

4. Set up the database:

   ```
   npm run db:push
   # or
   yarn db:push
   ```

5. Run the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project can be deployed using various platforms. Here are a few options:

- [Vercel](https://vercel.com/) (recommended for Next.js projects)
- [Netlify](https://www.netlify.com/)

Follow the deployment instructions for your chosen platform, ensuring that you set up the necessary environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
