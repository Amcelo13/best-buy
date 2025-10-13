# Best Buy Dashboard

A modern, interactive dashboard built with Next.js, TypeScript, and Tailwind CSS featuring a multi-step plan selection flow.

## Features

- **Dashboard with 5 tiles**: Dashboard, OfferGrid, Assist, Quiz, and Hot Offers displayed in a responsive grid
- **Interactive Plan Selection**: 
  - Draggable provider logos (Bell & Virgin)
  - New/Existing customer type selection
  - Multi-step form with navigation
- **Subscriber Management**: Interactive counter with visual representation and pricing details
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradients, shadows, and smooth transitions

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js App Router pages
  - `/assist` - Multi-step plan selection flow
  - `/dashboard` - Dashboard analytics page
  - `/offers` - OfferGrid page
  - `/quiz` - Quiz page
  - `/hot-offers` - Hot offers page
- `/src/components` - React components
  - `ProviderSelection.tsx` - Draggable provider selection
  - `SubscriberCount.tsx` - Subscriber counter with pricing

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **React 19** - Latest React features

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
