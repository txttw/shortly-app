export const routePath = (
  to: string,
  params: { [key: string]: string } = {}
) => {
  let path = to;
  for (const [key, val] of Object.entries(params)) {
    path = path.replace(`:${key}`, val);
  }
  return path;
};
