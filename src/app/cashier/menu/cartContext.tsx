"use client";
import { createContext, useContext, useState } from "react";
import { storeCookie, getCookie } from "@/lib/client-cookie";
import { ICartItem } from "@/app/types";


// interface CartItem {
//   id: number;
//   uuid: string;
//   name: string;
//   price: number;
//   category: string;
//   picture: string;
//   description: string;
//   quantity: number;
// }

interface CartContextType {
  cart: ICartItem[];
  addToCart: (item: ICartItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateNote: (id: number, note: string) => void;
  customer: string;
  table_number: string;
  payment_method: string;
  updateCustomerInfo: (key: "customer" | "table_number" | "payment_method", value: string) => void;
  resetCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const saveCartToCookie = (cart: ICartItem[]) => {
    const cartToSave = cart.map(item => ({
      id: item.id,
      uuid: item.uuid,
      name: item.name,
      price: item.price,
      category: item.category,
      picture: item.picture,
      description: item.description,
      quantity: item.quantity,
      note: item.note || ""
    }));

    console.log("Cart to save:", cartToSave);
    storeCookie("cart", JSON.stringify(cartToSave));
  };

  const [customer, setCustomerName] = useState(() => getCookie("customer") || "");
  const [table_number, setTableNumber] = useState(() => getCookie("table_number") || "");
  const [payment_method, setPaymentMethod] = useState(() => getCookie("payment_method") || "");

  const [cart, setCart] = useState<ICartItem[]>(() => {
    const savedCart = getCookie("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (item: ICartItem) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.some(cartItem => cartItem.id === item.id)
        ? prevCart.map(cartItem => cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem)
        : [...prevCart, {
          ...item,
          quantity: 1,
          uuid: item.uuid || crypto.randomUUID(),
          category: item.category || "Unknown",
          description: item.description || "No description available"
        }];

      saveCartToCookie(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      saveCartToCookie(updatedCart);
      return updatedCart;
    });
  };

  const updateNote = (id: number, note: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === id ? { ...item, note } : item
      );

      saveCartToCookie(updatedCart);
      return updatedCart;
    });
  };

  const resetCart = () => {
    setCart([]);
    setCustomerName("");
    setTableNumber("");
    setPaymentMethod("");
    storeCookie("cart", "");
    storeCookie("customer", "");
    storeCookie("table_number", "");
    storeCookie("payment_method", "");
  };

  const updateCustomerInfo = (key: "customer" | "table_number" | "payment_method", value: string) => {
    if (key === "customer") setCustomerName(value);
    else if (key === "table_number") setTableNumber(value);
    else if (key === "payment_method") setPaymentMethod(value);

    storeCookie(key, value);
  };


  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      updateNote,
      customer,
      table_number,
      payment_method,
      updateCustomerInfo,
      resetCart
    }}>
      {children}
    </CartContext.Provider>
  );

};



export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
