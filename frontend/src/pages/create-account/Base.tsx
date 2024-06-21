import { useEffect, useState, FunctionComponent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";

const steps = [
  "Add games played to your profile",
  "Add phone number +  accept terms",
];

type BaseProps = {
  step?: number;
};

const Base: FunctionComponent<BaseProps> = ({ step }) => {
  const router = useRouter();

  const [id, setId] = useState<number>(step || 0);

  const breakpoints_lg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("lg")
  );
  const breakpoints_md = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );
  const breakpoints_sm_md = useMediaQuery((theme: Theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const breakpoints_sm = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("sm")
  );

  const components = [<FirstStep key="first" />, <SecondStep key="second" />];

  useEffect(() => {
    if (router.query?.step) {
      const sid = parseInt(router.query?.step as string);
      if (typeof components[sid] !== "undefined") setId(sid);
      else router.push("/create-account/0");
    } else {
      router.push("/create-account/0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <Container>
      <Stack alignItems="center" py={breakpoints_sm ? 5 : 2} spacing={7}>
        {breakpoints_sm ? (
          <>
            <Stepper
              activeStep={id}
              sx={{ width: breakpoints_md ? 800 : "auto" }}
              alternativeLabel={breakpoints_sm_md}
            >
              {steps.map((item, index) => (
                <Step key={index}>
                  <StepButton>{item}</StepButton>
                </Step>
              ))}
            </Stepper>

            <Stack
              direction="row"
              alignItems="center"
              spacing={4}
              width="fit-content"
            >
              {breakpoints_md && (
                <Typography variant={breakpoints_lg ? "h2" : "h3"} mt={1}>
                  Welcome to
                </Typography>
              )}
              <Image
                src="/icons/logo_gradient_charsi.svg"
                width={470}
                height={125}
                alt="logl"
              />
            </Stack>
          </>
        ) : (
          <Stack justifyContent="space-between" sx={{ width: "100%" }}>
            <Typography variant="h4">Welcome</Typography>
            <Typography variant="caption">{steps[id]}</Typography>
            <Box sx={{ width: "100%" }}>
              <LinearProgress variant="determinate" value={50 * (id + 1)} />
            </Box>
          </Stack>
        )}

        {components[id] || <></>}
      </Stack>
    </Container>
  );
};

export const getStaticProps = async (context) => {
  return {
    props: {
      id: context.params?.step || null,
    },
  };
};

export default Base;

export { default as CheckUser } from "../auth";
