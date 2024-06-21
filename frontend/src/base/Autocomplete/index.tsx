import { forwardRef, ForwardedRef } from "react";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import type { RootState } from "@/store";

const StyledChip = styled(Chip)({
  textTransform: "uppercase",
});

export interface OptionData {
  id?: string;
  title: string;
  image?: string;
  optional?: {
    [x: string]: any;
  };
}

interface AutocompleteProps {
  label: string;
  value: OptionData | null;
  options: OptionData[];
  renderInputStyle?: any;
  onChange: (event: any, newValue: OptionData | null) => void;
  [x: string]: any;
}

type AutocompleteType = typeof Autocomplete;

// eslint-disable-next-line react/display-name
const HighlightsAutoComplete = forwardRef(
  (
    {
      label,
      value,
      options,
      renderInputStyle = {},
      onChange,
      ...rest
    }: AutocompleteProps,
    ref: ForwardedRef<AutocompleteType>
  ) => {
    const { id } = useSelector((state: RootState) => state.auth);

    const chipProps = (trade) => {
      switch (trade.status) {
        case "TRADING":
          return { label: "Trade in Progress", color: "warning" };
        case "TRADED":
          return id === trade.listing_reward.owner.id
            ? { label: "Items Traded", color: "primary" }
            : id === trade.bid.owner.id
            ? { label: "Items Received", color: "secondary" }
            : { label: "", color: "" };
      }
    };

    return (
      <Autocomplete
        ref={ref}
        sx={{ width: 280 }}
        value={value}
        options={options}
        getOptionLabel={(option: OptionData) => option.title}
        isOptionEqualToValue={(option: OptionData, value: OptionData) =>
          option.id === value.id || option.title === value.title
        }
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="standard"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            value=""
            sx={{ ...renderInputStyle }}
          />
        )}
        renderOption={(props, option, { inputValue }) => {
          const matches = match(option.title, inputValue, {
            insideWords: true,
          });
          const parts = parse(option.title, matches);

          return (
            <li {...props}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {option.image && (
                  <Avatar
                    src={option.image}
                    sx={{ width: "32px", height: "32px", mr: 1 }}
                    alt={option.title}
                  />
                )}
                {option.optional && option.optional?.trade && (
                  <StyledChip
                    {...(chipProps(option.optional?.trade) as any)}
                    sx={{ mr: 2 }}
                  />
                )}
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400,
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </li>
          );
        }}
        {...rest}
      />
    );
  }
);

export default HighlightsAutoComplete;
