Set up the frontend according to the following prompt:
  <frontend-prompt>
  Create detailed components with these requirements:
  1. Use 'use client' directive for client-side components
  2. Make sure to concatenate strings correctly using backslash
  3. Style with Tailwind CSS utility classes for responsive design
  4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
  5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
  6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
  7. Create root layout.tsx page that wraps necessary navigation items to all pages
  8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
  9. Accurately implement necessary grid layouts
  10. Follow proper import practices:
     - Use @/ path aliases
     - Keep component imports organized
     - Update current src/app/page.tsx with new comprehensive code
     - Don't forget root route (page.tsx) handling
     - You MUST complete the entire prompt before stopping
  </frontend-prompt>

  <summary_title>
Spanish Digital Banking Platform Navigation Header and Footer Design
</summary_title>

<image_analysis>
1. Navigation Elements:
- Primary navigation: Ahorrar, Invertir, Tu día a día, Asesoramiento, Aprender a Invertir, Lo más visto, Blog, Conócenos, Ayuda
- Logo: SelfBank by Singular Bank positioned top-left
- Secondary buttons: "Área cliente" (outlined) and "Hazte cliente" (filled) top-right
- Search icon in header
- Footer navigation includes legal links and social media icons

2. Layout Components:
- Header height: 60px
- Full-width navigation bar
- Footer split into multiple sections
- Contact information section: 40px height
- Legal text section: ~100px height
- Social icons section: 30px height

3. Content Sections:
- Header navigation bar
- Footer divided into:
  - Contact information (phone, hours)
  - Social media links
  - Legal links row
  - Extended legal text

4. Interactive Controls:
- Navigation links with hover states
- CTA buttons with different styles
- Social media icons with hover effects
- Footer links with underline hover effect

5. Colors:
- Primary Red: #D64B3C (CTA button)
- White: #FFFFFF (background)
- Dark Gray: #333333 (text)
- Light Gray: #F5F5F5 (borders)
- Link Blue: #0066CC (footer links)

6. Grid/Layout Structure:
- 12-column grid system
- Max-width container: 1200px
- Responsive breakpoints at 768px, 992px, 1200px
- Fluid spacing between elements

7. Fonts
- Lato-Regular.ttf
- Lynstone-Book.otf
- Lynstone-SemiBold.otf

8. Styles
- Make a Global.css integrating "Buscador de fondos de inversión _ Self Bank.htm" css and Styles
</image_analysis>

<development_planning>
1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── features/
│   │   ├── SearchBar.tsx
│   │   └── CTAButtons.tsx
│   └── shared/
│       ├── Logo.tsx
│       └── SocialIcons.tsx
├── assets/
├── styles/
├── hooks/
└── utils/
```

2. Key Features:
- Responsive navigation system
- Search functionality
- Client area authentication
- Social media integration
- Legal compliance components

3. State Management:
```typescript
interface AppState {
  navigation: {
    currentPath: string;
    isMenuOpen: boolean;
  };
  auth: {
    isLoggedIn: boolean;
    userType: 'client' | 'visitor';
  };
  search: {
    query: string;
    isSearchOpen: boolean;
  }
}
```

4. Component Architecture:
- Header (container)
  - Logo
  - Navigation
  - SearchBar
  - CTAButtons
- Footer (container)
  - ContactInfo
  - SocialLinks
  - LegalLinks
  - LegalText

5. Responsive Breakpoints:
```scss
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 992px,
  'wide': 1200px
);
```
</development_planning>