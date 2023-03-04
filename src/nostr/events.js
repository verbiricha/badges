import {
  getEventHash,
  signEvent as signEventWithPrivateKey,
} from "nostr-tools";
import { Buffer } from "buffer";
import { bech32ToHex, decodeNaddr } from "./encoding";
import { findTag, findTags } from "./tags";

function processContent(ev, replaceTags) {
  const replaceNpub = (match: string) => {
    try {
      const hex = bech32ToHex(match);
      const idx = ev.tags.length;
      ev.tags.push(["p", hex, idx]);
      return `#[${idx}]`;
    } catch (error) {
      return match;
    }
  };
  const replaceNaddr = (match: string) => {
    try {
      const { k, pubkey, d } = decodeNaddr(match);
      const idx = ev.tags.length;
      ev.tags.push(["a", `${k}:${pubkey}:${d}`, idx]);
      return `#[${idx}]`;
    } catch (error) {
      return match;
    }
  };
  const replaceNoteId = (match: string) => {
    try {
      const hex = bech32ToHex(match);
      const idx = ev.tags.length;
      ev.tags.push(["e", hex, idx]);
      return `#[${idx}]`;
    } catch (error) {
      return match;
    }
  };
  const replaceHashtag = (match: string) => {
    const tag = match.slice(1);
    const idx = ev.tags.length;
    ev.tags.push(["t", tag, idx]);
    return `#[${idx}]`;
  };
  const replaced = ev.content
    .replace(/\bnpub1[a-z0-9]+\b(?=(?:[^`]*`[^`]*`)*[^`]*$)/g, replaceNpub)
    .replace(/\bnote1[a-z0-9]+\b(?=(?:[^`]*`[^`]*`)*[^`]*$)/g, replaceNoteId)
    .replace(/\bnaddr1[a-z0-9]+\b(?=(?:[^`]*`[^`]*`)*[^`]*$)/g, replaceNaddr);
  ev.content = replaceTags
    ? replaced.replace(
        /(#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+)/g,
        replaceHashtag
      )
    : replaced;
}

export async function sign(ev, replaceTags = true) {
  processContent(ev, replaceTags);
  return await window.nostr.signEvent(ev);
}

export async function signEvent(ev, privateKey) {
  if (privateKey) {
    const signed = { ...ev };
    signed.id = getEventHash(ev);
    signed.sig = signEventWithPrivateKey(ev, privateKey);
    return signed;
  }
  return await window.nostr.signEvent(ev);
}

export function getMetadata(ev) {
  return {
    title: findTag(ev.tags, "title")?.replace("\n", " "),
    d: findTag(ev.tags, "d"),
    image: findTag(ev.tags, "image"),
    summary: findTag(ev.tags, "summary"),
    publishedAt: findTag(ev.tags, "published_at"),
    hashtags: findTags(ev.tags, "t"),
  };
}

export function difficulty(ev) {
  const { id } = ev;
  const nonce = findTag(ev.tags, "nonce");
  if (!nonce) {
    return 0;
  }
  const [, , target] = ev.tags.find((t) => t[0] === "nonce");
  const idBuff = Buffer.from(id, "hex");
  const leadingZeroes = clzbufferBE(idBuff);
  if (Number(target) <= leadingZeroes) {
    return leadingZeroes;
  }
}

function clzbufferBE(buf) {
  var nlz = 0;

  for (var i = 0; i < buf.length; i++, nlz += 8) {
    if (buf[i] === 0) continue;

    nlz += Math.clz32(buf[i]) - 24;
    break;
  }

  return nlz;
}
