🌍 VatavaranTrack – Waste Collection Tracking System (Frontend)

VatavaranTrack is a role-based waste collection monitoring system that enables staff to submit pickups with proof, supervisors to verify them, and admins to analyze waste data.
This repository contains the frontend web application, built with Next.js + TailwindCSS.

🚀 Live Demo (Frontend)
👉 https://vatavaranapp.vercel.app/
(This is the deployed production build of the frontend)

🔗 Connected Backend API
The frontend communicates with the backend deployed on Render:
👉 https://vatavaran-backend.onrender.com/api

📌 Features (Frontend)
👷 Staff Panel

Submit waste pickups

Capture GPS location

Upload proof photo

View submitted pickups

Edit & delete pending pickups

Paginated pickup history

Sort & filter options

Thumbnail + full-image popup viewer

🧑‍💼 Supervisor Panel (if implemented now or later)

View all staff pickups

Approve or reject submissions

Filter by staff, date, and category

Staff performance summary

🛠 Admin Panel (upcoming or optional)

View all stats

Day-wise, category-wise analytics

Staff management

🔐 Authentication

User signup

Role-based login

JWT stored securely (localStorage)

Auto-redirect based on role

🖼 UI & Tech Stack

Next.js 15 (App Router)

Tailwind CSS

Axios

React Hooks

Responsive UI (mobile + desktop)
