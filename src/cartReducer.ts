import { CartState, Actions, Item } from "./index.d";

const generateCartState = (
  currentCartState: CartState,
  items: Item[]
): CartState => {
  const totalUniqueItems = calculateUniqueItems(items);
  const isEmpty = totalUniqueItems === 0;

  return {
    ...currentCartState,
    items: calculateItemTotals(items),
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    totalCost: calculateCartTotal(items),
    isEmpty,
  };
};

const calculateItemTotals = (items: Item[]): Item[] => {
  return items.map((item) => ({
    ...item,
    itemTotal: item.price * item.quantity!,
  }));
};

const calculateTotalItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + item.quantity!, 0);

const calculateCartTotal = (items: Item[]): number =>
  items.reduce((total, item) => total + item.quantity! * item.price, 0);

const calculateUniqueItems = (items: Item[]): number => items.length;

export const cartReducer = (state: CartState, action: Actions): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const items = [...state.items, action.payload.item];

      return generateCartState(state, items);
    }
    case "UPDATE_ITEM": {
      const items = state.items.map((item) => {
        if (item.id !== action.payload.idToUpdate) return item;

        return {
          ...item,
          ...action.payload.item,
        };
      });

      return generateCartState(state, items);
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter(
        (item) => item.id !== action.payload.idToRemove
      );

      return generateCartState(state, items);
    }
    case "CLEAR_CART":
      return { ...action.payload.initialCartState };
  }
};