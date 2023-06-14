import { useQuery } from "react-query";
import queryCacheProps from "./hookCommon";
import { queryHttp } from "../utils/http";

interface queryInterface {
  [key: string]: string;
}

const useSearch = ({ pathname, query }: { pathname: string; query: queryInterface }) => {
  const search = useQuery(
    [pathname, { ...query }],
    (_query) => {
      return queryHttp(_query).then((r: any) => r.data);
    },

    {
      ...queryCacheProps,
      keepPreviousData: false,
    },
  );

  return {
    search,
  };
};

export default useSearch;
