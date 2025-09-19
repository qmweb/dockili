import { create } from 'zustand';

interface MenuState {
  responsiveMenuState: boolean;
  setResponsiveMenuState: (state: boolean) => void;
}

const useMenuStore = create<MenuState>((set) => ({
  responsiveMenuState: false,
  setResponsiveMenuState: (state: boolean) =>
    set({ responsiveMenuState: state }),
}));

export default useMenuStore;
