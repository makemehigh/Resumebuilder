# Firebase Setup Guide for Resume Builder

This guide will help you set up Firebase for your Resume Builder application.

---

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., "resume-builder")
4. You can disable Google Analytics if you want (optional)
5. Click **"Create project"**
6. Wait for the project to be created, then click **"Continue"**

---

## Step 2: Register Your App

1. In the Firebase dashboard, click the **gear icon** (⚙️) next to **"Project Settings"**
2. Scroll down to **"Your apps"** section
3. Click the **web icon** (`</>`)
4. Register your app:
   - App nickname: `Resume Builder Web`
   - **DO NOT** check "Firebase Hosting"
5. Click **"Register app"**

---

## Step 3: Get Your Firebase Config Values

After registering, you'll see a code snippet with your config. Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**OR follow these steps:**

1. In Project Settings, scroll to **"Your apps"**
2. Click on your registered app
3. You'll see the config values to copy

---

## Step 4: Update .env.local File

1. Open the file: `my-react-app/.env.local`
2. Replace the placeholder values with your actual Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Important:** 
- The variable names MUST start with `NEXT_PUBLIC_` to be accessible in the browser
- Restart your dev server after updating this file

---

## Step 5: Enable Authentication Methods

### Enable Email/Password Auth:
1. In Firebase Console, go to **"Build"** > **"Authentication"**
2. Click **"Get started"**
3. In **"Sign-in method"** tab, click on **"Email/Password"**
4. Enable **"Email/Password"**
5. Optionally enable **"Email link (passwordless sign-in)"**
6. Click **"Save"**

### Enable Google Sign-In:
1. In the same **"Sign-in method"** page
2. Click on **"Google"**
3. Enable it
4. Select your **support email** from the dropdown
5. Click **"Save"**

---

## Step 6: Create Firestore Database (Optional - for saving resumes)

1. In Firebase Console, go to **"Build"** > **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to your users
5. Click **"Enable"**

### Security Rules for Production:

Later, when going to production, update your rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Step 7: Enable Storage (Optional - for profile photos)

1. In Firebase Console, go to **"Build"** > **"Storage"**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Select a location
5. Click **"Done"**

---

## Step 8: Configure Google OAuth Consent Screen

1. Go to **"Build"** > **"Authentication"** > **"Sign-in method"**
2. Click on **"Google"**
3. Click the link to **"OAuth consent screen"** in Google Cloud Console
4. Fill in required fields:
   - App name: Resume Builder
   - User support email: Your email
   - App logo: (optional)
5. Click **"Save and continue"**
6. On Scopes page, click **"Add or Remove Scopes"**
7. Select:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
8. Click **"Save and continue"**
9. Add test users (your Google email) for testing
10. Click **"Save and continue"**

---

## Step 9: Update Authorized Domains

1. In Firebase Console > **"Authentication"** > **"Settings"**
2. Scroll to **"Authorized domains"**
3. Add your domains:
   - `localhost` (for development)
   - `your-domain.com` (for production)

---

## Step 10: Test Your Setup

1. Restart your development server:
   ```bash
   cd my-react-app
   npm run dev
   ```

2. Open [http://localhost:3000/login](http://localhost:3000/login)

3. Try signing up with email/password

4. If using Google sign-in, make sure you added `localhost` to authorized domains

---

## Troubleshooting

### "Firebase App not initialized"
- Make sure `.env.local` has correct values
- Restart the dev server after changes

### "Auth domain not authorized"
- Add `localhost` to authorized domains in Firebase Console

### "Sign-in not allowed"
- Make sure you enabled the sign-in method in Firebase Console

### Environment variables not working
- Variable names MUST start with `NEXT_PUBLIC_`
- File must be `.env.local`, not `.env`

---

## Quick Checklist

- [ ] Created Firebase project
- [ ] Registered web app
- [ ] Copied config to `.env.local`
- [ ] Enabled Email/Password auth
- [ ] Enabled Google auth
- [ ] Added localhost to authorized domains
- [ ] Restarted dev server
- [ ] Tested login/signup

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | `AIzaSyB...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain | `my-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID | `my-resume-app` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | `my-app.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | `1:123...` |

All values can be found in: Firebase Console > ⚙️ Project Settings > Your apps > Web app
