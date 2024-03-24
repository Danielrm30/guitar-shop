import { useState,useEffect,useMemo } from "react";
import { db } from '../data/db';

export const useCart = () => {

  //*esta función devuelve un arreglo de objetos si hay algo en el localStorage y si no hay nada, devuelve un array vacío
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]); //* efectos secundarios que ocurren cuándo el state cambia

  const addToCart = (item) => {
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id); //* busca un elemento que cumpla con la condición en la lista de cart. En este caso, la condición es que el id del elemento en el carrito (guitar.id) sea igual al id del nuevo elemento que se quiere agregar (item.id).

    if (itemExists >= 0) {
      //* existe un elemento en el carrito que tiene el mismo id, por lo tanto solo se incrementa la cantidad
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      item.quantity = 1;
      setCart([...cart, item]); //* agregas un elemento a la lista de cart, como un nuevo elemento
    }
  };

  const deleteItem = (id) => {
    setCart(cart.filter((guitar) => guitar.id !== id)); //* conservas los elementos que sean diferentes al id, que deseamos quitar
  };

  const incrementQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const decrementQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  //* State Derivado
  const isEmpty = useMemo( () => cart.length === 0, [cart]);
  const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.price * item.quantity), 0),[cart]);
  

  return {
    data,
    cart,
    addToCart,
    deleteItem,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    isEmpty,
    cartTotal
  };
};
