import { MouseEvent } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import _ from "lodash";

import UploadedImage from "@base/Image/UploadedImage";
import BootstrapDialogTitle from "@components/Listing/BootstrapDialogTitle";
import type { ExtendedListingQueryData } from "@components/Listing/QuickView/ViewerContent";
import type { ItemMajorCategoryQueryData } from "@store/item/item.slice";
import type { UploadFile } from "@store/listing/listing.slice";

interface UpdateItemProps {
  listing: ExtendedListingQueryData | null;
  open: boolean;
  onClose: (event: MouseEvent) => any;
}

const ItemViewer = ({ listing, open, onClose }: UpdateItemProps) => {
  if (!listing) return null;

  const { game, item, values, images } = listing;
  const { quantity, ...rest } = values as any;

  const majorCategory: ItemMajorCategoryQueryData = _.get(
    item,
    "majorCategory",
    null
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <BootstrapDialogTitle onClose={onClose}>
        {_.get(listing, "item.name", "")}
      </BootstrapDialogTitle>
      <DialogContent>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <Card>
            <CardHeader
              avatar={
                <Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {majorCategory.name.toLowerCase() !== "services" && (
                      <Stack
                        sx={{
                          p: "1px 2px",
                          minWidth: "42px",
                        }}
                      >
                        <Typography
                          color="white"
                          align="center"
                          variant="body2"
                          fontWeight={500}
                        >
                          QTY.
                        </Typography>
                        <Typography
                          color="white"
                          align="center"
                          variant="h6"
                          fontWeight={500}
                        >
                          {(listing.values as any).quantity}X
                        </Typography>
                      </Stack>
                    )}
                    <Avatar
                      src={_.get(item, "image.url", "")}
                      sx={{
                        width: 40,
                        height: 43,
                        border: "2px solid #FF47AA",
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "white" }}>
                      {item.name}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ display: "flex", alignItems: "center", mt: 2 }}
                  >
                    <Chip
                      label={game.title}
                      color="primary"
                      deleteIcon={
                        <Avatar
                          src={game.image.url}
                          sx={{ width: 27, height: 27 }}
                        />
                      }
                      onDelete={() => {}}
                      sx={{
                        textTransform: "uppercase",
                        fontSize: "15px !important",
                      }}
                    />
                    <Chip
                      label={majorCategory.name}
                      color="primary"
                      sx={{
                        textTransform: "uppercase",
                        fontSize: "15px !important",
                      }}
                    />
                  </Stack>
                </Stack>
              }
              sx={{
                background:
                  "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #7C4DFF",
              }}
            />
            <CardContent sx={{ my: 1 }}>
              <Stack spacing={2}>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ textTransform: "uppercase", fontWeight: 500 }}
                >
                  Properties
                </Typography>
                {Object.keys(rest).map(
                  (itemProperty: string, index: number) => (
                    <Stack key={index} direction="row" spacing={3}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        textTransform="uppercase"
                      >
                        {itemProperty}:
                      </Typography>
                      <Typography variant="h6" fontWeight={500} ml={2}>
                        {rest[itemProperty]}
                      </Typography>
                    </Stack>
                  )
                )}
              </Stack>
              {images && images.length > 0 && (
                <Stack sx={{ mt: 4 }} spacing={2}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ textTransform: "uppercase", fontWeight: 500 }}
                  >
                    Images
                  </Typography>
                  <Stack spacing={2} direction="row">
                    {images.map((image: UploadFile) => (
                      <UploadedImage key={image.id} src={image.url} />
                    ))}
                  </Stack>
                </Stack>
              )}
              {listing.description && (
                <Stack sx={{ mt: 4 }} spacing={2}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ textTransform: "uppercase", fontWeight: 500 }}
                  >
                    Description
                  </Typography>
                  <Box>
                    <Typography variant="h6" color="#000">
                      {listing.description}
                    </Typography>
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default ItemViewer;
