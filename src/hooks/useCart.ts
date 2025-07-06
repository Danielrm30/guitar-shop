import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { GuitarT,CartItem } from '../types'

export const useCart = () => {

  const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : []
  };

  const [data] = useState(db);  
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS= 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
   
  const addToCart = (item : GuitarT) => {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id); 
      
    if (itemExists >= 0) {
      //* El item ya existe, incrementamos su cantidad sin mutar directamente
      if(cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = cart.map((guitar, index) =>
        
        index === itemExists
          ? { ...guitar, quantity: guitar.quantity + 1 }
          : guitar
      );
      setCart(updatedCart);
    } else { 
      const newItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]); //* agrega el nuevo elemento inciando con la cantidad de 1
    }
  };

  const removeFromCart = (id: GuitarT['id']) => setCart(prevCart => prevCart.filter( guitar => guitar.id !== id));
  
  const increaseQuantity = (id: GuitarT['id']) => {
    const updatedCart = cart.map( item => {
      if (item.id === id && item.quantity < MAX_ITEMS
      ) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item;
    })
    setCart(updatedCart)
  }

  const decreaseQuantity = (id: GuitarT['id']) => {
    const updatedCart = cart.map( item => {
      if (item.id === id && item.quantity > MIN_ITEMS
      ) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item;
    })
    setCart(updatedCart)
  }

  const clearCart = () => setCart([]);

 //* State Derivado
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const totalPagar = useMemo(() => cart.reduce((total, item) => total + (item.price * item.quantity), 0),[cart]);

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    totalPagar
  }
}