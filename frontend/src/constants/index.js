import { 
  icChatDrawlist, icFilter, icCheckList, icSettings, icWallet, icPayment, icPerson, icManageOrder, icCalendar, icLocationSVG, icUsers, icMenu, icShop, icDashboard, icSearchOrder, 
  icOrderHistory, icNotificationPerference, icOrderLocal, icHelp, icManageMenu, icLogout,
} from 'src/assets';

export const base_url = 'http://pickup-pointe-backend-env.eba-dhvnhmrk.us-east-1.elasticbeanstalk.com';

// Homepage Header Navbar
export const homeFooterNavLinks = [
  {
    href: "vendor-details",
    title: "Vendor Details & Pricing",
  },
  {
    href: "terms-of-service",
    title: "Terms of Service & Privacy Policy",
  },
];

// Secondary-page Header Navbar
export const navLinks = [
  {
    href: "how-it-works",
    title: "How it Works",
  },
  {
    href: "features",
    title: "Features",
  },
  // {
  //   href: "reviews",
  //   title: "Reviews",
  // },
  {
    href: "pricing",
    title: "Pricing",
  },
];

// Vendor Header Navbar
export const vendorHeaderLinks = [
  {
    icon: icDashboard,
    path: "/vendor/dashboard",
    title: "Dashboard",
  },
  {
    icon: icSearchOrder,
    path: "/vendor/search-orders",
    title: "Search orders",
  },
];

// Vendor Sidebar Navbar
export const vendorNavLinks = [
  // {
  //   icon: icDashboard,
  //   path: "/vendor/dashboard",
  //   title: "Dashboard",
  // },
  {
    icon: icCalendar,
    path: "/vendor/order-calendar",
    title: "Order calendar",
  },
  {
    icon: icManageOrder,
    path: "/vendor/manage-orders",
    title: "Manage orders",
  },
  {
    icon: icMenu,
    path: "/vendor/manage-products",
    title: "Manage menu",
  },
  {
    icon: icShop,
    path: "/vendor/manage-shop",
    title: "Manage shop",
  },
  {
    icon: icLocationSVG,
    path: "/vendor/location-details",
    title: "Manage locations",
  },
  {
    icon: icUsers,
    path: "/vendor/manage-users",
    title: "Manage users",
  },
  {
    icon: icShop,
    path: "/vendor/manage-inventory",
    title: "Manage inventory",
  },
  {
    icon: icPerson,
    path: "/vendor/personal-information",
    title: "Account details",
  },
  {
    icon: icWallet,
    path: "/vendor/customer-loyalty",
    title: "Customer loyalty",
  },
  {
    icon: icSettings,
    path: "/vendor/global-settings",
    title: "Global settings",
  },
  {
    icon: icHelp,
    path: "/vendor/support",
    title: "Support",
  },
];

// Shopper Header Navbar
export const shopperHeaderLinks = [
  {
    icon: icOrderLocal,
    path: "/order-local",
    title: "Order local",
  },
  {
    icon: icSearchOrder,
    path: "/shopper/search-order",
    title: "Search order",
  },
  // {
  //   path: "/shopper/find-local-vendors",
  //   title: "Find local vendors",
  // },
];

// Shopper Sidebar Navbar
export const shopperNavLinks = [
  {
    icon: icWallet,
    path: "/shopper/loyalty",
    title: "Loyalty & discounts",
  },
  {
    icon: icOrderHistory,
    path: "/shopper/orders-history",
    title: "Orders history",
  },
  {
    icon: icManageOrder,
    path: "/shopper/active-orders",
    title: "Active orders",
  },
  {
    icon: icPayment,
    path: "/shopper/payment-method",
    title: "Payment method",
  },
  {
    icon: icNotificationPerference,
    path: "/shopper/notifications-preferences",
    title: "Notifications preferences",
  },
  {
    icon: icPerson,
    path: "/shopper/personal-information",
    title: "Personal information",
  },
  {
    icon: icHelp,
    path: "/shopper/support",
    title: "Support",
  },
];

// Merchant Navbar
export const merchantNavLinks = [
  {
    icon: icManageOrder,
    path: "/merchant/all-orders",
    title: "All orders",
  },
  {
    icon: icManageMenu,
    path: "/merchant/manage-items",
    title: "Manage items",
  },
  {
    icon: icChatDrawlist,
    path: "/merchant/chat",
    title: "Chat",
  },
  {
    icon: icSettings,
    path: "/merchant/settings",
    title: "Settings",
  },
];

// Locations for Choose location input
export const locations = [
  { title: 'Chicago Eatery, Chicago, IL' },
  { title: 'New York Grill, NY' },
  { title: 'Miami Diner, Miami, FL' },
  { title: 'San Francisco Café, San Francisco, CA' },
  { title: 'Boston Bistro, Boston, MA' },
  { title: 'Houston Diner, Houston, TX' },
  { title: 'Seattle Grill, Seattle, WA' },
];

export const discountType = {
  "percent-off": "0",
  "dollar-off": "1",
  "one-free": "2",
}

export const scheduleType = {
  "day": "0",
  "week": "1",
  "month": "2",
  "year": "3",
}

export const frequencyType = {
  "every": "0",
  "every-other": "1",
}

export const deliveryTypes = [
  "Pickup",
  "Delivery",
  "PostMail"
]