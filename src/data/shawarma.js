import Cheese from "../assets/Billing website img/Shawarma/Cheese.jpg";
import Chicken from "../assets/Billing website img/Shawarma/Chicken.jpg";
import Panner from "../assets/Billing website img/Shawarma/Panner.jpg";

const shawarma = [
  { id: 151, code: 1701, name: "Cheese Shawarma",         price: 120, image: Cheese,  category: "Shawarma", type: "non-veg", stock: 10 },
  { id: 152, code: 1702, name: "Crispy Chicken Shawarma", price: 100, image: Chicken, category: "Shawarma", type: "non-veg", stock: 10 },
  { id: 153, code: 1703, name: "Panner Shawarma",         price: 120, image: Panner,  category: "Shawarma", type: "veg",     stock: 10 },
];

export default shawarma;
