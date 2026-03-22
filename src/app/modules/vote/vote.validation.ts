import { VoteType } from "@prisma/client";
import * as z from "zod";

const giveVoteSchema = z.object({
  ideaId: z.uuid("Idea ID is invalid or missing"),
  voteType: z.enum([VoteType.UP, VoteType.DOWN]).default(VoteType.UP),
});

export const voteValidation = {
  giveVoteSchema,
};
