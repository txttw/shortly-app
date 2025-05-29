import { BaseResource } from "./BaseResource";
import { Link } from "./Link";
import { Permissions } from "./Permissions";

export interface User extends BaseResource {
  username: string;
  permissions: Permissions[];
  password?: string;
  passwordRepeat?: string;
  links?: Link[];
}
