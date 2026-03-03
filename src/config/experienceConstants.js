// Experience service constants and configuration

export const EXPERIENCE_CATEGORIES = [
  { value: "TOUR", label: "Tour", color: "badge-primary" },
  { value: "RENTAL", label: "Rental", color: "badge-secondary" },
  { value: "ACTIVITY", label: "Activity", color: "badge-accent" },
];

export const EXPERIENCE_TYPES = [
  { value: "GUIDED_CITY_TOUR", label: "Guided City Tour" },
  { value: "WILDLIFE_SAFARI", label: "Wildlife Safari" },
  { value: "CULTURAL_HERITAGE_TOUR", label: "Cultural Heritage Tour" },
  { value: "FOOD_AND_COOKING_TOUR", label: "Food & Cooking Tour" },
  { value: "ADVENTURE_HIKING", label: "Adventure Hiking" },
  { value: "BOAT_OR_CRUISE_TOUR", label: "Boat / Cruise Tour" },
  { value: "PHOTOGRAPHY_TOUR", label: "Photography Tour" },
  { value: "CAR_RENTAL", label: "Car Rental" },
  { value: "MOTORBIKE_RENTAL", label: "Motorbike Rental" },
  { value: "BICYCLE_RENTAL", label: "Bicycle Rental" },
  { value: "SCOOTER_RENTAL", label: "Scooter Rental" },
  { value: "CAMPING_GEAR_RENTAL", label: "Camping Gear Rental" },
  { value: "WATER_SPORTS_EQUIPMENT", label: "Water Sports Equipment" },
  { value: "SURFING_LESSON", label: "Surfing Lesson" },
  { value: "DIVING_SNORKELING", label: "Diving & Snorkeling" },
  { value: "YOGA_AND_WELLNESS", label: "Yoga & Wellness" },
  { value: "COOKING_CLASS", label: "Cooking Class" },
  { value: "ART_AND_CRAFT_WORKSHOP", label: "Art & Craft Workshop" },
  { value: "ADVENTURE_SPORTS", label: "Adventure Sports" },
];

export const PRICE_UNITS = [
  { value: "PER_PERSON", label: "Per Person" },
  { value: "PER_HOUR", label: "Per Hour" },
  { value: "PER_DAY", label: "Per Day" },
  { value: "FLAT_RATE", label: "Flat Rate" },
];

export const BOOKING_STATUSES = [
  { value: "PENDING", label: "Pending", color: "badge-warning" },
  { value: "ACCEPTED", label: "Accepted", color: "badge-success" },
  { value: "DECLINED", label: "Declined", color: "badge-error" },
  { value: "CANCELLED", label: "Cancelled", color: "badge-ghost" },
  { value: "COMPLETED", label: "Completed", color: "badge-info" },
  { value: "EXPIRED", label: "Expired", color: "badge-neutral" },
];

export const CATEGORY_COLORS = {
  TOUR: "primary",
  RENTAL: "secondary",
  ACTIVITY: "accent",
};

export const STATUS_COLORS = {
  PENDING: "warning",
  ACCEPTED: "success",
  DECLINED: "error",
  CANCELLED: "ghost",
  COMPLETED: "info",
  EXPIRED: "neutral",
};

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_REVIEW_LENGTH = 1000;
export const MIN_RATING = 1;
export const MAX_RATING = 5;
