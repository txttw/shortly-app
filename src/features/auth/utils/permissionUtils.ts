import { User } from "../../../models/User";
import { hasSomePermissions } from "../../../utils";
import { Permissions } from "../../../models/Permissions";
import { MenuItemDescriptor } from "../../../types";

export const filterMenuByPermissions = (
  menu: MenuItemDescriptor[],
  user: User | null
) => {
  if (!user) {
    return [];
  }
  return menu.filter((item) => {
    if (item.id === "users") {
      return hasSomePermissions(user?.permissions, [
        Permissions.User_ReadAll,
        Permissions.User_WriteAll,
        Permissions.User_Create,
      ]);
    } else if (item.id === "analytics") {
      return hasSomePermissions(user?.permissions, [
        Permissions.Analytics_Read,
        Permissions.Analytics_ReadAll,
      ]);
    } else if (item.id === "live-analytics") {
      return user?.permissions.includes(Permissions.Analytics_ReadLive);
    }
    return true;
  });
};
