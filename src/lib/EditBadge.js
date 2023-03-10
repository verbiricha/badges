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

import {
  dateToUnix,
  signEvent,
  useNostr,
  encodeNaddr,
  findTag,
} from "../nostr";

export default function EditBadge({ ev }) {
  const toast = useToast();
  const [updatedBadge, setUpdatedBadge] = useState();
  const { user, privateKey } = useSelector((s) => s.relay);
  const { publish } = useNostr();
  const navigate = useNavigate();
  const { highlight } = useColors();

  const slug = findTag(ev.tags, "d");
  const defaultName = findTag(ev.tags, "name");
  const defaultDescription = findTag(ev.tags, "description");
  const defaultImage = findTag(ev.tags, "image");
  const defaultThumbnail = findTag(ev.tags, "thumb");

  const [name, setName] = useState(defaultName ?? "");
  const [description, setDescription] = useState(defaultDescription ?? "");
  const [imageUrl, setImageUrl] = useState(defaultImage ?? "");
  const [thumbUrl, setThumbUrl] = useState(defaultThumbnail ?? "");

  const isValidBadge = name.trim().length > 0;

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
      ...draft,
      created_at: dateToUnix(),
    };
    try {
      const signed = await signEvent(ev, privateKey);
      publish(signed);
      setUpdatedBadge(signed);
      toast({
        title: "Badge updated",
        status: "success",
      });
    } catch (error) {
      console.error(error);
    }
  }

  function goToBadge() {
    if (!updatedBadge) {
      return;
    }

    navigate(`/b/${encodeNaddr(updatedBadge)}`);
  }
  return !updatedBadge ? (
    <Flex margin="0 auto" px={4} flexDirection="column" maxWidth="720px">
      <Heading mb={3}>Edit badge</Heading>
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
          We recommend a WebP or a PNG of no less than 1024x1024 pixels.
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
      <Text mb={4}>You have updated a badge!</Text>
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
