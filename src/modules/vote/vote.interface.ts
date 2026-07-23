import { VoteType } from "@prisma/client";

export interface IGiveVote {
  ideaId: string;
  voteType: VoteType;
}
