import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  useToast,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  Image,
} from "@chakra-ui/react";

import ActionButton from "./ActionButton";
import Badge from "./Badge";
import useColors from "./useColors";

import { dateToUnix, signEvent, useNostr, encodeNaddr } from "../nostr";

export default function CreateBadge() {
  const toast = useToast();
  const { highlight } = useColors();
  const [createdBadge, setCreatedBadge] = useState();
  const { user, privateKey } = useSelector((s) => s.relay);
  const { publish } = useNostr();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [thumbUrl, setThumbUrl] = useState("");
  const isValidBadge = name.trim().length > 0;
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
      pubkey: user,
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
      const signed = await signEvent(ev, privateKey);
      publish(signed);
      setCreatedBadge(signed);
      toast({
        title: "Badge created",
        status: "success",
      });
    } catch (error) {
      console.error(error);
    }
  }

  function goToBadge() {
    if (!createdBadge) {
      return;
    }

    navigate(`/b/${encodeNaddr(createdBadge)}`);
  }
  return !createdBadge ? (
    <Flex margin="0 auto" px={4} flexDirection="column" maxWidth="720px">
      <Heading mb={3}>Create a badge</Heading>
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
          placeholder="Thumbnail URL"
          value={thumbUrl}
          onChange={(e) => setThumbUrl(e.target.value)}
        />
      </FormControl>
      <Heading my={3}>Preview</Heading>
      <Badge ev={draft} />
      <ActionButton isDisabled={!isValidBadge} mt={10} onClick={onCreate}>
        Save and Publish
      </ActionButton>
    </Flex>
  ) : (
    <Flex
      margin="0 auto"
      px={4}
      alignItems="center"
      flexDirection="column"
      maxWidth="720px"
    >
      <Heading mb={3}>Success!</Heading>
      <Text mb={4}>You have created a badge!</Text>
      <Text mb={4}>
        If you find this software useful consider{" "}
        <Link to="https://www.lnurlpay.com/verbiricha@getalby.com" isExternal>
          <Text as="span" color={highlight}>
            donating sats to the developers
          </Text>
        </Link>
        .
      </Text>
      <Image src="/cat.png" alt="Success!" width="280px" height="322px" />
      <ActionButton mt={10} onClick={goToBadge}>
        Go to Badge
      </ActionButton>
    </Flex>
  );
}
