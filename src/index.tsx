import * as React from "react";
import { cartReducer, CartState, Item } from "./cartReducer";

const { createContext, useContext, useReducer } = React;

const initialState: CartState = {
  items: [],
  isEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  totalCost: 0,
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  getItem: () => undefined,
  inCart: () => false,
};

const CartContext = createContext<CartState>(initialState);
export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartState, dispatchCartState] = useReducer(cartReducer, initialState);

  const addItem = (item: Item, quantity: number = 1): void => {
    if (quantity < 1) return;

    if (item.id === undefined)
      throw new Error(`Item object must have an "id" property.`);

    if (item.price === undefined)
      throw new Error(`Item object must have a "price" property.`);

    const currentItem = cartState.items.find((i) => i.id === item.id);

    if (currentItem) {
      const payload = {
        item: { ...item, quantity: currentItem.quantity! + quantity },
        idToUpdate: item.id,
      };

      dispatchCartState({
        type: "UPDATE_ITEM",
        payload,
      });
    } else {
      const payload = { item: { ...item, quantity } };
      dispatchCartState({ type: "ADD_ITEM", payload });
    }
  };

  const removeItem = (id: Item["id"]): void => {
    dispatchCartState({ type: "REMOVE_ITEM", payload: { idToRemove: id } });
  };

  const clearCart = (): void => {
    const payload = { initialCartState: initialState };
    dispatchCartState({ type: "CLEAR_CART", payload });
  };

  const getItem = (id: Item["id"]): Item | undefined =>
    cartState.items.find((item) => item.id === id);

  const inCart = (id: Item["id"]): boolean =>
    cartState.items.some((item) => item.id === id);

  return (
    <CartContext.Provider
      value={{
        ...cartState,
        addItem,
        removeItem,
        clearCart,
        getItem,
        inCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
