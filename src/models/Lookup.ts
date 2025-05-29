import { BaseResource } from "./BaseResource";
import { Link } from "./Link";

export interface Lookup extends BaseResource {
  timestamp: Date | string;
  linkId: string;
  link?: Link;
}
