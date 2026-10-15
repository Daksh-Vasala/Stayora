# Stayora

A multi-role rental platform with separate dashboards for **Guests**, **Hosts**, and **Admins**, covering the full reservation lifecycle.

**[Live Demo](https://stayora-frontend.onrender.com/)**

## Features

- **Guest:** browse listings, book stays, chat with the host about an active reservation
- **Host:** manage listings and reservations
- **Admin:** moderate users, listings, and disputes from one dashboard
- **Role-based access control (RBAC)** across all three roles
- **Conflict-free reservations:** availability is validated before a booking is confirmed
- **Scoped chat:** only participants of an active reservation can message each other

## Tech Stack

| Layer    | Tools               |
| -------- | ------------------- |
| Frontend | React.js            |
| Backend  | Node.js, Express.js |
| Database | MongoDB             |
| Auth     | JWT                 |
| Media    | Cloudinary          |

## How It Works

**Reservations:** <!-- TODO: 2-3 sentences. How do you detect overlapping dates, and what stops two simultaneous requests from both succeeding? (e.g. overlap query, unique index, transaction) -->

**Access control:** <!-- TODO: 1-2 sentences. How is the role checked? (e.g. JWT carries the role, middleware guards each route) -->

**Chat:** <!-- TODO: 1 sentence. How is access limited to reservation participants? -->

## Demo Accounts

| Role  | Email                     | Password     |
| ----- | ------------------------- | ------------ |
| Guest | `daksh5@gmail.com`        | `Daksh@123`  |
| Host  | `kushal@gmail.com`        | `Kushal@123` |
| Admin | `dakshvasala89@gmail.com` | `Admin@123`  |

## Run Locally

```bash
git clone https://github.com/Daksh-Vasala/Stayora.git
cd Stayora
```

**Backend**

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

### Environment Variables (backend)

```
PORT=
MONGO_URI=
MAIL_EMAIL=
MAIL_PASSWORD=
JWT_KEY=
CLOUDINARY_KEY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=
CLOUDINARY_URL=
FRONTEND_URL=
RAZORPAY_API_KEY=
RAZORPAY_SECRET_KEY=
SENDGRID_API_KEY=
```

### Environment Variables (frontend)

```
VITE_API_RAZORPAY_KEY_ID=
```

## Author

**Daksh Vasala** · [Portfolio](https://portfolio-ivory-gamma-xs5vp4pxzi.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/daksh-vasala/)
