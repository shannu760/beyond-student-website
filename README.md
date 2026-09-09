# 🌌 BEYOND — Portfolio & Digital Philosophy

> **"BEYOND is more than a portfolio — it's a philosophy."**

At the intersection of **AI, code, design, and cinematic storytelling**, **BEYOND** is the personal digital ecosystem and portfolio of **Shanmukha Krishna**. Built with Next.js 14, Three.js WebGL, Canvas 2D particle dynamics, and Motion View Transitions, it represents a continuous lab for technical precision and visual experimentation.

---

## ⚡ GitHub Repository Description

```text
🌌 BEYOND — The Personal Portfolio & Creative Lab of Shanmukha Krishna. Built with Next.js 14 App Router, Three.js WebGL, Canvas 2D, Tailwind CSS & Motion.
```

---

## ✨ Features & Engineering Highlights

- **3D WebGL Fragment Portal**: High-performance Three.js interactive portal with dynamic lighting, floating fragments, and real-time scroll scaling.
- **Canvas 2D Orbital Arcs**: Custom multi-layered particle orbit renderer with interactive trail physics and signal waves.
- **Motion View Transitions API**: Smooth shared-element view transitions and high-performance scroll triggers powered by `motion/animateView` & `inView`.
- **Performance Engine**:
  - Auto-pausing 3D/2D render loops when out of viewport via `IntersectionObserver`.
  - Capped DPR (`1.5`) & WebGL `powerPreference: 'high-performance'` for 60FPS across desktop & mobile.
  - SWC minification, Brotli response compression, and static asset caching.
- **Direct Client Gmail Integration**: Smart mailto/compose triggers routing inquiries directly to `krishna.addanki.633@gmail.com`.
- **Custom Cinematic 404 Experience**: Dedicated full-viewport video error screen featuring `"Geist Mono:SemiBold"`, text gradient clipping, and BEYOND brand seals.
- **Brand Watermark Badge**: Fixed circular emblem badge with smooth scroll opacity controls.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & UI** | Tailwind CSS v4, Vanilla CSS Design System, Glassmorphism |
| **3D & Graphics** | Three.js, Canvas 2D Context API |
| **Animations** | Motion (`animateView`, `inView`), Framer Motion, Lucide Icons |
| **Video & Media** | CapCut, CapCut Pro, Open Montage, Anti-Gravity Transitions |

---

## 📁 Project Structure

```text
beyond-the-ai-kompany/
├── public/
│   ├── images/              # Portrait, BEYOND seal emblem, logos
│   ├── favicon.ico          # Favicons and web app icons
│   └── icon.png
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout & resource preconnect hints
│   │   ├── page.tsx         # Main portfolio page assembly
│   │   └── not-found.tsx    # Custom 404 video screen
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── PortalCanvas.tsx   # Three.js WebGL Portal
│   │   │   └── OrbitalArcs.tsx    # Canvas 2D Particle Arcs
│   │   ├── hero/
│   │   │   └── HeroSection.tsx    # Interactive Hero Header
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # Fixed Glass Navigation
│   │   │   ├── Footer.tsx         # Editorial Footer
│   │   │   └── Watermark.tsx      # BEYOND Circular Seal Badge
│   │   └── sections/
│   │       ├── AboutSection.tsx   # "Behind Beyond" Editorial Copy
│   │       ├── WorkSection.tsx    # Selected Projects & View Transitions
│   │       ├── LabSection.tsx     # Domain Experimentation Cards
│   │       ├── ContentSection.tsx # Media Platforms (God Editz, Dimensionless)
│   │       ├── SkillsStrip.tsx    # Marquee Tech Stack Strip
│   │       ├── ProcessSection.tsx # 4-Step Creation Methodology
│   │       ├── FreelanceCTA.tsx   # Work Together Call-to-Action
│   │       └── ContactSection.tsx # Direct Gmail Compose Form
│   ├── lib/
│   │   └── data.ts          # Core profile metadata & social links
│   └── styles/
│       └── globals.css      # Design tokens, keyframes & font definitions
├── next.config.mjs          # Next.js performance & header configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shannu760/beyond-portfolio.git
   cd beyond-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📧 Contact & Connect

- **Founder & Creative Technologist**: Shanmukha Krishna
- **Direct Email**: [krishna.addanki.633@gmail.com](https://mail.google.com/mail/?view=cm&fs=1&to=krishna.addanki.633@gmail.com&su=Project%20Inquiry%20%7C%20BEYOND)
- **LinkedIn**: [Shanmukha Krishna](https://www.linkedin.com/in/shanmukha-krishna-2b39b2367/)
- **YouTube Channels**:
  - [GOD EDITZ](https://youtube.com/@godeditz08)
  - [THE_DIMENSIONLESS](https://youtube.com/@the_dimensionless)
- **Instagram**:
  - [@beyond_official_2026](https://www.instagram.com/beyond_official_2026/)
  - [@shanmukha_krishna_03](https://www.instagram.com/shanmukha_krishna_03/)

---

<p align="center">
  <b>BEYOND</b> — Think Beyond. Build Beyond.<br />
  © 2026 Shanmukha Krishna. All Rights Reserved.
</p>
