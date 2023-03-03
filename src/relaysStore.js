import { createSlice } from "@reduxjs/toolkit";
import { getKey, getJsonKey } from "./storage";

const defaultRelays = [
  { url: "wss://relay.snort.social/", options: { read: true, write: true } },
  { url: "wss://relay.damus.io/", options: { read: true, write: true } },
  { url: "wss://nos.lol/", options: { read: true, write: true } },
  {
    url: "wss://relay.nostr.wirednet.jp/",
    options: { read: true, write: true },
  },
  { url: "wss://nostr.wine/", options: { read: true, write: true } },
];

const user = getKey("pubkey");
const privateKey = getKey("privkey");
const relays = getJsonKey(`r:${user}`) ?? defaultRelays;
const follows = getJsonKey(`f:${user}`) ?? [];
const contacts = getJsonKey(`c:${user}`) ?? [];
const badges = [];

const initialState = {
  user,
  privateKey,
  relays,
  follows,
  contacts,
  badges,
};

export const relaySlice = createSlice({
  name: "relays",
  initialState,
  reducers: {
    setRelays: (state, action) => {
      state.relays = action.payload;
    },
    addRelay: (state, action) => {
      state.relays = [...state.relays, action.payload];
    },
    removeRelay: (state, action) => {
      state.relays = state.relays.filter((r) => r.url !== action.payload);
    },
    setRelay: (state, action) => {
      state.selectedRelay = action.payload;
    },
    setFollows: (state, action) => {
      state.follows = action.payload;
    },
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setPrivateKey(state, action) {
      state.privateKey = action.payload;
    },
    setBadges(state, action) {
      state.badges = action.payload;
    },
  },
});

export const {
  setRelays,
  addRelay,
  removeRelay,
  setRelay,
  setUser,
  setPrivateKey,
  setFollows,
  setContacts,
  setBadges,
} = relaySlice.actions;

export default relaySlice.reducer;
