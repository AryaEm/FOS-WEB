"use client";
import { useCart } from "./cartContext";
import Image from "next/image";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="p-4">
      <h2 className="text-white text-2xl mb-4">Order Details</h2>
      {cart.length === 0 ? (
        <p className="text-white">Cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-700 rounded mb-2">
            <Image src={item.picture} width={40} height={40} className="rounded" alt={item.name} />
            <div className="text-white flex-grow px-4">
              <h3>{item.name}</h3>
              <p>Rp {item.price}</p>
            </div>
            <div className="flex items-center">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-red-500 px-2 text-white rounded">-</button>
              <span className="text-white mx-2">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-green-500 px-2 text-white rounded">+</button>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="bg-gray-500 text-white px-2 ml-2 rounded">X</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
