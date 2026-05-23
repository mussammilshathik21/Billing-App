import burger from "../assets/Billing website img/Veg burger/Veg burger.jpg";
import panner from "../assets/Billing website img/Veg burger/Panner.jpg";
import nuggets from "../assets/Billing website img/Veg burger/Nuggetsburger.jpg";
import jumbo from "../assets/Billing website img/Veg burger/Jumbo.jpg";

const vegBurger = [
  { id: 40, code: 1801, name: "Veggie patti burger",   price: 95,  image: burger,  category: "Veg Burger", type: "veg", stock: 10 },
  { id: 41, code: 1802, name: "Veggie nuggets burger", price: 100, image: nuggets, category: "Veg Burger", type: "veg", stock: 10 },
  { id: 42, code: 1803, name: "Pannir burger",         price: 120, image: panner,  category: "Veg Burger", type: "veg", stock: 10 },
  { id: 43, code: 1804, name: "Jumbo burger",          price: 160, image: jumbo,   category: "Veg Burger", type: "veg", stock: 10 },
];

export default vegBurger;
