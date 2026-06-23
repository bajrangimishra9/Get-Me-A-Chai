# GetMeAChai ☕

<img width="1892" height="861" alt="Screenshot 2026-06-24 005104" src="https://github.com/user-attachments/assets/c1dbc786-652f-4ffe-a5f3-4a84952ed942" />


##

https://github.com/user-attachments/assets/1501973d-aa2b-4f5b-89c8-581ac06031f7

##

GetMeAChai is a full-stack creator support platform that allows creators, students, developers, and communities to receive support from their audience through a simple and transparent payment experience.

The platform gives each creator a personalized public profile where supporters can contribute, leave a message, and appear in a verified supporters list after payment approval.

## Overview

GetMeAChai is designed to make small creator contributions easy and meaningful. Creators can set up their profile, add payment details, share their page, and receive support directly from their audience.

Supporters can contribute using the available payment options, submit their transaction details, and once the payment is verified, their support is displayed publicly on the creator profile.

The platform focuses on a clean interface, secure authentication, reliable data handling, and an admin-controlled verification workflow.

## Key Features

* GitHub authentication using NextAuth
* Public creator profile pages
* Creator dashboard for profile management
* UPI QR based payment support
* Razorpay credential support
* Admin payment verification system
* Verified supporters section
* Global supporter engagement display
* Dynamic platform statistics
* Role-based admin access
* Responsive user interface
* Dynamic browser tab titles
* MongoDB-backed data persistence

## Core Modules

### Public Creator Profile

Each creator gets a public profile page that displays:

* Cover image
* Profile image
* Username
* Platform engagement statistics
* Top verified supporters
* Payment form
* UPI QR payment option

Supporters can enter their name, message, amount, and payment reference details before submitting their support.

### Dashboard

The dashboard allows creators to manage their public profile and payment information.

Creators can update:

* Name
* Email
* Username
* Profile picture
* Cover picture
* UPI QR image
* Razorpay Key ID
* Razorpay Secret

After saving, the dashboard shows a clean saved-details preview with an option to edit the information again.

### Payment System

GetMeAChai supports UPI QR based payments and Razorpay credential configuration.

Creators can add their UPI QR image for direct UPI payments. Razorpay fields are also available in the dashboard, so creators with valid Razorpay credentials can configure gateway-based payment support.

### Payment Verification

Payments submitted by supporters are stored for admin review. The admin can verify or reject each payment.

Only verified payments are shown publicly in the supporters section. This keeps the public supporter list clean, genuine, and trustworthy.

### Admin Panel

The admin panel provides a dedicated interface to manage payment verification.

Admins can:

* View submitted payments
* Review supporter details
* Check payment amount and transaction reference
* Verify valid payments
* Reject invalid payments
* Control which payments appear publicly

## Tech Stack

* Next.js
* React
* Tailwind CSS
* NextAuth
* MongoDB
* Mongoose

## Project Structure

```txt
GetMeAChai/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── payments/
│   │   ├── admin/
│   │   └── stats/
│   ├── [username]/
│   ├── dashboard/
│   ├── admin/
│   ├── about/
│   ├── login/
│   ├── layout.tsx
│   └── page.jsx
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── sessionWrapper.jsx
├── db/
│   └── connectDb.js
├── models/
│   ├── User.js
│   └── Payments.js
├── public/
│   └── assets
└── README.md
```

## Environment Variables

Create an environment configuration file and add the required values:

```env
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_application_url
MONGODB_URI=your_mongodb_connection_string
ADMIN_EMAILS=admin@example.com
```

Keep environment variables private and never commit them to version control.

## Installation

Install the dependencies:

```bash
npm install
```

Run the project in development mode:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production build:

```bash
npm start
```

## Payment Flow

The payment flow is designed to be simple and reliable:

1. A supporter visits a creator profile.
2. The supporter enters their name, message, and contribution amount.
3. The supporter completes the payment using the available payment option.
4. The supporter submits the transaction reference or UTR.
5. The payment is stored for admin review.
6. Admin verifies the payment.
7. Once verified, the supporter appears publicly in the supporters section.

## Razorpay Support

Razorpay support is included through dashboard-based credential configuration.

Creators who have valid Razorpay credentials can add their Razorpay Key ID and Secret from the dashboard. Once configured, the project is ready to support Razorpay-based payment workflows along with the existing UPI QR payment flow.

## Authentication and Roles

Authentication is handled using NextAuth with GitHub OAuth.

User roles are managed through configured admin emails. Regular users can manage their creator profile and receive support, while admin users can access the payment verification panel.

## Data Models

The project mainly uses two MongoDB collections.

### User

Stores creator profile and account details such as name, email, username, profile image, cover image, UPI QR image, Razorpay credentials, and role.

### Payment

Stores supporter payment records including supporter name, message, amount, transaction reference, payment status, target user, and verification state.

## Security

* Sensitive configuration is handled through environment variables.
* Razorpay secrets are not displayed publicly.
* Admin-only routes are protected using role-based checks.
* Payments appear publicly only after verification.
* Duplicate profile values such as email and username are validated before saving.

## Future Scope

* Razorpay checkout UI integration
* Creator-specific analytics
* Email notifications for payment updates
* Image upload support
* Public creator discovery page
* Enhanced admin reporting
* Payment history dashboard

## Purpose

GetMeAChai demonstrates a practical full-stack product with authentication, profile management, database persistence, payment configuration, admin verification, and responsive UI design.

It is built to show how a creator-support platform can be structured with a clean frontend, reliable backend, and secure role-based workflows.

## License

This project is intended for educational, portfolio, and demonstration purposes.
