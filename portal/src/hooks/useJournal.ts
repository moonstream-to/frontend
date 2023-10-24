import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from "react-query";
import http from "../utils/httpMoonstream";
import { MOONSTREAM_API_URL } from "../constants";
import useUser from "../contexts/UserContext";
import {
  Entities,
  Journal,
  JournalInput,
  JournalQueryData,
  Journals,
  JournalsResponseData,
} from "../types";

const DEFAULT_JOURNAL_NAME = "Web3Addresses";

interface CreateJournalResponse {
  data: {
    journals: Journal;
  };
}

interface EntityOperationInput {
  address: string;
  title: string;
  blockchain: string;
  tags: string[];
  secondaryFields?: Record<string, unknown>;
  journalName?: string;
}

interface EntityUpdateInput extends EntityOperationInput {
  id: string; // "id" is mandatory here
}

const fetchJournals = async (): Promise<Journals> => {
  const res = (await http({
    method: "GET",
    url: `${MOONSTREAM_API_URL}/journals/`,
  })) as { data: JournalsResponseData };
  return res.data.journals;
};

export const useJournals = () => {
  const { user } = useUser();
  const queryKey = ["journals", user] as const;
  return useQuery({ queryKey, queryFn: fetchJournals, enabled: !!user, staleTime: 120000 });
};

const getJournalByName = async (journalName: string): Promise<Journal | undefined> => {
  const allJournals = await fetchJournals();
  let targetJournal = allJournals.find((journal) => journal.name === journalName);
  if (!targetJournal) {
    targetJournal = await http({
      method: "POST",
      url: "https://api.moonstream.to/journals/",
      data: { name: journalName },
    }).then((res: CreateJournalResponse) => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries("journals");
      return res.data.journals;
    });
  }
  return targetJournal;
};

//TODO comment
const fetchJournal = async (
  context: QueryFunctionContext<
    ["journalById" | "journalByName", string, string[], number, number, string]
  >,
): Promise<{ entities: Entities; id: string }> => {
  const [type, value, tags, limit, offset] = context.queryKey;

  let journalId: string | undefined = undefined;
  if (type === "journalById") {
    journalId = value;
  }
  if (!journalId) {
    const targetJournal = await getJournalByName(value);
    if (!targetJournal) {
      throw new Error("Can't create journal");
    }
    journalId = targetJournal.id;
  }

  const tagsQuery = tags.map((tag) => `tag:${tag}`).join("&");
  const res = await http({
    method: "GET",
    url: `${MOONSTREAM_API_URL}/journals/${journalId}/search/?representation=entity&q=${tagsQuery}`, //TODO Limit, offset
    params: { limit, offset },
  });
  return { entities: res.data.results, id: journalId };
};

export const useJournal = ({
  id,
  name = DEFAULT_JOURNAL_NAME,
  tags,
  limit = 10,
  offset = 10,
}: JournalInput) => {
  const { user } = useUser();
  const type = id ? "journalById" : "journalByName";
  const queryKey = [type, id ?? name, tags, limit, offset, user] as [
    "journalById" | "journalByName",
    string,
    string[],
    number,
    number,
    string,
  ];
  return useQuery(queryKey, fetchJournal, {
    enabled: !!user,
    staleTime: 120000,
    keepPreviousData: true,
  });
};

export const useAddEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      address,
      title,
      blockchain,
      tags,
      secondaryFields,
      journalName = DEFAULT_JOURNAL_NAME,
    }: {
      address: string;
      title: string;
      blockchain: string;
      tags: string[];
      secondaryFields?: Record<string, unknown>;
      journalName?: string;
    }) => {
      const allJournals = await fetchJournals();
      const targetJournal = allJournals.find((journal) => journal.name === journalName);
      if (!targetJournal?.id) {
        throw new Error(`Error: Can't find journal - ${journalName}`);
      }
      const response = await http({
        method: "POST",
        url: `https://api.moonstream.to/journals/${targetJournal.id}/entities`,
        data: { address, title, blockchain, ...secondaryFields },
      });
      await http({
        method: "POST",
        url: `https://api.moonstream.to/journals/${targetJournal.id}/entries/${response.data.id}/tags`,
        data: { tags },
      });
      return response.data;
    },
    onSuccess: (newEntity, variables) => {
      queryClient.invalidateQueries("journalByName");
      queryClient.invalidateQueries("journalById");

      queryClient.setQueryData<JournalQueryData>(["journalByName", variables.tags], (oldData) => {
        if (!oldData) {
          return { entities: [newEntity], journalId: newEntity.journalId };
        }
        return {
          ...oldData,
          entities: [...oldData.entities, newEntity], //TODO .entities have other structure
        };
      });
    },
  });
};

export const useDeleteEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ journalName, entityId }: { entityId: string; journalName: string }) => {
      const allJournals = await fetchJournals();
      const targetJournal = allJournals.find((journal) => journal.name === journalName);
      if (!targetJournal?.id) {
        throw new Error(`Error: Can't find journal - ${journalName}`);
      }
      const response = await http({
        method: "DELETE",
        url: `https://api.moonstream.to/journals/${targetJournal.id}/entities/${entityId}`,
      });
      return response.data;
    },
    onSuccess: (newEntity, variables) => {
      queryClient.invalidateQueries("journalByName");
      queryClient.setQueryData<JournalQueryData>(
        ["journalByName", variables.journalName],
        (oldData) => {
          if (!oldData) {
            return { entities: [], journalId: variables.journalName };
          }
          return {
            ...oldData,
            entities: [...oldData.entities.filter((e) => e.id !== variables.entityId)],
          };
        },
      );
    },
  });
};
