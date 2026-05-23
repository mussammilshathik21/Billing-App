import { useState } from "react";

export default function ProductForm({
  products,
  setProducts
}) {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const addProduct = () => {

    if(!name || !price || !image){
      alert("Fill all fields");
      return;
    }

    const exists = products.find(
      p => p.name.toLowerCase() === name.toLowerCase()
    );

    if(exists){
      alert("Product already exists");
      return;
    }

    setProducts([
      ...products,
      {
        name,
        price:Number(price),
        image
      }
    ]);

    setName("");
    setPrice("");
    setImage("");
  };

  return (
    <div className="form">

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
      />

      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e)=>setImage(e.target.value)}
      />

      <button onClick={addProduct}>
        Add Product
      </button>

    </div>
  );
}