import { create } from 'zustand';

interface EditModeState {
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;
}

export const useEditMode = create<EditModeState>((set) => ({
  isEditMode: false,
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  setEditMode: (value) => set({ isEditMode: value }),
}));
