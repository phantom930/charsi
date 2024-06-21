import {
  useEffect,
  useState,
  useCallback,
  useContext,
  ChangeEvent,
  KeyboardEvent,
  SyntheticEvent,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import Stack from "@mui/material/Stack";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Theme, styled } from "@mui/material/styles";
import _ from "lodash";

import BalanceInput from "@base/Input/BalanceInput";
import FullHeightSkeleton from "@base/Skeleton";
import { CharsiContext } from "@providers/CharsiProvider";
import {
  getItemMajorCategoriesByGame,
  getItemMinorCategories,
  getItemSubCategories,
  getItemProperties,
} from "@store/item/item.api";
import type { GameQueryData } from "@store/game/game.slice";
import type {
  ItemMajorCategoryQueryData,
  ItemMinorCategoryQueryData,
  ItemSubCategoryQueryData,
  ItemPropertyQueryData,
} from "@store/item/item.slice";
import { RootState, AppDispatch } from "@/store";

const StyledAsideHeader = styled(Typography)({
  fontWeight: 500,
  textTransform: "uppercase",
  paddingBottom: "10px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
});

const StyledAsideSubHeader = styled(Typography)({
  color: "rgba(0, 0, 0, 0.6)",
});

const StyledFormControlLabel = styled(FormControlLabel)({
  "& .MuiTypography-root": {
    fontWeight: 400,
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.87) !important",
  },
});

export interface FilterOptionsProps {
  isForGame?: boolean;
  gameID?: string | null;
  onFilterChange: Function;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))({
  borderWidth: 0,
  color: "rgba(0, 0, 0, 0.6)",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
});

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
  backgroundColor: "#fff",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)({
  padding: 0,
  marginLeft: 8,
  maxHeight: 300,
  overflowY: "scroll",
});

type FilterKey =
  | "itemMajorCategory"
  | "itemSubCategory"
  | "itemProperty"
  | "rewardGame"
  | "seekingBalance";

const FilterOptions = ({
  isForGame,
  gameID,
  onFilterChange,
}: FilterOptionsProps) => {
  const gameState = useSelector((state: RootState) => state.game);
  const itemState = useSelector((state: RootState) => state.item);
  const [filter, setFilter] = useState<object>({});
  const [expanded, setExpanded] = useState<object>({});
  const [minBalance, setMinBalance] = useState<string>("");
  const [maxBalance, setMaxBalance] = useState<string>("");
  const { getGamesData } = useContext(CharsiContext);
  const breakpointsMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up("md")
  );
  const dispatch: AppDispatch = useDispatch();

  const handleCheckCharsiBalance = (event: ChangeEvent<HTMLInputElement>) => {
    let updatedFilter = _.cloneDeep(filter);
    if (!updatedFilter.seekingBalance) {
      updatedFilter.seekingBalance = {};
    }

    updatedFilter.seekingBalance.checked = event.target.checked;
    setFilter(updatedFilter);
    handleFireFilterChange(updatedFilter);
  };

  const handleSetFilter =
    (
      key: FilterKey,
      value:
        | string
        | ItemMajorCategoryQueryData
        | ItemSubCategoryQueryData
        | GameQueryData
        | ItemPropertyQueryData
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      let updatedFilter = _.cloneDeep(filter);
      if (key === "seekingBalance") {
        const num = value === "min" ? minBalance : maxBalance;
        if (num) {
          _.set(updatedFilter, `${key}.${value}`, Number(num));
        } else {
          delete updatedFilter[key][value];
          !updatedFilter[key] && delete updatedFilter[key];
        }
      } else if (key === "itemProperty") {
        if (!updatedFilter[key]) updatedFilter[key] = {};
        if (
          !updatedFilter[key][
            (value as ItemPropertyQueryData).name.toLowerCase()
          ]
        )
          updatedFilter[key][
            (value as ItemPropertyQueryData).name.toLowerCase()
          ] = {
            checked: event.target.checked,
            property: value,
          };
        else
          updatedFilter[key][
            (value as ItemPropertyQueryData).name.toLowerCase()
          ].checked = event.target.checked;
      } else {
        const { checked } = event.target;
        if (checked) {
          if (updatedFilter[key]) {
            updatedFilter[key].push(value);
          } else {
            updatedFilter[key] = [value];
          }
        } else {
          updatedFilter[key] = updatedFilter[key].filter(
            (
              item:
                | ItemMajorCategoryQueryData
                | ItemSubCategoryQueryData
                | GameQueryData
            ) => item.id !== (value as any).id
          );
          if (updatedFilter[key].length === 0) {
            delete updatedFilter[key];
          }
        }
      }

      setFilter(updatedFilter);

      let newFilter = _.cloneDeep(updatedFilter);
      if (key === "itemMajorCategory") {
        if (!newFilter.itemMajorCategory) {
          if (newFilter.itemSubCategory)
            newFilter.itemSubCategory = [...updatedFilter.itemSubCategory];
          if (newFilter.itemProperty)
            newFilter.itemProperty = { ...updatedFilter.itemProperty };
        } else {
          if (newFilter.itemSubCategory) {
            newFilter.itemSubCategory = newFilter.itemSubCategory.filter(
              (subCategory: ItemSubCategoryQueryData) =>
                _.intersection(
                  subCategory.suzerainMajorCategories.map(
                    (majorCategory: ItemMajorCategoryQueryData) =>
                      majorCategory.id
                  ),
                  _.get(updatedFilter, "itemMajorCategory", []).map(
                    (majorCategory: ItemMajorCategoryQueryData) =>
                      majorCategory.id
                  )
                ).length > 0
            );
            if (newFilter.itemSubCategory.length === 0) {
              delete newFilter.itemSubCategory;
            }
          }

          if (newFilter.itemProperty) {
            let updatedItemProperty = {};
            Object.keys(newFilter["itemProperty"]).forEach(
              (property: string) => {
                if (
                  _.intersection(
                    newFilter["itemProperty"][
                      property
                    ].property.suzerainMajorCategories.map(
                      (majorCategory: ItemMajorCategoryQueryData) =>
                        majorCategory.id
                    ),
                    _.get(updatedFilter, "itemMajorCategory", []).map(
                      (majorCategory: ItemMajorCategoryQueryData) =>
                        majorCategory.id
                    )
                  ).length > 0
                ) {
                  updatedItemProperty[property] =
                    newFilter["itemProperty"][property];
                  delete updatedItemProperty[property].property;
                }
              }
            );

            if (!Object.keys(updatedItemProperty).length)
              delete newFilter["itemProperty"];
            else newFilter["itemProperty"] = updatedItemProperty;
          }
        }
      }

      handleFireFilterChange(newFilter);
    };

  const handleFireFilterChange = (filter: object) => {
    const updatedFilter = _.cloneDeep(filter);
    Object.keys(updatedFilter).forEach((key: FilterKey) => {
      switch (key) {
        case "itemMajorCategory":
        case "itemSubCategory":
        case "rewardGame":
          updatedFilter[key] = updatedFilter[key].map((item: any) => item.id);
          break;
        case "itemProperty":
          let updatedItemProperty = {};
          Object.keys(updatedFilter[key]).forEach((property: string) => {
            if (
              updatedFilter[key][property].checked &&
              (updatedFilter[key][property].min ||
                updatedFilter[key][property].max ||
                updatedFilter[key][property].value)
            ) {
              updatedItemProperty[property] = updatedFilter[key][property];
              delete updatedItemProperty[property].property;
            }
          });

          if (!Object.keys(updatedItemProperty).length)
            delete updatedFilter[key];
          else updatedFilter[key] = updatedItemProperty;
          break;
        case "seekingBalance":
          if (
            !(
              updatedFilter[key].checked &&
              (updatedFilter[key].min || updatedFilter[key].max)
            )
          )
            delete updatedFilter[key];

          break;
      }
    });

    onFilterChange(updatedFilter);
  };

  const handleChangeItemPropertyAggregates =
    (property: ItemPropertyQueryData, type: "min" | "max") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      let updatedFilter = _.cloneDeep(filter);
      updatedFilter.itemProperty[property.name.toLowerCase()][type] = Number(
        event.target.value
      );
      if (!event.target.value)
        delete updatedFilter.itemProperty[property.name.toLowerCase()][type];
      setFilter(updatedFilter);
    };

  const handleChangeItemPropertyValue =
    (property: ItemPropertyQueryData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      let updatedFilter = _.cloneDeep(filter);
      updatedFilter.itemProperty[property.name.toLowerCase()].value =
        event.target.value;
      if (!event.target.value)
        delete updatedFilter.itemProperty[property.name.toLowerCase()].value;
      setFilter(updatedFilter);
    };

  const isExpanded = useCallback(
    (panel: string) => {
      return expanded[panel] || false;
    },
    [expanded]
  );

  const handleAccordionChange = useCallback(
    (panel: string) => (_event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded({
        ...expanded,
        [panel]: newExpanded,
      });
    },
    [expanded]
  );

  const isMinorCategoryHasCheckedValues = useCallback(
    (game: string, minorCategoryID: string) => {
      return (
        _.intersection(
          _.get(
            itemState,
            `itemSubCategories.[${game}][${minorCategoryID}]`,
            []
          ).map(
            (itemSubCategory: ItemSubCategoryQueryData) => itemSubCategory.id
          ),
          _.get(filter, "itemSubCategory", []).map(
            (subCategory: ItemSubCategoryQueryData) => subCategory.id
          )
        ).length > 0
      );
    },
    [filter, itemState]
  );

  const isPropertyHasCheckedValues = useCallback(() => {
    return (
      _.findIndex(
        Object.values(_.get(filter, "itemProperty", {})),
        (property: any) =>
          property.checked === true &&
          (property.min || property.max || property.value)
      ) > -1
    );
  }, [filter]);

  const isSellerHasCheckedValues = useCallback(() => {
    return (
      (filter["seekingBalance"] &&
        filter["seekingBalance"].checked &&
        (filter["seekingBalance"].min || filter["seekingBalance"].max)) ||
      (filter["rewardGame"] && filter["rewardGame"].length > 0)
    );
  }, [filter]);

  const isMinorCategoryIncludedForMajorCategories = useCallback(
    (minorCategory: ItemMinorCategoryQueryData) => {
      return (
        _.intersection(
          minorCategory.suzerainMajorCategories.map(
            (majorCategory: ItemMajorCategoryQueryData) => majorCategory.id
          ),
          _.get(filter, "itemMajorCategory", []).map(
            (majorCategory: ItemMajorCategoryQueryData) => majorCategory.id
          )
        ).length > 0
      );
    },
    [filter]
  );

  const isSubCategoryIncludedForMajorCategories = useCallback(
    (subCategory: ItemSubCategoryQueryData) => {
      return (
        _.intersection(
          subCategory.suzerainMajorCategories.map(
            (majorCategory: ItemMajorCategoryQueryData) => majorCategory.id
          ),
          _.get(filter, "itemMajorCategory", []).map(
            (majorCategory: ItemMajorCategoryQueryData) => majorCategory.id
          )
        ).length > 0
      );
    },
    [filter]
  );

  const isPropertyIncludedForMajorCategories = useCallback(
    (property: ItemPropertyQueryData) => {
      return (
        _.intersection(
          property.suzerainMajorCategories.map(
            (majorCategory: ItemMajorCategoryQueryData) => majorCategory.id
          ),
          _.get(filter, "itemMajorCategory", []).map(
            (majorCategory: ItemMajorCategoryQueryData) => majorCategory.id
          )
        ).length > 0
      );
    },
    [filter]
  );

  useEffect(() => {
    getGamesData();
  }, [getGamesData]);

  useEffect(() => {
    if (isForGame && gameID) {
      dispatch(
        getItemMajorCategoriesByGame({
          game: gameID,
        })
      );
      dispatch(
        getItemMinorCategories({
          game: gameID,
        })
      );
      dispatch(
        getItemSubCategories({
          game: gameID,
        })
      );
      dispatch(
        getItemProperties({
          game: gameID,
        })
      );
    }
  }, [dispatch, gameID, isForGame]);

  return (
    <Stack pr={5}>
      <StyledAsideHeader variant="h6">Filters</StyledAsideHeader>
      <Accordion
        expanded={isExpanded("category")}
        onChange={handleAccordionChange("category")}
        sx={{ mt: "24px !important" }}
      >
        <AccordionSummary>
          <Typography
            color={
              _.get(filter, "itemMajorCategory", []).length > 0
                ? "primary"
                : "disabled"
            }
          >
            Item Category
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {isForGame &&
            gameID &&
            itemState.isItemMajorCategoriesLoading === false ? (
              <FormGroup
                sx={{ flexDirection: breakpointsMd ? "column" : "row" }}
              >
                {_.get(itemState, `itemMajorCategories.[${gameID}]`, []).map(
                  (category: ItemMajorCategoryQueryData) => (
                    <StyledFormControlLabel
                      key={category.id}
                      control={
                        <Checkbox
                          checked={
                            (filter["itemMajorCategory"] &&
                              filter["itemMajorCategory"].findIndex(
                                (item: ItemMajorCategoryQueryData) =>
                                  item.id === category.id
                              ) > -1) ||
                            false
                          }
                          onChange={handleSetFilter(
                            "itemMajorCategory",
                            category
                          )}
                        />
                      }
                      label={category.name}
                    />
                  )
                )}
              </FormGroup>
            ) : breakpointsMd ? (
              <FullHeightSkeleton width={300} height={126} />
            ) : (
              <Typography variant="h4">
                <Skeleton />
              </Typography>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
      {isForGame &&
        gameID &&
        itemState.isItemMinorCategoriesLoading === false &&
        _.get(itemState, `itemMinorCategories.[${gameID}]`, []).map(
          (minorCategory: ItemMinorCategoryQueryData) =>
            (_.get(filter, "itemMajorCategory", []).length === 0 ||
              isMinorCategoryIncludedForMajorCategories(minorCategory)) && (
              <Accordion
                key={minorCategory.id}
                expanded={isExpanded(minorCategory.name)}
                onChange={handleAccordionChange(minorCategory.name)}
              >
                <AccordionSummary>
                  <Typography
                    variant="subtitle1"
                    color={
                      isMinorCategoryHasCheckedValues(gameID, minorCategory.id)
                        ? "primary"
                        : "disabled"
                    }
                  >
                    {minorCategory.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {itemState.isItemSubCategoriesLoading === false ? (
                      <FormGroup
                        sx={{ flexDirection: breakpointsMd ? "column" : "row" }}
                      >
                        {_.get(
                          itemState,
                          `itemSubCategories.[${gameID}][${minorCategory.id}]`,
                          []
                        ).map(
                          (subCategory: ItemSubCategoryQueryData) =>
                            (_.get(filter, "itemMajorCategory", []).length ===
                              0 ||
                              isSubCategoryIncludedForMajorCategories(
                                subCategory
                              )) && (
                              <StyledFormControlLabel
                                key={subCategory.id}
                                control={
                                  <Checkbox
                                    checked={
                                      (filter["itemSubCategory"] &&
                                        filter["itemSubCategory"].findIndex(
                                          (item: ItemSubCategoryQueryData) =>
                                            item.id === subCategory.id
                                        ) > -1) ||
                                      false
                                    }
                                    onChange={handleSetFilter(
                                      "itemSubCategory",
                                      subCategory
                                    )}
                                  />
                                }
                                label={subCategory.name}
                              />
                            )
                        )}
                      </FormGroup>
                    ) : breakpointsMd ? (
                      <FullHeightSkeleton width={300} height={126} />
                    ) : (
                      <Typography variant="h4">
                        <Skeleton />
                      </Typography>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            )
        )}

      <Accordion
        expanded={isExpanded("properties")}
        onChange={handleAccordionChange("properties")}
        sx={{ mt: 3 }}
      >
        <AccordionSummary>
          <Typography
            variant="subtitle1"
            color={isPropertyHasCheckedValues() ? "primary" : "disabled"}
          >
            Item Properties
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {isForGame &&
            gameID &&
            itemState.isItemPropertiesLoading === false ? (
              <FormGroup
                sx={{ flexDirection: breakpointsMd ? "column" : "row" }}
              >
                {_.get(itemState, `itemProperties.[${gameID}]`, []).map(
                  (property: ItemPropertyQueryData) =>
                    (_.get(filter, "itemMajorCategory", []).length === 0 ||
                      isPropertyIncludedForMajorCategories(property)) && (
                      <>
                        <StyledFormControlLabel
                          key={property.id}
                          control={
                            <Checkbox
                              checked={_.get(
                                filter,
                                `itemProperty[${property.name.toLowerCase()}].checked`,
                                false
                              )}
                              onChange={handleSetFilter(
                                "itemProperty",
                                property
                              )}
                            />
                          }
                          label={property.name}
                        />
                        <Collapse
                          in={_.get(
                            filter,
                            `itemProperty[${property.name.toLowerCase()}].checked`,
                            false
                          )}
                        >
                          {property.propertyType === "NUMBER" ? (
                            <Stack direction="row" spacing={2} mb={1} pr={3}>
                              <TextField
                                label=""
                                type="number"
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                                placeholder="Min"
                                value={_.get(
                                  filter,
                                  `itemProperty[${property.name.toLowerCase()}].min`,
                                  ""
                                )}
                                onChange={handleChangeItemPropertyAggregates(
                                  property,
                                  "min"
                                )}
                                onKeyDown={(e: KeyboardEvent) =>
                                  e.key === "Enter" &&
                                  handleFireFilterChange(filter)
                                }
                              />
                              <TextField
                                label=""
                                type="number"
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                                placeholder="Max"
                                value={_.get(
                                  filter,
                                  `itemProperty[${property.name.toLowerCase()}].max`,
                                  ""
                                )}
                                onChange={handleChangeItemPropertyAggregates(
                                  property,
                                  "max"
                                )}
                                onKeyDown={(e: KeyboardEvent) =>
                                  e.key === "Enter" &&
                                  handleFireFilterChange(filter)
                                }
                              />
                            </Stack>
                          ) : (
                            <TextField
                              label=""
                              type="text"
                              variant="standard"
                              InputLabelProps={{ shrink: true }}
                              placeholder={property.name}
                              value={_.get(
                                filter,
                                `itemProperty[${property.name.toLowerCase()}].value`,
                                ""
                              )}
                              onChange={handleChangeItemPropertyValue(property)}
                              onKeyDown={(e: KeyboardEvent) =>
                                e.key === "Enter" &&
                                handleFireFilterChange(filter)
                              }
                            />
                          )}
                        </Collapse>
                      </>
                    )
                )}
              </FormGroup>
            ) : breakpointsMd ? (
              <FullHeightSkeleton width={300} height={220} />
            ) : (
              <FullHeightSkeleton height={85} />
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={isExpanded("forSeller")}
        onChange={handleAccordionChange("forSeller")}
      >
        <AccordionSummary>
          <Typography
            variant="subtitle1"
            color={isSellerHasCheckedValues() ? "primary" : "disabled"}
          >
            Seller is looking for
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            {gameState.games.length > 0 ? (
              <FormGroup
                sx={{ flexDirection: breakpointsMd ? "column" : "row" }}
              >
                <StyledFormControlLabel
                  control={
                    <Checkbox
                      checked={_.get(filter, "seekingBalance.checked", false)}
                      onChange={handleCheckCharsiBalance}
                    />
                  }
                  label="Charsi Balance"
                />
                {gameState.games.map((game: GameQueryData) => (
                  <StyledFormControlLabel
                    key={game.id}
                    control={
                      <Checkbox
                        checked={
                          (filter["rewardGame"] &&
                            filter["rewardGame"].findIndex(
                              (rewardGame: GameQueryData) =>
                                game.id === rewardGame.id
                            ) > -1) ||
                          false
                        }
                        onChange={handleSetFilter("rewardGame", game)}
                      />
                    }
                    label={`${game.title} items`}
                  />
                ))}
              </FormGroup>
            ) : breakpointsMd ? (
              <FullHeightSkeleton width={300} height={250} />
            ) : (
              <FullHeightSkeleton height={170} />
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Collapse in={_.get(filter, "seekingBalance.checked", false)}>
        <Stack>
          <StyledAsideSubHeader variant="subtitle1">
            Price Range
          </StyledAsideSubHeader>
          <Stack direction="row" spacing={2}>
            <BalanceInput
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
              onKeyDown={(e: KeyboardEvent) =>
                e.key === "Enter" &&
                handleSetFilter("seekingBalance", "min")(null)
              }
              //onBlur={() => handleSetFilter("seekingBalance", "min")(null)}
              placeholder="Min"
            />
            <BalanceInput
              value={maxBalance}
              onChange={(e) => setMaxBalance(e.target.value)}
              onKeyDown={(e: KeyboardEvent) =>
                e.key === "Enter" &&
                handleSetFilter("seekingBalance", "max")(null)
              }
              //onBlur={() => handleSetFilter("seekingBalance", "max")(null)}
              placeholder="Max"
            />
          </Stack>
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default FilterOptions;
