import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { useSnackbar } from "notistack";

import oauth from "@base/Discord";
import { Loading } from "@base/Loading/ReactSpinner";
import { SIGN_IN_MUTATION } from "@store/auth/auth.graphql";
import { setAuth } from "@store/auth/auth.slice";
// import { node_env } from "@/config";

interface LoginData {
  email: string;
  username: string;
  discordId: string;
  discordAccessToken?: string;
  avatar: string;
}

const CheckUser = () => {
  const router = useRouter();
  // const { search } = useLocation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [login] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    const { code, error } = router.query;
    if (router.query) {
      if (code) {
        const handleWithUser = (user) => {
          if (user.email && user.verified) {
            handleLogin({
              email: user.email,
              username: user.username,
              avatar: user.avatar,
              discordId: user.id,
              discordAccessToken: user.discordAccessToken || "",
            });
          } else if (!user.email) {
            enqueueSnackbar("User email not found!", { variant: "error" });
          } else if (!user.verified) {
            enqueueSnackbar("Not verified user!", { variant: "error" });
          }
        };

        // if (node_env === "development" && code === "dragon") {
        //   handleWithUser({
        //     email: "dragon99steel@gmail.com",
        //     username: "dragon1227",
        //     avatar: "/avatars/james.png",
        //     discordId: "",
        //     verified: true,
        //   });
        // } else if (node_env === "development" && code === "assassin") {
        //   handleWithUser({
        //     email: "assassin.empires@gmail.com",
        //     username: "Power.D",
        //     avatar:
        //       "https://storage.googleapis.com/charsi-e0f9c.appspot.com/03c5af5e0099087e725c01c2990f2079.png",
        //     discordId: "",
        //     verified: true,
        //   });
        // } else if (node_env === "development" && code === "elijah") {
        //   handleWithUser({
        //     email: "elijaheric723@gmail.com",
        //     username: "AI_Elijah",
        //     avatar: "null.png",
        //     discordId: "",
        //     verified: true,
        //   });
        // } else {
        oauth
          .tokenRequest({
            code: code as string,
            scope: "identify email",
            grantType: "authorization_code",
          })
          .then((tokens) => {
            oauth
              .getUser(tokens.access_token)
              .then(async (user) => {
                handleWithUser({
                  ...user,
                  discordAccessToken: tokens.access_token,
                });
              })
              .catch((_err) => {
                console.log("err");
              });
          });
        // }
      } else if (error) {
        console.log("error: ", error);
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handleLogin = async ({
    email,
    username,
    avatar,
    discordId,
    discordAccessToken,
  }: LoginData) => {
    try {
      const result = await login({ variables: { email, discordAccessToken } });
      dispatch(
        setAuth({
          ...result.data.login.user,
          jwt: result.data.login.jwt,
        })
      );
      router.push("/");
    } catch (e) {
      console.log(e);
      (localStorage as any).setItem(
        "temp_user",
        JSON.stringify({
          email,
          username,
          avatar,
          discordId,
          discordAccessToken,
        })
      );
      router.push("/create-account/0");
    }
  };

  return <Loading />;
};

export default CheckUser;
