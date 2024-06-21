import {
  useEffect,
  useState,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { EventEmitter } from "events";
import _ from "lodash";

import SlideGameSelector from "@modules/SlideGameSelector/SlideGameSelector";
import HighlightsAutoComplete, { OptionData } from "@base/Autocomplete";
import { UppercaseRoundBtn } from "@base/Button/RoundBtn";
import StyledChip from "@base/Chip";
//import { ItemTypeIcon } from "@base/Icon";
import { getItemMajorCategoriesByGame, getItems } from "@store/item/item.api";
import ItemEditor from "./ItemEditor";
import type { GameQueryData } from "@store/game/game.slice";
import type {
  ItemQueryData,
  ItemMajorCategoryQueryData,
} from "@store/item/item.slice";
import type { ItemEditorRef } from "./ItemEditor";
import type { AppDispatch, RootState } from "@/store";

export interface AddItemRef {
  isItemEditCompleted: Boolean;
  getItemDetail: Function;
}

interface AddItemProps {
  index?: number;
  isRewardItem?: boolean;
  emitter: EventEmitter;
  onRemove?: Function;
}

export interface ItemDetails {
  game: string;
  itemMajorCategory: string;
  item: string;
  itemValues: any;
}

const AddItem = forwardRef<AddItemRef, AddItemProps>(
  (
    {
      index: componentIndex,
      isRewardItem = false,
      onRemove,
      emitter,
    }: AddItemProps,
    ref
  ) => {
    const itemState = useSelector((state: RootState) => state.item);
    const [isItemEditCompleted, setIsItemEditCompleted] =
      useState<boolean>(false);
    const [
      isStartedItemMajorCategorySelect,
      setIsStartedItemMajorCategorySelect,
    ] = useState<boolean>(false);
    const [isStartedItemSelect, setIsStartedItemSelect] =
      useState<boolean>(false);
    const [isStartedItemEdit, setIsStartedItemEdit] = useState<boolean>(false);
    const [selectedGame, setSelectedGame] = useState<GameQueryData>(null);
    const [selectedItemMajorCategoryId, setSelectedItemMajorCategoryId] =
      useState<string>("");
    const [selectedItem, setSelectedItem] = useState<OptionData>(null);
    const itemEditorRef = useRef<ItemEditorRef>(null);
    const dispatch: AppDispatch = useDispatch();

    const items: OptionData[] | [] = useMemo(() => {
      if (!(selectedGame && selectedItemMajorCategoryId)) return [];

      return _.get(
        itemState,
        `items[${selectedGame.id}][${selectedItemMajorCategoryId}]`,
        []
      ).map((item: ItemQueryData) => ({
        id: item.id,
        title: item.name,
        image: item.image.url,
        optional: {
          properties: item.properties,
        },
      }));
    }, [itemState, selectedGame, selectedItemMajorCategoryId]);

    const selectedFullItem: ItemQueryData = useMemo(() => {
      if (!selectedItem) return null;
      return {
        id: selectedItem.id,
        name: selectedItem.title,
        image: {
          id: "",
          url: selectedItem.image,
        },
        properties: selectedItem.optional.properties,
      };
    }, [selectedItem]);

    const handleGameSelect = (game: GameQueryData) => {
      setSelectedGame(game);
      setSelectedItem(null);
      setIsStartedItemMajorCategorySelect(true);
      setIsItemEditCompleted(false);
    };

    const handleItemMajorCategorySelect = (itemMajorCategoryId: string) => {
      setSelectedItemMajorCategoryId(itemMajorCategoryId);
      setSelectedItem(null);
      setIsStartedItemSelect(true);
      setIsItemEditCompleted(false);
    };

    const handleItemSelect = (_event: any, newOption: OptionData) => {
      setSelectedItem(newOption);
      setIsStartedItemEdit(true);
      setIsItemEditCompleted(false);
    };

    const handleItemEditorClose = () => {
      setSelectedItem(null);
      setIsItemEditCompleted(false);
    };

    const handleGetItemDetail: () => ItemDetails | null = () => {
      if (!isItemEditCompleted) return null;

      return {
        game: selectedGame.id,
        itemMajorCategory: selectedItemMajorCategoryId,
        item: selectedFullItem.id,
        itemValues: itemEditorRef.current.getItemEditData(),
      };
    };

    const handleItemEditCompletedChange = (newState: boolean) => {
      setIsItemEditCompleted(newState);
    };

    useEffect(() => {
      if (selectedGame) {
        dispatch(
          getItemMajorCategoriesByGame({
            game: selectedGame.id,
          })
        );
      }
    }, [dispatch, selectedGame]);

    useEffect(() => {
      if (selectedGame && selectedItemMajorCategoryId) {
        dispatch(
          getItems({
            game: selectedGame.id,
            majorCategory: selectedItemMajorCategoryId,
          })
        );
      }
    }, [dispatch, selectedGame, selectedItemMajorCategoryId]);

    useEffect(() => {
      emitter.emit("itemEditCompletedChange", isItemEditCompleted);
    }, [isItemEditCompleted, emitter]);

    useImperativeHandle(ref, () => ({
      isItemEditCompleted,
      getItemDetail: handleGetItemDetail,
    }));

    return (
      <Grid container>
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={2}
            mt={5}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {!isRewardItem && (
              <StyledChip
                label={`Item #${componentIndex}`}
                color="secondary"
                sx={{ textTransform: "uppercase" }}
              />
            )}
            <Typography variant="h5">Select game</Typography>
            <IconButton
              aria-label="settings"
              sx={{
                color: "rgba(0, 0, 0, 0.56)",
                ml: "auto !important",
                mr: "20px !important",
              }}
              onClick={() => onRemove()}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" mt={3} alignItems="center" width={450}>
            <SlideGameSelector
              size="medium"
              active={_.get(selectedGame, "id", "")}
              onSelect={handleGameSelect}
            />
          </Stack>
          <Collapse in={isStartedItemMajorCategorySelect}>
            <Stack mt={3} direction="row" gap={2} flexWrap="wrap">
              {_.get(
                itemState,
                `itemMajorCategories.[${_.get(selectedGame, "id", "")}]`,
                []
              ).map((itemMajorCategory: ItemMajorCategoryQueryData) => (
                <UppercaseRoundBtn
                  key={itemMajorCategory.id}
                  color={
                    itemMajorCategory.id === selectedItemMajorCategoryId
                      ? "primary"
                      : "disabled"
                  }
                  variant="contained"
                  onClick={() => {
                    handleItemMajorCategorySelect(itemMajorCategory.id);
                  }}
                >
                  {itemMajorCategory.name}
                </UppercaseRoundBtn>
              ))}
            </Stack>
          </Collapse>
          <Collapse in={isStartedItemSelect}>
            <Stack mt={3} sx={{ width: "450px" }}>
              <HighlightsAutoComplete
                label="Search for item"
                value={selectedItem}
                options={items}
                renderInputStyle={{
                  "& .MuiInputBase-root": {
                    fontWeight: 700,
                    fontSize: "16px",
                    color: "#F57C00",
                  },
                }}
                onChange={handleItemSelect}
              />
            </Stack>
          </Collapse>
        </Grid>
        <Collapse in={isStartedItemEdit}>
          <Grid item xs={12} sx={{ pt: 3 }}>
            {selectedFullItem && (
              <ItemEditor
                ref={itemEditorRef}
                game={selectedGame}
                majorCategoryID={selectedItemMajorCategoryId}
                item={selectedFullItem}
                isRewardItem={isRewardItem}
                onClose={handleItemEditorClose}
                setIsItemEditCompleted={handleItemEditCompletedChange}
              />
            )}
          </Grid>
        </Collapse>
      </Grid>
    );
  }
);

AddItem.displayName = "AddItem";

export default AddItem;
