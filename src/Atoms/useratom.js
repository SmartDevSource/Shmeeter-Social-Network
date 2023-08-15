import { atom } from "jotai";

export const userAtom = atom({
  id:null,
  username: '',
  description: '',
  isLogged: false,
});