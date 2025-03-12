# **MyCargonaut Web Application**

This is the **web application** codebase for **MyCargonaut**, a ride-sharing and freight-sharing platform that allows users to connect for transportation services. Built with **Next.js**, this app delivers a responsive and efficient experience for desktop and mobile web browsers.

---

## **Table of Contents**

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## **Features**

- User authentication (Login/Register) using JWT.
- Create, edit, and manage offers and requests.
- Search functionality with route filters and date range.
- Real-time tracking of shipments and rides.
- Secure payment processing and transaction history.
- Review and rating system for users and drivers.

---

## **Tech Stack**

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Context API / Redux (if applicable)
- **Backend Communication**: REST and GraphQL
- **Testing**: Jest and Cypress

---

## **Installation**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/BatatiDE/mycargonaut-web.git
   cd mycargonaut-web
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Setup environment variables**:
   Create a `.env.local` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables)).

---

## **Running Locally**

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Access the app**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## **Folder Structure**

```plaintext
.
├── public/              # Public assets (e.g., images, icons)
├── src/
│   ├── app/             # Next.js pages and layouts
│   ├── components/      # Reusable components
│   ├── styles/          # Global and modular CSS files
│   ├── utils/           # Helper functions and utilities
│   ├── types/           # TypeScript type definitions
│   ├── tests/           # Test cases for components and pages
├── .eslintrc.json       # ESLint configuration
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

---

## **Environment Variables**

The web app requires the following environment variables:

| Variable                  | Description                                  |
| ------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`     | Base URL for the backend API                 |
| `NEXT_PUBLIC_MAP_API_KEY` | API key for map services (Google Maps, etc.) |

---

## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
