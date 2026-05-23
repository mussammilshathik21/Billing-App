// ============================================================
// DATA INDEX
// When switching to Supabase, remove this file entirely and
// fetch directly: supabase.from('products').select('*')
// All pages already use the same field names (id, name, price,
// code, category, type, stock, image) so zero other changes needed.
// ============================================================

import freshJuice      from "./freshJuice";
import falooda         from "./falooda";
import milkShake       from "./milkShake";
import icecream        from "./icecream";
import vegBurger       from "./vegBurger";
import nonVegBurger    from "./nonVegBurger";
import pizza           from "./veggiePizza";
import nonVegPizza     from "./nonVegPizza";
import kfcchicken      from "./kfcchicken";
import vegFingerBits   from "./vegFingerBits";
import nonVegFingerBits from "./nonVegFingerBits";
import desserts        from "./desserts";
import salad           from "./salad";
import shawarma        from "./shawarma";
import extra           from "./extra";
import vegSandwich     from "./vegSandwich";
import nonVegSandwich  from "./nonVegSandwich";
import vegFriedRice    from "./vegFriedRice";
import nonVegFriedRice from "./nonVegFriedRice";
import vegNoodles      from "./vegNoodles";
import nonVegNoodles   from "./nonVegNoodles";
import Combos          from "./Combos";

const products = [
  ...freshJuice,
  ...falooda,
  ...milkShake,
  ...icecream,
  ...vegBurger,
  ...nonVegBurger,
  ...pizza,
  ...nonVegPizza,
  ...kfcchicken,
  ...vegFingerBits,
  ...nonVegFingerBits,
  ...desserts,
  ...salad,
  ...shawarma,
  ...extra,
  ...vegSandwich,
  ...nonVegSandwich,
  ...vegFriedRice,
  ...nonVegFriedRice,
  ...vegNoodles,
  ...nonVegNoodles,
  ...Combos,
];

export default products;
