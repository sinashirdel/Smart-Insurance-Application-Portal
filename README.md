# Smart Insurance Application Portal

A dynamic insurance application portal built with React, Ant Design, and Tailwind CSS.

## Features

- Dynamic form generation based on API response
- Conditional form fields
- Customizable list view with sortable and filterable columns
- Responsive design
- Modern UI with Ant Design components

## Tech Stack

- React
- Ant Design
- Tailwind CSS
- React Hook Form
- Axios
- React Router
- Lucide React Icons

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- GET `/api/insurance/forms` - Fetch form structure
- POST `/api/insurance/forms/submit` - Submit application
- GET `/api/insurance/forms/submissions` - Fetch submitted applications

## Project Structure

```
src/
  ├── features/
  │   ├── insurance/
  │   │   └── InsuranceForm.jsx
  │   └── applications/
  │       └── ApplicationsList.jsx
  ├── components/
  ├── hooks/
  ├── services/
  ├── utils/
  └── App.jsx
```

## Development

The project uses Vite as the build tool. For development:

```bash
npm run dev
```

For production build:

```bash
npm run build
```
# task-devotel
