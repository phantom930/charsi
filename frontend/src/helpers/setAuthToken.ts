// eslint-disable-next-line import/no-anonymous-default-export
export default (token: string) => {
  if (typeof localStorage !== "undefined")
    return (localStorage as any).setItem("jwtToken", `Bearer ${token}`);
  else return null;
};
