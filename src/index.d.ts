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
