// ─── SERVICES ─────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  priceValue: number;
  category: "hair" | "beard" | "grooming" | "packages";
  image: string;
}

export const SERVICES: Service[] = [
  {
    id: "classic-haircut",
    name: "Classic Haircut",
    description: "Clean, timeless haircut tailored to your style. Includes wash, cut, and style.",
    duration: "30 min",
    price: "₹399",
    priceValue: 399,
    category: "hair",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop",
  },
  {
    id: "haircut-beard",
    name: "Haircut + Beard",
    description: "Complete haircut and beard styling combo. Our most popular service.",
    duration: "45 min",
    price: "₹599",
    priceValue: 599,
    category: "packages",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=400&fit=crop",
  },
  {
    id: "beard-styling",
    name: "Beard Styling",
    description: "Precision shaping, trimming, and finishing for a sharp, clean beard.",
    duration: "20 min",
    price: "₹249",
    priceValue: 249,
    category: "beard",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop",
  },
  {
    id: "premium-grooming",
    name: "Premium Grooming",
    description: "Complete grooming experience with haircut, beard, facial, and hot towel.",
    duration: "60 min",
    price: "₹899",
    priceValue: 899,
    category: "grooming",
    image: "https://images.unsplash.com/photo-1585747860019-024afaff00b5?w=600&h=400&fit=crop",
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    description: "Traditional straight razor shave with hot towel treatment and aftershave.",
    duration: "25 min",
    price: "₹349",
    priceValue: 349,
    category: "beard",
    image: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=400&fit=crop",
  },
  {
    id: "kids-haircut",
    name: "Kids Haircut",
    description: "Gentle styling for young gentlemen. Patient and friendly service.",
    duration: "20 min",
    price: "₹249",
    priceValue: 249,
    category: "hair",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=400&fit=crop",
  },
];

// ─── BARBERS ──────────────────────────────────────────────────────────────
export interface Barber {
  id: string;
  name: string;
  position: string;
  specialties: string[];
  experience: string;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
}

export const BARBERS: Barber[] = [
  {
    id: "arjun",
    name: "Arjun",
    position: "Senior Barber",
    specialties: ["Fade Cuts", "Beard Styling", "Modern Haircuts"],
    experience: "8 years",
    rating: 4.9,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    available: true,
  },
  {
    id: "vikram",
    name: "Vikram",
    position: "Lead Stylist",
    specialties: ["Classic Cuts", "Styling", "Precision Fades"],
    experience: "10 years",
    rating: 4.8,
    reviews: 289,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    available: true,
  },
  {
    id: "raj",
    name: "Raj",
    position: "Barber",
    specialties: ["Beard Design", "Hot Towel Shave", "Textured Cuts"],
    experience: "5 years",
    rating: 4.9,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face",
    available: true,
  },
];

// ─── REVIEWS ──────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Rahul M.",
    avatar: "RM",
    rating: 5,
    text: "Best barber experience in the city. Arjun understood exactly what I wanted and delivered a perfect fade. The shop atmosphere is premium and the online booking made everything effortless.",
    date: "2 weeks ago",
  },
  {
    id: "2",
    name: "Amit K.",
    avatar: "AK",
    rating: 5,
    text: "Clean shop, great atmosphere, and the fade was perfect. Highly recommend. The hot towel shave was absolutely relaxing.",
    date: "1 month ago",
  },
  {
    id: "3",
    name: "Priya S.",
    avatar: "PS",
    rating: 5,
    text: "Been coming here for 6 months. Never disappointed. The online booking is so easy and the barbers are true professionals.",
    date: "3 weeks ago",
  },
  {
    id: "4",
    name: "Vikash T.",
    avatar: "VT",
    rating: 5,
    text: "Finally found a barber who knows modern styles. The premium grooming package is worth every rupee. Will keep coming back.",
    date: "1 week ago",
  },
  {
    id: "5",
    name: "Suresh P.",
    avatar: "SP",
    rating: 4,
    text: "Great service and very professional. The waiting room feature is unique and fun. Only suggestion would be slightly faster service during peak hours.",
    date: "2 months ago",
  },
  {
    id: "6",
    name: "Karan D.",
    avatar: "KD",
    rating: 5,
    text: "The best barber shop experience I've had. From booking to the final cut, everything was seamless. The referral program is a great bonus.",
    date: "5 days ago",
  },
];

// ─── PORTFOLIO ────────────────────────────────────────────────────────────
export interface PortfolioItem {
  id: string;
  image: string;
  category: string;
  title: string;
  type: "image" | "before-after";
  beforeImage?: string;
}

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "p1",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=800&fit=crop",
    category: "haircuts",
    title: "Classic Taper Fade",
    type: "image",
  },
  {
    id: "p2",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop",
    category: "fades",
    title: "Skin Fade with Texture",
    type: "image",
  },
  {
    id: "p3",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=800&fit=crop",
    category: "beard",
    title: "Precision Beard Sculpt",
    type: "image",
  },
  {
    id: "p4",
    image: "https://images.unsplash.com/photo-1585747860019-024afaff00b5?w=600&h=600&fit=crop",
    category: "styling",
    title: "Textured Crop",
    type: "image",
  },
  {
    id: "p5",
    image: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=800&fit=crop",
    category: "haircuts",
    title: "Modern Quiff",
    type: "image",
  },
  {
    id: "p6",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    category: "fades",
    title: "Mid Fade Classic",
    type: "before-after",
    beforeImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop",
  },
];

// ─── TIME SLOTS ───────────────────────────────────────────────────────────
export const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
];

export const UNAVAILABLE_SLOTS = ["11:00 AM", "12:00 PM", "2:00 PM", "4:30 PM", "5:00 PM"];

// ─── WAITING ROOM ─────────────────────────────────────────────────────────
export const WAITING_ROOM = {
  yourNumber: 21,
  nowServing: 18,
  estimatedWait: "12 min",
  assignedBarber: "Arjun",
};

// ─── NAVIGATION ───────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Barbers", href: "/barbers" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Reviews", href: "/reviews" },
  { label: "Location", href: "#location" },
];

export const BUSINESS_INFO = {
  name: "BARBER STUDIO",
  tagline: "Premium grooming. Professional barbers. Effortless booking.",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "hello@barberstudio.in",
  address: "42 MG Road, Connaught Place, New Delhi 110001",
  hours: {
    weekday: "10:00 AM – 9:00 PM",
    saturday: "9:00 AM – 9:00 PM",
    sunday: "10:00 AM – 6:00 PM",
  },
  googleRating: 4.9,
  totalReviews: 1247,
  happyClients: "1,000+",
};
