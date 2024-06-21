import OngoingProvider from "@providers/OngoingProvider";
import Auth from "./Base";
import DefaultLayout from "@layouts/DefaultLayout";

const CreateAccount = () => {
  return (
    <OngoingProvider>
      <Auth />
    </OngoingProvider>
  );
};

CreateAccount.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default CreateAccount;
