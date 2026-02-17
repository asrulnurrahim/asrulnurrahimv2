import { useQuery } from "@tanstack/react-query";
import { getTechnologiesAction } from "../actions/projects";

export const useTechnologies = () => {
  return useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      const res = await getTechnologiesAction();
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
