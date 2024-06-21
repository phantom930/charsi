import {
  useRef,
  useMemo,
  useEffect,
  useState,
  useImperativeHandle,
  MouseEvent,
  forwardRef,
  ChangeEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Popover from "@mui/material/Popover";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import CollectionsIcon from "@mui/icons-material/Collections";
import TitleIcon from "@mui/icons-material/Title";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import _ from "lodash";

import { UppercaseRoundBtn } from "@base/Button/RoundBtn";
import UploadedImage from "@base/Image/UploadedImage";
//import { ItemTypeIcon } from "@base/Icon";
import HighlightsAutoComplete from "@base/Autocomplete";
import { getImageDataUrl } from "@/helpers";
import {
  getItemMajorCategoriesByGame,
  getItemProperties,
} from "@store/item/item.api";
import type { OptionData } from "@base/Autocomplete";
import type { ExtendedListingQueryData } from "@components/Listing/QuickView/ViewerContent";
import type { GameQueryData } from "@store/game/game.slice";
import type {
  ItemQueryData,
  ItemMajorCategoryQueryData,
  ItemPropertyQueryData,
} from "@store/item/item.slice";
import type { UploadFile } from "@store/listing/listing.slice";
import type { RootState, AppDispatch } from "@/store";

interface ItemEditorProps {
  game?: GameQueryData;
  item: ItemQueryData;
  majorCategoryID?: string;
  listing?: ExtendedListingQueryData;
  isRewardItem?: boolean;
  isItemEditing?: boolean;
  onClose: (event: MouseEvent<HTMLElement>) => void;
  setIsItemEditCompleted?: Function;
}

export interface ItemEditorRef {
  getItemEditData: Function;
}

const StyledPopover = styled(Popover)({
  "& .MuiPopover-paper": {
    borderRadius: "5px !important",
    padding: "5px 10px !important",
  },
});

const ItemEditor = forwardRef<ItemEditorRef, ItemEditorProps>(
  (
    {
      game,
      item,
      majorCategoryID,
      listing,
      isRewardItem = false,
      isItemEditing = false,
      setIsItemEditCompleted,
    }: ItemEditorProps,
    ref
  ) => {
    const itemState = useSelector((state: RootState) => state.item);
    const [quantity, setQuantity] = useState<number>(1);
    const [quantityInputValue, setQuantityInputValue] = useState<number>(1);
    const [anchorElement, setAnchorElement] = useState(null);
    const [itemProperties, setItemProperties] = useState<OptionData[] | []>([]);
    const [selectedItemProperty, setSelectedItemProperty] =
      useState<OptionData>(null);
    const [activeItemProperties, setActiveItemProperties] = useState<
      OptionData[] | []
    >([]);
    const [itemValues, setItemValues] = useState<Object>({});
    const [thumbnails, setThumbnails] = useState<(File | string)[]>([]);
    const [thumbnailDataURLs, setThumbnailDataURLs] = useState<string[]>([]);
    const [isAddedImages, setIsAddedImages] = useState<boolean>(false);
    const [isAddedDescription, setIsAddedDescription] =
      useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const imageFileInputRef = useRef<HTMLInputElement>(null);
    const quantityBox = useRef(null);
    const dispatch: AppDispatch = useDispatch();

    const majorCategory: ItemMajorCategoryQueryData = useMemo(() => {
      if (!(game && majorCategoryID)) return null;

      return _.get(itemState, `itemMajorCategories[${game.id}]`, []).find(
        (itemMajorCategory: ItemMajorCategoryQueryData) =>
          itemMajorCategory.id === majorCategoryID
      );
    }, [itemState, game, majorCategoryID]);

    const itemPropertiesData: OptionData[] | [] = itemProperties.filter(
      (itemProperty: OptionData) =>
        !activeItemProperties.find(
          (selectedItemProperty: OptionData) =>
            selectedItemProperty.id === itemProperty.id
        )
    );

    const handleOpenQuantityPopover = (event: MouseEvent) => {
      event.preventDefault();
      quantityBox.current && setAnchorElement(quantityBox.current);
    };

    const handleCloseQuantityPopover = () => {
      setAnchorElement(null);
      setQuantity(quantityInputValue | 0);
    };

    const handleItemPropertySelect = (_event: any, newOption: OptionData) => {
      setSelectedItemProperty(newOption);
    };

    const handleAddItemProperty = () => {
      if (selectedItemProperty) {
        setActiveItemProperties([
          ...activeItemProperties,
          selectedItemProperty,
        ]);
        setSelectedItemProperty(null);
      }
    };

    const handleValueOfPropChange =
      (prop: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const updatedItemValues = {
          ...itemValues,
          [prop.toLowerCase()]: e.target.value,
        };
        let isItemEditCompleted = false;
        for (let value of Object.values(updatedItemValues)) {
          if (value) {
            isItemEditCompleted = true;
            break;
          }
        }

        !isItemEditing && setIsItemEditCompleted(isItemEditCompleted);
        setItemValues(updatedItemValues);
      };

    const handleAddImage = () => {
      if (imageFileInputRef.current) {
        imageFileInputRef.current.click();
      }
    };

    const handleRemoveImage =
      (index: number) => (_event: MouseEvent<SVGSVGElement>) => {
        const updatedThumbnails = [...thumbnails];
        updatedThumbnails.splice(index, 1);
        setThumbnails(updatedThumbnails);

        const updatedThumbnailDataURLs = [...thumbnailDataURLs];
        updatedThumbnailDataURLs.splice(index, 1);
        setThumbnailDataURLs(updatedThumbnailDataURLs);
      };

    const handleAddDescription = () => {
      setIsAddedDescription(true);
    };

    const handleFileChange = async () => {
      if (imageFileInputRef.current) {
        const files = imageFileInputRef.current.files;
        if (files) {
          const updatedThumbnails = [...thumbnails, ...Array.from(files)];
          const updatedThumbnailDataURLs: string[] = await Promise.all([
            ...thumbnailDataURLs,
            ...Array.from(files).map(async (file: File) => {
              const newImageDataUrl = await getImageDataUrl(file);

              if (newImageDataUrl instanceof ArrayBuffer) {
                const decoder = new TextDecoder("utf-8");
                const stringFromBuffer = decoder.decode(newImageDataUrl);

                return stringFromBuffer;
              }

              return newImageDataUrl as string;
            }),
          ]);

          setThumbnails(updatedThumbnails);
          setThumbnailDataURLs(updatedThumbnailDataURLs);
          setIsAddedImages(true);
        }
      }
    };

    const handleGetItemEditData = () => {
      return {
        values: {
          ...itemValues,
          quantity,
        },
        thumbnails,
        description,
      };
    };

    useEffect(() => {
      dispatch(
        getItemProperties({
          game: game.id,
        })
      );

      dispatch(
        getItemMajorCategoriesByGame({
          game: game.id,
        })
      );
    }, [dispatch, game.id]);

    useEffect(() => {
      if (isItemEditing) {
        setQuantity(_.get(listing, "values.quantity", 1));
        setQuantityInputValue(_.get(listing, "values.quantity", 1));
        if (itemProperties.length) {
          for (let property in _.get(listing, "values", {})) {
            if (property !== "quantity") {
              setActiveItemProperties((prev: OptionData[]) => {
                return [
                  ...prev,
                  itemProperties.find(
                    (itemProperty: OptionData) =>
                      itemProperty.title.toLowerCase() ===
                      property.toLowerCase()
                  ),
                ];
              });
            }
          }
        }
        setItemValues(_.get(listing, "values", {}));
        setDescription(_.get(listing, "description", ""));
        setThumbnails(
          _.get(listing, "images", []).map((image: UploadFile) => image.id)
        );
        setThumbnailDataURLs(
          _.get(listing, "images", []).map((image: UploadFile) => image.url)
        );
        _.get(listing, "images", []).length && setIsAddedImages(true);
        _.get(listing, "description", "") && setIsAddedDescription(true);
      }
    }, [listing, item, isItemEditing, itemProperties]);

    useEffect(() => {
      if (majorCategory) {
        const itemProperties: OptionData[] = _.get(item, "properties", []).map(
          (itemProperty: ItemPropertyQueryData) => ({
            id: itemProperty.id,
            title: itemProperty.name,
            optional: {
              propertyType: itemProperty.propertyType,
            },
          })
        );

        if (majorCategory.isItemType) setItemProperties(itemProperties);
        else setActiveItemProperties(itemProperties);
      }
    }, [item, majorCategory]);

    useImperativeHandle(ref, () => ({
      getItemEditData: handleGetItemEditData,
    }));

    return (
      <Card>
        <CardHeader
          avatar={
            <Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {majorCategory && majorCategory.isItemType === true && (
                  <>
                    <Stack
                      ref={quantityBox}
                      sx={{
                        p: "1px 2px",
                        minWidth: "42px",
                        background: "#F5F5F5",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={handleOpenQuantityPopover}
                    >
                      <Typography
                        color="disabled"
                        align="center"
                        variant="caption"
                        fontSize={10}
                        fontWeight={500}
                      >
                        QTY.
                      </Typography>
                      <Typography
                        color="primary"
                        align="center"
                        variant="caption"
                        fontSize={15}
                        fontWeight={500}
                      >
                        {quantity}X
                      </Typography>
                    </Stack>
                    <StyledPopover
                      open={Boolean(anchorElement)}
                      anchorEl={anchorElement}
                      onClose={handleCloseQuantityPopover}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      TransitionComponent={Fade}
                    >
                      <TextField
                        label="Quantity"
                        color="info"
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        variant="standard"
                        InputProps={{ inputProps: { min: 1 } }}
                        sx={{ width: "50px" }}
                        value={quantityInputValue}
                        onChange={(e) =>
                          setQuantityInputValue(parseInt(e.target.value))
                        }
                      />
                    </StyledPopover>
                  </>
                )}
                <Avatar
                  src={_.get(item, "image.url", "")}
                  sx={{ width: 40, height: 43, border: "2px solid #FF47AA" }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: isItemEditing ? "black" : "white" }}
                >
                  {item.name}
                </Typography>
              </Stack>
              {!isItemEditing && (
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
              )}
            </Stack>
          }
          sx={{
            background: isItemEditing
              ? "#E0E0E0"
              : "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #7C4DFF",
          }}
        />
        <CardContent sx={{ my: 1 }}>
          <Stack spacing={2}>
            <Typography
              variant="body1"
              color="primary"
              sx={{ textTransform: "uppercase", fontWeight: 500 }}
            >
              {isRewardItem && "Desired"} Properties
            </Typography>
            {activeItemProperties.map((itemProperty: OptionData) => (
              <TextField
                key={itemProperty.id}
                label={itemProperty.title}
                type={
                  _.get(itemProperty, "optional.propertyType", "STRING") ===
                  "STRING"
                    ? "text"
                    : "number"
                }
                color="info"
                InputLabelProps={{ shrink: true }}
                variant="standard"
                sx={{ width: "100%" }}
                value={_.get(itemValues, itemProperty.title.toLowerCase(), "")}
                onChange={handleValueOfPropChange(itemProperty.title)}
              />
            ))}
            {majorCategory && majorCategory.isItemType === true && (
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  color="info"
                  variant="outlined"
                  sx={{
                    textTransform: "uppercase",
                    borderRadius: "24px",
                    fontWeight: 500,
                  }}
                  endIcon={<AddIcon />}
                  onClick={handleAddItemProperty}
                >
                  Add Property
                </Button>
                <HighlightsAutoComplete
                  label="Search for properties"
                  value={selectedItemProperty}
                  options={itemPropertiesData}
                  onChange={handleItemPropertySelect}
                />
              </Stack>
            )}
          </Stack>
          <Stack sx={{ mt: 6 }} spacing={3}>
            <Typography
              variant="body1"
              color="primary"
              sx={{ textTransform: "uppercase", fontWeight: 500 }}
            >
              Optional
            </Typography>
            <Stack spacing={2} direction="row">
              {!isRewardItem && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageFileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    multiple
                  />
                  <UppercaseRoundBtn
                    color="info"
                    variant="outlined"
                    sx={{ boxShadow: "none !important" }}
                    endIcon={<CollectionsIcon />}
                    onClick={handleAddImage}
                  >
                    Add Image
                  </UppercaseRoundBtn>
                </>
              )}
              <UppercaseRoundBtn
                color="info"
                variant="outlined"
                sx={{ boxShadow: "none !important" }}
                endIcon={<TitleIcon />}
                onClick={handleAddDescription}
              >
                Add Description
              </UppercaseRoundBtn>
            </Stack>
            <Collapse in={isAddedImages}>
              <Stack spacing={2} direction="row">
                {thumbnailDataURLs.map(
                  (thumbnailDataURL: string, index: number) => (
                    <UploadedImage
                      key={index}
                      src={thumbnailDataURL}
                      onDelete={handleRemoveImage(index)}
                    />
                  )
                )}
              </Stack>
            </Collapse>
            <Collapse in={isAddedDescription}>
              <Box>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  sx={{ width: "100%" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
            </Collapse>
          </Stack>
        </CardContent>
      </Card>
    );
  }
);

ItemEditor.displayName = "ItemEditor";
export default ItemEditor;
