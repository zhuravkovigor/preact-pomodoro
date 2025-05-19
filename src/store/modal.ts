import { signal } from "@preact/signals";

type Modals = {
  settings?: boolean;
};

const modals = signal<Modals>({
  settings: false,
});

export const closeModal = (modal: keyof Modals) => {
  modals.value = {
    ...modals.value,
    [modal]: false,
  };
};

export const openModal = (modal: keyof Modals) => {
  modals.value = {
    ...modals.value,
    [modal]: true,
  };
};

export default modals;
