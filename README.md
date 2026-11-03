# 🌱 GOODWAVE — Small Actions. Lasting Impact.

GOODWAVE is a community-driven event platform designed to connect people with meaningful social initiatives. Users can discover upcoming events, participate in community activities, and organize events that create a positive impact.

**Live Website:** https://goodwave-wine.vercel.app/

**Backend API:** https://goodwave-server.vercel.app/

## ✨ Key Features

- **User Authentication:** Register and log in using email/password, Google, or GitHub.
- **Upcoming Events:** Browse community events with category filtering and search functionality.
- **Event Details:** View detailed information about individual events.
- **Create Events:** Authenticated users can organize and publish new events.
- **Join Events:** Logged-in users can participate in upcoming events.
- **Joined Events:** View and manage events you have joined.
- **Manage Events:** Organizers can update and delete their own events.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- **Form Validation:** Validate user inputs and event information.
- **Toast Notifications:** Receive feedback for important actions.

## 🛠️ Technologies Used

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Better Auth
- MongoDB
- Lucide React
- Vercel

## 📁 Project Structure

```text
goodwave/
├── app/
│   ├── create-event/
│   ├── events/
│   ├── joined-events/
│   ├── login/
│   ├── manage-events/
│   ├── profile/
│   └── register/
├── components/
│   └── ui/
├── lib/
├── public/
├── types/
├── .env.local
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/abubakar787/goodwave.git
```

### 2. Navigate to the project directory

```bash
cd goodwave
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

For production, configure the appropriate production URLs and credentials in Vercel Environment Variables.

### 5. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🔗 Backend Integration

GOODWAVE communicates with a separate Express.js backend API.

- Local API: `http://localhost:8000`
- Production API: `https://goodwave-server.vercel.app`

## 🚀 Deployment

The frontend is deployed on Vercel.

**Live URL:** https://goodwave-wine.vercel.app/

## 👨‍💻 Developer

**Mohammad Abubakar**

- GitHub: https://github.com/abubakar787
- LinkedIn: https://www.linkedin.com/

---

**GOODWAVE — Small Actions. Lasting Impact.** 🌱
