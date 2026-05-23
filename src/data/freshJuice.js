import Abc from "../assets/Billing website img/Fresh juice/Abc.jpg";
import Apple from "../assets/Billing website img/Fresh juice/Apple.jpg";
import Gingerlime from "../assets/Billing website img/Fresh juice/Gingerlime.jpg";
import Gingersoda from "../assets/Billing website img/Fresh juice/Gingersoda.jpg";
import Limeblue from "../assets/Billing website img/Fresh juice/Limeblue.jpg";
import Limejuice from "../assets/Billing website img/Fresh juice/Limejuice.jpg";
import Limemint from "../assets/Billing website img/Fresh juice/Limemint.jpg";
import Limesoda from "../assets/Billing website img/Fresh juice/Limesoda.jpg";
import Mojitoblue from "../assets/Billing website img/Fresh juice/Mojitoblue.jpg";
import MojitoLimemint from "../assets/Billing website img/Fresh juice/MojitoLimemint.jpg";
import Orange from "../assets/Billing website img/Fresh juice/Orange.jpg";
import Pineapple from "../assets/Billing website img/Fresh juice/Pineapple.jpg";
import Pomegranatemilk from "../assets/Billing website img/Fresh juice/Pomegranatemilk.jpg";
import Pomogranatewater from "../assets/Billing website img/Fresh juice/Pomogranatewater.jpg";
import Rosemilk from "../assets/Billing website img/Fresh juice/Rosemilk.jpg";
import Watermelon from "../assets/Billing website img/Fresh juice/Watermelon.jpg";

// ============================================================
// TO SWITCH TO DB LATER:
// Replace this array with a fetch/query from Supabase
// e.g. const freshJuice = await supabase.from('products').select('*').eq('category','Fresh Juice')
// Fields: id, code, name, price, image, category, type, stock
// ============================================================

const freshJuice = [
  { id: 1,  code: 401, name: "Lime Juice",             price: 35,  image: Limejuice,       category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 2,  code: 402, name: "Lime Mint",              price: 40,  image: Limemint,        category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 3,  code: 403, name: "Lime Blue",              price: 50,  image: Limeblue,        category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 4,  code: 404, name: "Water Melon",            price: 70,  image: Watermelon,      category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 5,  code: 405, name: "Orange",                 price: 80,  image: Orange,          category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 6,  code: 406, name: "Pomegranate(MILK)",      price: 110, image: Pomegranatemilk, category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 7,  code: 407, name: "Apple",                  price: 90,  image: Apple,           category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 8,  code: 408, name: "Pomegranate(WATER)",     price: 40,  image: Pomogranatewater,category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 9,  code: 409, name: "Lemon Soda",             price: 50,  image: Limesoda,        category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 10, code: 410, name: "Mojito Lemon Mint",      price: 80,  image: MojitoLimemint,  category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 11, code: 411, name: "Ginger Lime",            price: 50,  image: Gingerlime,      category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 12, code: 412, name: "Ginger Soda",            price: 50,  image: Gingersoda,      category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 13, code: 413, name: "ABC Juice",              price: 100, image: Abc,             category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 14, code: 414, name: "Mojito Blue Curacco",    price: 80,  image: Mojitoblue,      category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 15, code: 415, name: "Rose Milk",              price: 70,  image: Rosemilk,        category: "Fresh Juice", type: "veg", stock: 10 },
  { id: 16, code: 416, name: "Pine Apple",             price: 70,  image: Pineapple,       category: "Fresh Juice", type: "veg", stock: 10 },
];

export default freshJuice;
