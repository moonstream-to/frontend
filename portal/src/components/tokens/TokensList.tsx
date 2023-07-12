import React, { useMemo, useState, useEffect } from "react";

import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Center,
  Grid,
  GridItem,
  IconButton,
  Input,
  Skeleton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { AuthService } from "../../services";
import http from "../../utils/httpMoonstream";
import { hookCommon } from "../../hooks";

import useUser from "../../contexts/UserContext";
import useMoonToast from "../../hooks/useMoonToast";
import PoolDetailsRow from "../PoolDetailsRow";
import SortingColumnHeader from "../SortingColumnHeader";

interface Token {
  note: string;
  created_at: string;
  id: string;
}

const TokensList = () => {
  const toast = useMoonToast();
  const { user } = useUser();
  const API_URL = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;
  const AUTH_URL = `${API_URL}/users`;

  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    setUserToken(localStorage.getItem("MOONSTREAM_ACCESS_TOKEN") ?? "");
  }, [user]);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(-1);

  const [filter, setFilter] = useState("");

  const [sortBy, setSortBy] = useState<{ title: string; direction: "ASC" | "DESC" }>({
    title: "label",
    direction: "ASC",
  });

  const sortingFn = (a: Token, b: Token) => {
    const aName = a?.note?.toUpperCase();
    const bName = b?.note?.toUpperCase();

    if ((a.note || b.note) && sortBy.title === "label") {
      if (!b.note) return -1;
      if (sortBy.direction === "ASC") {
        return aName < bName ? -1 : aName > bName ? 1 : 0;
      } else {
        return aName > bName ? -1 : aName < bName ? 1 : 0;
      }
    } else {
      if (sortBy.direction === "DESC") {
        return Number(new Date(b.created_at)) - Number(new Date(a.created_at));
      } else {
        return Number(new Date(a.created_at)) - Number(new Date(b.created_at));
      }
    }
  };

  const getTokensList = () => {
    return http({
      method: "GET",
      url: `${AUTH_URL}/tokens`,
    }).then((res) => res.data);
  };

  const tokens = useQuery(["tokens", user], getTokensList, {
    onSuccess: () => {
      deleteToken.reset();
      update.reset();
    },
    ...hookCommon,
  });

  const sortedTokens = useMemo(() => {
    return tokens.data?.token
      ?.sort(sortingFn)
      .filter((t: Token) => (t.note ? t.note.includes(filter) : filter === ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, tokens.data, filter]);

  const queryClient = useQueryClient();

  const deleteToken = useMutation(AuthService.revokeToken, {
    onSuccess: () => {
      toast("Token destroyed", "success");
      queryClient.invalidateQueries("tokens");
    },
    onError: (error: Error) => {
      toast(error.message, "error");
    },
  });

  const update = useMutation(AuthService.updateToken, {
    onSuccess: () => {
      queryClient.invalidateQueries("tokens");
    },
    onError: (error: Error) => {
      toast(error.message, "error");
    },
  });

  return (
    <>
      <Grid
        templateColumns="repeat(4, auto)"
        gap="10px"
        w="800px"
        fontFamily="Jet Brains Mono, monospace"
        verticalAlign="center"
        userSelect="none"
      >
        <GridItem>
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={"Type here to filter by label"}
            borderRadius="10px"
            w="100%"
            p="10px"
            fontSize="14px"
            mb="10px"
          />
        </GridItem>
        <GridItem colSpan={3} />
        <GridItem borderBottom="1px solid #AAAAAA">
          <SortingColumnHeader title="label" sortBy={sortBy} setSortBy={setSortBy} />
        </GridItem>
        <GridItem textAlign="center" borderBottom="1px solid #AAAAAA" cursor="default">
          token
        </GridItem>
        <GridItem borderBottom="1px solid #AAAAAA">
          <SortingColumnHeader title="date" sortBy={sortBy} setSortBy={setSortBy} />
        </GridItem>
        <GridItem textAlign="center" cursor="default"></GridItem>
        {tokens.isLoading &&
          Array.from(Array(20)).map((_, idx) => (
            <Skeleton key={idx} h="27px" w="100%" startColor="#2d2d2d" endColor="#222222" />
          ))}
        {tokens.data &&
          sortedTokens.map((token: Token, idx: number) => (
            <React.Fragment key={idx}>
              <GridItem w="100%" h="15px" px="15px">
                {(update.isLoading || tokens.isFetching) &&
                  update.variables?.token === token.id && <Spinner h="15px" w="15px" />}

                {editingNoteId !== idx &&
                  !(
                    update.variables?.token === token.id &&
                    (update.isLoading || tokens.isFetching)
                  ) && (
                    <Text
                      onClick={() => {
                        if (update.isLoading) {
                          return;
                        }
                        setEditingNoteId(idx);
                        setNewNote(token.note ?? "");
                      }}
                      color={token.note ? "white" : "#AAAAAA"}
                    >
                      {token.note ?? "Click to set up label"}
                    </Text>
                  )}
                {editingNoteId === idx && !update.isLoading && (
                  <Input
                    value={newNote}
                    py="3px"
                    maxH="27px"
                    autoFocus
                    onBlur={() => setEditingNoteId(-1)}
                    onChange={(e) => setNewNote(e.target.value)}
                    type="text"
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        update.mutate({ token: token.id, note: newNote });
                        setEditingNoteId(-1);
                      } else if (e.key === "Escape") {
                        setEditingNoteId(-1);
                      }
                    }}
                  />
                )}
              </GridItem>
              <GridItem w="100%" px="15px">
                <Center>
                  <PoolDetailsRow value={token.id} range={{ atStart: 4, atEnd: 4 }} canBeCopied />
                </Center>
              </GridItem>
              <GridItem w="100%" px="15px">
                <Text my="auto" h="100%" textAlign="center">
                  {formattedDate(token.created_at)}
                </Text>
              </GridItem>
              <GridItem w="100%" px="15px" textAlign="center">
                {(deleteToken.isLoading || (tokens.isFetching && !deleteToken.isError)) &&
                deleteToken.variables === token.id ? (
                  <Spinner h="15px" w="15px" />
                ) : (
                  <IconButton
                    maxH="27px"
                    title={token.id === userToken ? "current token" : ""}
                    aria-label="delete"
                    icon={<DeleteIcon h="15px" />}
                    isDisabled={token.id === userToken}
                    cursor="pointer"
                    onClick={() => deleteToken.mutate(token.id)}
                    _hover={{ bg: "transparent" }}
                    _disabled={{ cursor: "default", opacity: "0.5" }}
                    bg="transparent"
                  />
                )}
              </GridItem>
            </React.Fragment>
          ))}
      </Grid>
    </>
  );
};

export default TokensList;
