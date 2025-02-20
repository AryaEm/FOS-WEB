"use client";
import { createContext, useContext, useState } from "react";
import { storeCookie, getCookie, removeCookie } from "@/lib/client-cookie";
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
      quantity: item.quantity
    }));
    
    storeCookie("cart", JSON.stringify(cartToSave)); 
  };

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
            uuid: item.uuid || crypto.randomUUID(), // Tambahkan UUID jika tidak ada
            category: item.category || "Unknown", // Default category jika tidak ada
            description: item.description || "No description available" // Default jika kosong
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

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
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
