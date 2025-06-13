# Smart Insurance Application Portal

A dynamic React application that allows users to apply for different types of insurance through dynamic forms and manage their applications in a customizable list view.

## Features

### Smart Dynamic Forms

- Dynamic form generation based on API response
- Conditional form fields that appear/disappear based on user input
- Nested sections (e.g., Address, Vehicle Details)
- Dynamic options fetching from API (e.g., states based on country)
- Form validation before submission
- Drag-and-drop field reordering for custom form layouts
- Autosave drafts to prevent data loss
- Dark mode support for better user experience

### Customizable List View

- View submitted applications in a table format
- Dynamic column selection
- Sorting, searching, and pagination support
- Responsive design
- Drag-and-drop column reordering
- Dark mode support

## Setup Instructions

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd devotel-task
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` by default.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

## API Usage

### Base URL

```
https://assignment.devotel.io
```

### Endpoints

1. **Fetch Form Structure**

   - Endpoint: `GET /api/insurance/forms`
   - Purpose: Retrieves the dynamic form structure for insurance applications

2. **Submit Application**

   - Endpoint: `POST /api/insurance/forms/submit`
   - Purpose: Submits the filled insurance application form

3. **Fetch Applications**
   - Endpoint: `GET /api/insurance/forms/submissions`
   - Purpose: Retrieves the list of submitted applications
   - Response includes:
     - Available columns
     - Application data with fields like:
       - Full Name
       - Age
       - Insurance Type
       - City
       - Status

## Assumptions

1. **API Integration**

   - API endpoints are accessible and properly configured
   - API responses follow the specified format
   - CORS is properly configured on the backend

2. **Form Behavior**

   - Form fields are dynamically rendered based on API response
   - Conditional logic is handled client-side
   - Form validation is performed before submission
   - Form drafts are saved locally

3. **List View**

   - All columns are optional and can be toggled
   - Sorting and filtering are handled client-side
   - Pagination is implemented for large datasets
   - Column order can be customized via drag-and-drop

4. **Theme Support**

   - Dark mode preference is saved in local storage
   - Theme switching is smooth and maintains state
   - All components support both light and dark themes
# Smart-Insurance-Application-Portal
# Smart-Insurance-Application-Portal
