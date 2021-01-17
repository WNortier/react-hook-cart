export interface Item {
  id: string;
  price: number;
  quantity?: number;
  itemTotal?: number;
}

export interface CartState {
  items: Item[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  totalCost: number;
  addItem: (item: Item, quantity?: number) => void;
  removeItem: (id: Item["id"]) => void;
  clearCart: () => void;
  getItem: (id: Item["id"]) => Item | undefined;
  inCart: (id: Item["id"]) => boolean;
}

export type Actions =
  | { type: "ADD_ITEM"; payload: { item: Item } }
  | { type: "REMOVE_ITEM"; payload: { idToRemove: Item["id"] } }
  | {
      type: "UPDATE_ITEM";
      payload: { item: Item; idToUpdate: Item["id"] };
    }
  | { type: "CLEAR_CART"; payload: { initialCartState: CartState } };

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
