import { BaseResource } from "./BaseResource";
import { Lookup } from "./Lookup";
import { User } from "./User";

export interface Link extends BaseResource {
  short: string;
  long: string;
  userId: string;
  expiresAt: Date;
  user?: Partial<User>;
}

export interface LinkWithAnalytics extends Link {
  count: number;
  lastLookup?: Date;
  lookups?: Partial<Lookup>[];
}
