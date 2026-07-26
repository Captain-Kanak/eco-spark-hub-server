import * as z from "zod";

const giveVoteSchema = z.object({
  ideaId: z.uuid("Idea ID is invalid or missing"),
});

export const voteValidation = {
  giveVoteSchema,
};
