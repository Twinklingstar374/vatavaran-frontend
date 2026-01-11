# Vatavaran - Waste Management Platform (Frontend)

Vatavaran is a comprehensive waste management platform designed to streamline collection, tracking, and processing of urban waste. This repository contains the client-side application built with modern web technologies to provide role-based interfaces for Staff, Supervisors, and Admin users.

## 🚀 Key Features

*   **Role-Based Access Control (RBAC)**: Secure, distinct dashboards for Admins, Supervisors, and Field Staff.
*   **Interactive Maps**: Real-time visualization of collection points and routes using Leaflet.
*   **Data Visualization**: Insightful charts and metrics for waste analysis using Chart.js.
*   **AI-Assisted Classification**: Integrated assistive tool to suggest waste categories (e.g., Plastic, Organic) from images to speed up data entry.
*   **Responsive Design**: Mobile-first interface optimized for field operations.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Library**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
*   **Charts**: [Chart.js](https://www.chartjs.org/)
*   **State & Networking**: Axios, React Hooks

## 🔗 Related Repositories

*   **Backend API**: [Run the Backend Server](https://github.com/yourusername/vatavaran-backend)

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18+)
*   NPM or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/vatavaran-frontend.git
    cd vatavaran-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:4000/api
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Support & Demo Access

For demo access or support inquiries, please contact the repository owner.

**Role Types:**
*   **Admin**: Full platform oversight.
*   **Supervisor**: Route and staff management.
*   **Staff**: Field collection and data entry.
