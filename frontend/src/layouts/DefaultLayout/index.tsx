import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import jwt_decode from "jwt-decode";
import { useSnackbar } from "notistack";

import Appbar from "@modules/Appbar/Appbar";
import Footer from "@modules/Footer";
import { SIGN_IN_MUTATION } from "@store/auth/auth.graphql";
import { setAuth } from "@store/auth/auth.slice";
import { RootState } from "@/store";

export interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  isShowFooter?: boolean;
}

const Layout = ({
  children,
  isAuthenticated,
  isShowFooter = true,
}: LayoutProps) => {
  const [login] = useMutation(SIGN_IN_MUTATION);
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const { isAuthenticated: isStateAuthenticated } = auth;

  useEffect(() => {
    try {
      (async () => {
        if (isAuthenticated) {
          if (!(isStateAuthenticated || localStorage.getItem("jwtToken"))) {
            router.push("/");

            return;
          }
        }

        if (!isStateAuthenticated && localStorage.getItem("jwtToken")) {
          const decoded = jwt_decode(localStorage.getItem("jwtToken"));
          const result = await login({
            variables: { email: (decoded as any).email },
          });

          dispatch(
            setAuth({
              ...result.data.login.user,
              jwt: result.data.login.jwt as string,
            })
          );
        }
      })();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStateAuthenticated]);

  return (
    <div>
      <Appbar />
      <main>{children}</main>
      {isShowFooter && <Footer />}
    </div>
  );
};

export default Layout;
