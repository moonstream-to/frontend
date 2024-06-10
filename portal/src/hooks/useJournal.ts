import {
  QueryClient,
  QueryFunctionContext,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import http from "../utils/httpMoonstream";
import { MOONSTREAM_API_URL } from "../constants";
import useUser from "../contexts/UserContext";
import { Entities, Entity, Journal, JournalInput, JournalQueryData, Journals } from "../types";

const DEFAULT_JOURNAL_NAME = "Web3Addresses";

interface EntityCreationInput {
  address: string;
  title: string;
  blockchain: string;
  tags: string[];
  secondaryFields?: Record<string, string>;
  journalName?: string;
}

type EntityUpdateInput = Partial<EntityCreationInput> & { entity: Entity };

const fetchJournals = async (): Promise<Journals> => {
  const res = (await http({
    method: "GET",
    url: `${MOONSTREAM_API_URL}/journals/`,
  })) as { data: { journals: Journals } };
  return res.data.journals;
};

export const useJournals = () => {
  const { user } = useUser();
  if (!user) {
    console.log("cannot use journal without login");
    return undefined;
  }
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
    }).then((res: { data: { journals: Journal } }) => {
      const queryClient = useQueryClient();
      queryClient.invalidateQueries("journals");
      return res.data.journals;
    });
  }
  return targetJournal;
};

const getEntityId = (entity: Entity) => entity.id ?? entity.entity_url?.split("/").slice(-1)[0];

export const getEntityByAddress = async (address: string) => {
  const targetJournal = await getJournalByName(DEFAULT_JOURNAL_NAME);
  if (!targetJournal) {
    throw new Error("Can't create journal");
  }
  const journalId = targetJournal.id;
  return http({
    method: "GET",
    url: `${MOONSTREAM_API_URL}/journals/${journalId}/search/?representation=entity&q=tag:address:${address}`,
    params: { limit: 1, offset: 0 },
  }).then((res) => res.data.results[0]);
};

const fetchJournal = async (
  context: QueryFunctionContext<
    ["journalById" | "journalByName", string, string[], number, number, string]
  >,
): Promise<{ entities: Entities; totalLength: number }> => {
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

  const res = (await http({
    method: "GET",
    url: `${MOONSTREAM_API_URL}/journals/${journalId}/search/?representation=entity`,
    params: { limit, offset, q: tagsQuery },
  })) as { data: { results: Entity[]; total_results: number } };
  return {
    entities: res.data.results.map((e: Entity) => {
      return { ...e, id: getEntityId(e) };
    }),
    totalLength: res.data.total_results,
  };
};

export const useJournal = ({
  id,
  name = DEFAULT_JOURNAL_NAME,
  tags,
  limit = 10,
  offset = 0,
}: JournalInput) => {
  const { user } = useUser();
  if (!user) {
    console.log("cannot use journal without login");
  }
  const type = id ? "journalById" : "journalByName";
  const queryKey = [type, id ?? name, tags, limit, offset, user?.username] as [
    "journalById" | "journalByName",
    string,
    string[],
    number,
    number,
    string,
  ];
  return useQuery(queryKey, fetchJournal, {
    enabled: !!user && tags.length > 0,
    staleTime: 120000,
    keepPreviousData: true,
  });
};

//directly updates queries data after successful mutations
const updateQueriesData = (
  newEntity: Entity,
  variables: EntityCreationInput | EntityUpdateInput,
  queryClient: QueryClient,
) => {
  const updateJournalData = (
    oldData: JournalQueryData | undefined,
    newEntity: Entity,
    variables: EntityCreationInput | EntityUpdateInput,
  ) => {
    const { address, blockchain, id, journal_id, title } = newEntity;
    const entityToInsert: Entity = {
      address,
      blockchain,
      id,
      journal_id,
      title,
      required_fields: variables.tags?.map((key) => ({ [key]: "" })),
      secondary_fields: variables.secondaryFields,
    };
    if (!oldData) {
      return { entities: [entityToInsert], totalLength: 1 };
    }
    return {
      entities: [...oldData.entities, entityToInsert],
      totalLength: oldData.totalLength + 1,
    };
  };

  queryClient.setQueriesData(
    {
      queryKey: ["journalByName", DEFAULT_JOURNAL_NAME, variables.tags],
      exact: false,
    },
    (oldData: JournalQueryData | undefined) => updateJournalData(oldData, newEntity, variables),
  );

  queryClient.setQueriesData(
    {
      queryKey: ["journalByName", DEFAULT_JOURNAL_NAME, [`address:${newEntity.address}`]],
      exact: false,
    },
    (oldData: JournalQueryData | undefined) => updateJournalData(oldData, newEntity, variables),
  );
};

export const useUpdateEntityTitle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EntityUpdateInput) => {
      const { address, title, blockchain, secondaryFields, entity, tags } = input;
      const entityId = getEntityId(entity);
      const response = await http({
        method: "PUT",
        url: `https://api.moonstream.to/journals/${entity.journal_id}/entries/${entityId}`,
        data: { title, content: "" },
      });
      return response.data;
    },
    onSuccess: (newEntity, variables) => queryClient.invalidateQueries("journalByName"), //TODO direct update
  });
};

export const useCreateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EntityCreationInput) => {
      const {
        journalName = DEFAULT_JOURNAL_NAME,
        address,
        title,
        blockchain,
        secondaryFields,
        tags,
      } = input;
      const targetJournal = await getJournalByName(journalName);
      if (!targetJournal?.id) {
        throw new Error(`Error: Can't find or create journal - ${journalName}`);
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
    onSuccess: (newEntity, variables) => updateQueriesData(newEntity, variables, queryClient),
  });
};

export const useDeleteEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entity }: { entity: Entity }) => {
      const response = await http({
        method: "DELETE",
        url: `https://api.moonstream.to/journals/${entity.journal_id}/entities/${getEntityId(
          entity,
        )}`,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      if (variables.entity.required_fields) {
        const tags = variables.entity.required_fields.map((item) => Object.keys(item)).flat();
        queryClient.setQueriesData(
          {
            queryKey: ["journalByName", DEFAULT_JOURNAL_NAME, tags],
            exact: false,
          },
          (oldData: JournalQueryData | undefined) => {
            const newEntities = oldData
              ? oldData.entities.filter((e: Entity) => e.id !== variables.entity.id)
              : [];
            return {
              entities: newEntities,
              totalLength: newEntities.length,
            };
          },
        );
      }
      queryClient.setQueriesData(
        {
          queryKey: [
            "journalByName",
            DEFAULT_JOURNAL_NAME,
            [`address:${variables.entity.address}`],
          ],
          exact: false,
        },
        () => {
          return { entities: [], totalLength: 0 };
        },
      );
    },
  });
};
