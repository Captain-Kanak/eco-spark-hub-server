import { DecodedUser } from "./auth.type";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}
