import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setUser, setPrivateKey } from "../relaysStore";
import { setKey, removeKey } from "../storage";

export default function useLoggedInUser() {
  const dispatch = useDispatch();
  const { privateKey, user } = useSelector((s) => s.relay);

  async function logIn() {
    if (window.nostr) {
      try {
        const pk = await window.nostr.getPublicKey();
        dispatch(setUser(pk));
      } catch (error) {
        console.error(error);
      }
    }
  }

  function logOut() {
    dispatch(setUser());
    dispatch(setPrivateKey());
  }

  useEffect(() => {
    if (user) {
      setKey("pubkey", user);
    } else {
      removeKey("pubkey", user);
    }
  }, [user]);

  useEffect(() => {
    if (privateKey) {
      setKey("privkey", privateKey);
    } else {
      removeKey("privkey");
    }
  }, [privateKey]);

  return { user, logIn, logOut };
}
