import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Tabs from "@mui/material/Tabs";
import Container from "@mui/material/Container";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import LayersIcon from "@mui/icons-material/Layers";
import WorkIcon from "@mui/icons-material/Work";
import _ from "lodash";

import { TabPanel, StyledTab } from "@base/Tab";
import DefaultLayout from "@layouts/DefaultLayout";
import Settings from "@components/Account/Settings";
import BidsOnItems from "@components/Account/BidsOnItems";
import OutgoingOffers from "@components/Account/OutgoingOffers";
import PastPendingTrades from "@components/Account/PastPendingTrades";
import { CharsiContext } from "@providers/CharsiProvider";

const AccountManage = () => {
  const { pushLoadingRoute } = useContext(CharsiContext);
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newTabIndex: number
  ) => {
    switch (newTabIndex) {
      case 0:
        pushLoadingRoute("/account/settings");
        break;
      case 1:
        pushLoadingRoute("/account/bids-on-items");
        break;
      case 2:
        pushLoadingRoute("/account/outgoing-offers");
        break;
      case 3:
        pushLoadingRoute("/account/past-trades");
        break;
      default:
        router.replace("/404");
        break;
    }
  };

  useEffect(() => {
    if (router.query?.tab) {
      switch (router.query?.tab) {
        case "settings":
          setTabIndex(0);
          break;

        case "bids-on-items":
          setTabIndex(1);
          break;

        case "outgoing-offers":
          setTabIndex(2);
          break;

        case "past-trades":
          setTabIndex(3);
          break;

        default:
          router.replace("/404");
          break;
      }
    }
  }, [router.query?.tab, router]);

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 10 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Charsi Account Management"
        variant="scrollable"
        scrollButtons="auto"
      >
        <StyledTab
          icon={<PersonIcon />}
          iconPosition="start"
          label="Account Settings"
          sx={
            tabIndex === 0
              ? { color: "primary.main", opacity: 1 }
              : { color: "#000", opacity: 0.6 }
          }
        />
        <StyledTab
          icon={<PeopleIcon />}
          iconPosition="start"
          label="Bids on My Items"
          sx={
            tabIndex === 1
              ? { color: "primary.main", opacity: 1 }
              : { color: "#000", opacity: 0.6 }
          }
        />
        <StyledTab
          LinkComponent={Link}
          icon={<LayersIcon />}
          iconPosition="start"
          label="My Outgoing Offers"
          sx={
            tabIndex === 2
              ? { color: "primary.main", opacity: 1 }
              : { color: "#000", opacity: 0.6 }
          }
        />
        <StyledTab
          icon={<WorkIcon />}
          iconPosition="start"
          label="Past + Pending Trades"
          sx={
            tabIndex === 3
              ? { color: "primary.main", opacity: 1 }
              : { color: "#000", opacity: 0.6 }
          }
        />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <Settings />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <BidsOnItems />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <OutgoingOffers />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <PastPendingTrades />
      </TabPanel>
    </Container>
  );
};

AccountManage.getLayout = (page) => (
  <DefaultLayout isAuthenticated={true}>{page}</DefaultLayout>
);

export default AccountManage;
