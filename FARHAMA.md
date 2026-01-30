# FARHAMA - Luxury Scents & Abayaa Website

## Overview
A modern, responsive e-commerce landing page for Farhama, a luxury brand specializing in premium fragrances, elegant abayas, and modest fashion accessories.

## Key Features Implemented

### 1. Single-Page Application with Smooth Scrolling
- All navigation links now scroll smoothly to sections within the home page
- No page refreshes - seamless user experience
- Updated navbar menu items:
  - Home → Hero section
  - Collections → Why Choose Us & Collections grid
  - Products → Product showcase
  - Testimonials → Customer reviews
  - Contact → Contact form

### 2. Authentication System
- **Sign In & Sign Up modals** accessible from navbar
- **Dual account types:**
  - General User: Browse and shop
  - Admin User: Access to admin dashboard
- **Demo Credentials:**
  - Admin: `admin@farhama.com` / `admin123`
  - User: `user@farhama.com` / `user123`
- New accounts can be created with either role
- Admin users are redirected to dashboard upon login

### 3. Admin Dashboard
- Located at `/admin/dashboard`
- Features:
  - Overview with stats (products, orders, users, revenue)
  - Product management (view, add, edit, delete)
  - Order management
  - Customer management
  - Settings
  - Logout functionality
- Protected route - only accessible to admin users

### 4. Auto-Sliding Hero Section
- 3 unique slides with different content:
  - Slide 1: Luxury Collection Overview
  - Slide 2: Premium Fragrances Focus
  - Slide 3: Modest Fashion Highlight
- Auto-advances every 6 seconds
- Manual navigation via indicator dots
- Smooth fade transitions

### 5. Currency Updated to GBP (£)
- All prices now display in British Pounds
- Reflects UK-based business location (Wolverhampton)

### 6. Meaningful Content
- Replaced all Lorem Ipsum with authentic brand messaging
- Product descriptions reflect actual offerings
- Testimonials from realistic customer personas
- Blog posts about fashion tips and fragrance guides
- Contact information updated with UK details

### 7. Restructured Sections
**Removed:**
- Office Locations (not relevant for online-only business)
- Generic shop references

**Updated/Renamed:**
- "Why Us" → "Collections" with better content
- "We Live" → "About Section" with brand story
- Contact section with meaningful copy
- Pricing section → Membership packages

**Section Order:**
1. Hero (with auto-slider)
2. Collections (why choose us + product categories)
3. Products (signature collection)
4. Testimonials (customer reviews)
5. About (brand story + blog)
6. Contact (inquiry form)
7. Pricing (membership packages)
8. Footer

## Technical Improvements

### Responsive Design
- Mobile-first approach
- Breakpoints optimized for all devices
- Touch-friendly navigation

### Performance
- Optimized images with Next.js Image component
- Smooth animations with CSS
- Lazy loading where applicable

### User Experience
- Smooth scroll behavior
- Loading states
- Form validation
- Success/error feedback
- Accessible navigation

## File Structure
```
app/
├── page.tsx                    # Main landing page
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── style.js                    # Styled components
└── admin/
    └── dashboard/
        └── page.tsx            # Admin dashboard

components/
├── navBar.tsx                  # Navigation with auth
├── AuthModal.tsx               # Sign in/up modal
├── footer.tsx                  # Footer with links
├── ui/
│   └── button.tsx              # Button component
└── sections/
    ├── Hero.tsx                # Auto-sliding hero
    ├── Collections.tsx         # Features + collections
    ├── Products.tsx            # Product showcase
    ├── Testimonials.tsx        # Customer reviews
    ├── AboutSection.tsx        # Brand story + blog
    ├── Contacts.tsx            # Contact form
    └── Price.tsx               # Membership packages
```

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start Production
```bash
npm start
```

## Usage Instructions

### For Customers
1. Browse collections by scrolling or using navigation menu
2. Click "Sign Up" to create an account
3. Add products to cart (functionality to be implemented)
4. Contact via form for inquiries

### For Administrators
1. Click "Sign In" in navbar
2. Use admin credentials or create admin account
3. Access dashboard automatically upon login
4. Manage products, orders, and customers
5. View analytics and statistics

## Brand Information
- **Name:** FARHAMA - Scents & Abayaa
- **Location:** Wolverhampton, United Kingdom
- **Contact:** hello@farhama.co.uk
- **Phone:** +44 1902 123456
- **Offerings:**
  - Premium fragrances (Oud, floral, modern scents)
  - Women's abayas and modest fashion
  - Men's refined wear
  - Children's designs (ages 5+)
  - Premium accessories (bags, jewelry, belts)

## Future Enhancements
- Shopping cart functionality
- Payment integration
- User profile pages
- Order tracking
- Product filtering and search
- Reviews and ratings system
- Wishlist feature
- Email notifications
- Inventory management
- Advanced analytics

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License
© 2026 Farhama Scents & Abayaa. All rights reserved.