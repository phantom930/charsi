import { QueryResult, useQuery } from "@apollo/client";
import Autocomplete from "@mui/material/Autocomplete";
import Paper, { PaperProps } from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { GAMES } from "@graphql/wp-queries";
import { useEffect, useState } from "react";

interface Props {
  options: Option[];
  onSelect: (item: Option) => void;
  value: Option;
}

interface Option {
  title: string;
  id: number;
}

const PopupPaper = styled(Paper)<PaperProps>(({ theme }) => ({
  boxShadow: theme.shadows[15],
}));

export default function Highlights(props: Props): JSX.Element {
  const { data }: QueryResult = useQuery(GAMES);
  const [_options, setOptions] = useState<Option[]>([]);

  const handleChange = (_e: React.SyntheticEvent, value: Option | null) => {
    if (value) {
      props.onSelect(value);
    }
  };

  useEffect(() => {
    if (data) {
      const filtered = data.games.map((item: any) => ({
        title: item.title,
        id: item.id,
      }));
      setOptions(filtered);
    }
  }, [data]);

  return (
    <Autocomplete
      id="highlights-demo"
      sx={{ width: "100%" }}
      value={props.value}
      onChange={handleChange}
      options={props.options}
      getOptionLabel={(option: Option) => option.title}
      PaperComponent={PopupPaper}
      renderInput={(params: any) => (
        <TextField {...params} label="Highlights" margin="normal" />
      )}
      renderOption={(props, option: Option, { inputValue }) => {
        const matches = match(option.title, inputValue, { insideWords: true });
        const parts = parse(option.title, matches);

        return (
          <li {...props}>
            <div>
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
    />
  );
}
