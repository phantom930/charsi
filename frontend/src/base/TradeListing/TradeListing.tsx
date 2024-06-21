import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardProps } from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Stack from "@mui/system/Stack";
import { Balance as BalanceIcon } from "@base/Icon";

interface Props {
  image: string;
  seeking: number;
  current_bid: number;
  trading: string;
  avatar: string;
  name: string;
}

const HoverableCard = styled(Card)<CardProps>(({ theme }) => ({
  boxShadow: theme.shadows[4],
  ":hover": {
    boxShadow: theme.shadows[16],
  },
}));

const Listing = (props: Props) => {
  return (
    <HoverableCard>
      <CardMedia image={props.image} sx={{ height: 200 }} />
      <CardContent>
        <Stack direction="row" alignItems="center" mb={2}>
          <Avatar
            sx={{ width: "2em", height: "2em" }}
            src={`avatars/${props.avatar}`}
          />
          <Typography ml={1}>{props.name}</Typography>
        </Stack>

        <Typography color="grey" variant="body2">
          TRADING
        </Typography>
        <Typography variant="h5" noWrap>
          {props.trading}
        </Typography>

        <Typography color="grey" variant="body2">
          SEEKING
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <BalanceIcon size={25} />
          <Typography variant="h5" color="green">
            {props.seeking}
          </Typography>
        </Stack>

        <Typography color="grey" variant="body2">
          CURRENT BID
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <BalanceIcon size={25} />
          <Typography variant="h5" color="green">
            {props.current_bid}
          </Typography>
        </Stack>
      </CardContent>
    </HoverableCard>
  );
};

export default Listing;
