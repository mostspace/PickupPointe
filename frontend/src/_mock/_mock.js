import { sub } from 'date-fns';

// Asset
import { icFoodCategoryHealthy, icFoodCategoryEuropean, icFoodCategoryFastFood, icFoodCategoryPizza, icFoodCategorySoups, icFoodCategoryCoffee, icFoodCategorySushi, icFoodCategoryAsian, icFoodCategoryBreakfast, icFoodCategoryDesserts, icFoodCategoryBurgers, icFoodCategoryTacos, icFoodCategoryMexican, icFoodCategorySandwiches, icFoodCategoryItalian,
  icFoodCategorySteak, icFoodCategoryVegan, icFoodCategorySalads, icFoodCategorySeafood, icFoodCategoryMediterranean, icFoodCategorySmoothies, icFoodCategoryJuices, icFoodCategoryAmerican, icFoodCategoryAlcohol, icFoodCategoryIndian, icFoodCategoryBoba, icFoodCategoryNoodles, icFoodCategoryWraps,
} from 'src/assets';

// Generate IDs
export const _id = [...Array(40)].map(
  (_, index) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`
);

// Mock Data Arrays (example, these should be filled with proper mock data)
export const _ages = [25, 30, 35, 40];
export const _roles = ['Admin', 'User', 'Guest'];
export const _prices = [100, 200, 300, 400];
export const _emails = ['rey@mybusiness.com', 'test2@example.com'];
export const _ratings = [1, 2, 3, 4, 5];
export const _nativeS = [5, 10, 15];
export const _nativeM = [20, 25, 30];
export const _nativeL = [35, 40, 45];
export const _percents = [10, 20, 30];
export const _booleans = [true, false];
export const _lastNames = ['Smith', 'Doe'];
export const _fullNames = ['John Smith', 'Jane Doe'];
export const _tourNames = ['Tour1', 'Tour2'];
export const _jobTitles = ['Developer', 'Designer'];
export const _postTitles = ['Post1', 'Post2'];
export const _firstNames = ['Reynold', 'Jane'];
export const _fullAddress = ['123 Main St', '456 Elm St'];
export const _companyNames = ['Company1', 'Company2'];
export const _productNames = ['Product1', 'Product2'];
export const _phoneNumbers = ['+1 491 5743 284', '098-765-4321'];

// Mock Data Object
export const _mock = {
  id: (index) => _id[index],
  time: (index) => sub(new Date(), { days: index, hours: index }),
  boolean: (index) => _booleans[index],
  role: (index) => _roles[index],
  // Text
  postTitle: (index) => _postTitles[index],
  jobTitle: (index) => _jobTitles[index],
  tourName: (index) => _tourNames[index],
  productName: (index) => _productNames[index],
  // Contact
  email: (index) => _emails[index],
  phoneNumber: (index) => _phoneNumbers[index],
  fullAddress: (index) => _fullAddress[index],
  // Name
  firstName: (index) => _firstNames[index],
  lastName: (index) => _lastNames[index],
  fullName: (index) => _fullNames[index],
  companyName: (index) => _companyNames[index],
  // Number
  number: {
    percent: (index) => _percents[index],
    rating: (index) => _ratings[index],
    age: (index) => _ages[index],
    price: (index) => _prices[index],
    nativeS: (index) => _nativeS[index],
    nativeM: (index) => _nativeM[index],
    nativeL: (index) => _nativeL[index],
  },
};

export const foodCategories = [
  {
    icon: icFoodCategoryAlcohol,
    name: 'Alcohol',
  },
  {
    icon: icFoodCategoryAmerican,
    name: 'American',
  },
  {
    icon: icFoodCategoryAsian,
    name: 'Asian',
  },
  {
    icon: icFoodCategoryBoba,
    name: 'Boba',
  },
  {
    icon: icFoodCategoryBreakfast,
    name: 'Breakfast',
  },
  {
    icon: icFoodCategoryBurgers,
    name: 'Burgers',
  },
  {
    icon: icFoodCategoryCoffee,
    name: 'Coffee',
  },
  {
    icon: icFoodCategoryDesserts,
    name: 'Desserts',
  },
  {
    icon: icFoodCategoryEuropean,
    name: 'European',
  },
  {
    icon: icFoodCategoryFastFood,
    name: 'Fast Food',
  },
  {
    icon: icFoodCategoryHealthy,
    name: 'Healthy',
  },
  {
    icon: icFoodCategoryIndian,
    name: 'Indian',
  },
  {
    icon: icFoodCategoryItalian,
    name: 'Italian',
  },
  {
    icon: icFoodCategoryJuices,
    name: 'Juices',
  },
  {
    icon: icFoodCategoryMexican,
    name: 'Mexican',
  },
  {
    icon: icFoodCategoryNoodles,
    name: 'Noodles',
  },
  {
    icon: icFoodCategoryPizza,
    name: 'Pizza',
  },
  {
    icon: icFoodCategorySalads,
    name: 'Salads',
  },
  {
    icon: icFoodCategorySandwiches,
    name: 'Sandwiches',
  },
  {
    icon: icFoodCategorySeafood,
    name: 'Seafood',
  },
  {
    icon: icFoodCategorySmoothies,
    name: 'Smoothies',
  },
  {
    icon: icFoodCategorySoups,
    name: 'Soups',
  },
  {
    icon: icFoodCategorySteak,
    name: 'Steak',
  },
  {
    icon: icFoodCategorySushi,
    name: 'Sushi',
  },
  {
    icon: icFoodCategoryTacos,
    name: 'Tacos',
  },
  {
    icon: icFoodCategoryVegan,
    name: 'Vegan',
  },
  {
    icon: icFoodCategoryWraps,
    name: 'Wraps',
  },
  {
    icon: icFoodCategoryMediterranean,
    name: 'Mediterranean',
  },
];