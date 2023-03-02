import { useState } from "react";
import { useSelector } from "react-redux";

import {
  useToast,
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
} from "@chakra-ui/react";

import Badge from "./Badge";

import { dateToUnix, signEvent, useNostr } from "../nostr";
import useColors from "./useColors";

export default function CreateBadge() {
  const toast = useToast();
  const { user } = useSelector((s) => s.relay);
  const { publish } = useNostr();
  const { secondary } = useColors();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
  // todo: resolutions
  const draft = {
    kind: 30009,
    content: "",
    pubkey: user,
    tags: [
      ["d", slug],
      ["name", name],
      ["description", description],
      ["image", imageUrl],
      ["thumb", thumbUrl],
    ],
  };
  async function onCreate() {
    const ev = {
      kind: 30009,
      content: "",
      created_at: dateToUnix(),
      tags: [
        ["d", slug],
        ["name", name],
        ["description", description],
        ["image", imageUrl],
        ["thumb", thumbUrl],
      ],
    };
    try {
      const signed = await signEvent(ev);
      publish(signed);
      toast({
        title: "Badge created",
        status: "success",
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <Heading mb={3}>Create a badge</Heading>
      <Text color={secondary} mb={3}>
        Each badge costs{" "}
        <Text color="white" as="span" fontWeight={700}>
          1,000
        </Text>{" "}
        sats to create. This helps cut down on badge spam and also with funding
        Nostr projects such as this one.
      </Text>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="e.g. Nostr Early Adopter"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormHelperText>Tip: keep it short.</FormHelperText>
      </FormControl>
      <FormControl mt={3}>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Your text..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormHelperText>One or two sentences is good.</FormHelperText>
      </FormControl>
      <FormControl mt={3}>
        <FormLabel>Badge Image</FormLabel>
        <Input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <FormHelperText>
          We recommend an SVG or a PNG of no less than 1024x1024 pixels.
        </FormHelperText>
      </FormControl>
      <FormControl mt={3}>
        <FormLabel>Badge Thumbnail</FormLabel>
        <Input
          type="text"
          placeholder="Thumnail URL"
          value={thumbUrl}
          onChange={(e) => setThumbUrl(e.target.value)}
        />
      </FormControl>
      <Heading my={3}>Preview</Heading>
      <Badge ev={draft} />
      <Button
        color="white"
        background="var(--gradient)"
        mt={10}
        onClick={onCreate}
      >
        Save and Publish
      </Button>
    </>
  );
}
