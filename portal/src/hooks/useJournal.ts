import { QueryFunctionContext, useMutation, useQuery, useQueryClient } from "react-query";
import http from "../utils/httpMoonstream";
import { MOONSTREAM_API_URL } from "../constants";
import useUser from "../contexts/UserContext";

export type Journal = {
  id: string;
  bugout_user_id: string;
  holder_ids: string[];
  name: string;
  created_at: string;
  updated_at: string;
};

export type Journals = ReadonlyArray<Journal>;

export type Entity = {
  id: string;
  blockchain: string;
  address: string;
  title: string;
  journal_id: string;
  required_fields?: Array<{ [key: string]: string }>;
  secondary_fields: any;
};

export type Entities = ReadonlyArray<Entity>;

type JournalQueryData = {
  entities: Entity[];
  journalId: string;
};

interface JournalsResponseData {
  journals: Journals;
}

type JournalInput = { id: string; name?: never } | { id?: never; name: string };

const fetchJournals = async (): Promise<Journals> => {
  console.log("fetchJournals");

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

const fetchJournal = async (
  context: QueryFunctionContext<["journal" | "journalByName", string, string]>,
): Promise<{ entities: Entities; id: string }> => {
  console.log("fetchJournal");
  const [type, value] = context.queryKey;
  if (type === "journal") {
    const res = await http({
      method: "GET",
      url: `${MOONSTREAM_API_URL}/journals/${value}/entities`,
    });
    return { entities: res.data.entities, id: value };
  }

  if (type === "journalByName") {
    const allJournals = await fetchJournals();
    let targetJournal = allJournals.find((journal) => journal.name === value);
    if (!targetJournal) {
      targetJournal = await http({
        method: "POST",
        url: "https://api.moonstream.to/journals/",
        data: { name: value },
      }).then((res: any) => {
        console.log(res.data);
        const queryClient = useQueryClient();
        queryClient.invalidateQueries("journals");
        return res.data.journals;
      });
    }
    if (!targetJournal) {
      throw new Error("Can't create journal");
    }
    const res = await http({
      method: "GET",
      url: `${MOONSTREAM_API_URL}/journals/${targetJournal.id}/entities`,
    });
    console.log(res.data.entities);
    return { entities: res.data.entities, id: targetJournal.id };
  }
  throw new Error(`Unhandled type: ${type}`);
};

export const useJournal = (input: JournalInput) => {
  const { user } = useUser();
  const { id, name } = input;

  const type = id ? "journal" : "journalByName";
  const queryKey = [type, id ?? name, user] as ["journal" | "journalByName", string, string];
  return useQuery(queryKey, fetchJournal, {
    enabled: (!!id || !!name) && !!user,
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
      journalName,
      secondaryFields,
    }: {
      address: string;
      title: string;
      blockchain: string;
      journalName: string;
      secondaryFields?: any;
    }) => {
      const allJournals = await fetchJournals();
      const targetJournal = allJournals.find((journal) => journal.name === journalName);
      if (!targetJournal?.id) {
        throw new Error(`Error: Can't find journal - ${journalName}`);
      }
      console.log("QQ", secondaryFields);
      const response = await http({
        method: "POST",
        url: `https://api.moonstream.to/journals/${targetJournal.id}/entities`,
        data: { address, title, blockchain, ...secondaryFields },
      });
      return response.data;
    },
    onSuccess: (newEntity, variables) => {
      queryClient.invalidateQueries("journalByName");
      queryClient.setQueryData<JournalQueryData>(
        ["journalByName", variables.journalName],
        (oldData) => {
          if (!oldData) {
            return { entities: [newEntity], journalId: variables.journalName };
          }
          return {
            ...oldData,
            entities: [...oldData.entities, newEntity],
          };
        },
      );
    },
  });
};

// export const useUpdateEntity = () => {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: async ({
//       address,
//       title,
//       blockchain,
//       journalId,
//     }: {
//       address: string;
//       title: string;
//       blockchain: string;
//       journalId: string;
//     }) => {
//       const response = await http({
//         method: "POST",
//         url: `https://api.moonstream.to/journals/${journalId}/entities`,
//         data: { address, title, blockchain },
//       });
//       return response.data;
//     },
//     onSuccess: (newEntity, variables) => {
//       queryClient.setQueryData<JournalQueryData>(["journal", variables.journalId], (oldData) => {
//         if (!oldData) {
//           return { entities: [newEntity], journalId: variables.journalId };
//         }
//         return {
//           ...oldData,
//           entities: [...oldData.entities, newEntity],
//         };
//       });
//     },
//   });
// };

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
