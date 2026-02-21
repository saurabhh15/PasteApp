# 📋 Pasteboard — Anonymous Paste Manager

A modern **Pastebin-style web app** built with **React, Redux Toolkit, Tailwind CSS & Firebase Cloud**.
Create, edit, view, and manage pastes with a clean editor-style UI — while keeping user identity **anonymous publicly**.

---

## 🚀 Features

✅ Create, update & delete pastes
✅ Anonymous posting system (owner hidden publicly)
✅ Email authentication (Login / Signup modal)
✅ Personal **My Pastes** dashboard
✅ Owner-only Edit & Delete permissions
✅ View paste with line numbers
✅ Copy & share paste links
✅ Search & filter pastes
✅ Responsive editor-style dark UI
✅ Cloud sync using Redux async thunks + Firestore

---

## 🔐 Anonymous Ownership System

Users must login to manage their content, but:

* 👻 Creator identity is **never shown publicly**
* 🔒 Only the owner can edit or delete their pastes
* 📂 Each user has a private **My Pastes** collection

This mimics real anonymous platforms like Pastebin-style apps.

---

## 🧱 Tech Stack

### **Frontend**

* React
* React Router
* Redux Toolkit
* Tailwind CSS
* React Hot Toast

### **Cloud / Backend**

* Firebase Authentication
* Firestore Database

---

## 📂 Project Structure

```
src/
 ├── components/
 │    ├── Navbar.jsx
 │    ├── Home.jsx
 │    ├── Pastes.jsx
 │    ├── ViewPaste.jsx
 │    ├── AuthModal.jsx
 │    └── UserPastes.jsx
 │
 ├── redux/
 │    ├── pasteSlice.js
 │    └── authSlice.js
 │
 ├── firebase.js
 ├── App.jsx
 ├── main.jsx
 └── index.css
```

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone <your-repo-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

## 📱 Responsive Design

Mobile-first layout:

* Sticky responsive navbar
* Adaptive buttons & layout
* Editor UI optimized for phones, tablets & desktop
* Auth modal designed for small screens

---

## ✨ Latest Updates

🆕 Firebase Authentication added
🆕 Login / Signup modal UI
🆕 Anonymous ownership system
🆕 My Pastes dashboard
🆕 Owner-only Edit/Delete controls
🆕 Improved mobile navbar & layout fixes

---

## 🔮 Future Improvements

* Syntax highlighting
* Markdown preview
* Private / expiring pastes
* Theme switching
* Paste folders / tags

---

## 👨‍💻 Author

Built by **Saurabh** as a modern React + Cloud learning project.

---

## 📄 License

This project is open source and free to use.
