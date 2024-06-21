// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  if (typeof localStorage !== "undefined")
    return (localStorage as any).removeItem("jwtToken");
  else return null;
};
