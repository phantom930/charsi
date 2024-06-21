import TextField from "@mui/material/TextField";

// const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
//   function TextMaskCustom(props, ref) {
//     const { onChange, ...other } = props;
//     return (
//       <IMaskInput
//         {...other}
//         mask="(#00) 000-0000"
//         definitions={{
//           '#': /[1-9]/,
//         }}
//         inputRef={ref}
//         onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
//         overwrite
//       />
//     );
//   },
// );

const PhoneNumber = () => {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Enter phone number"
      placeholder="555-555-5555"
      // InputProps={{
      //   startAdornment: (
      //     <InputAdornment position="start">
      //       <PhoneAndroidIcon />
      //     </InputAdornment>
      //   ),
      // }}
      variant="outlined"
      // inputProps={TextMaskCustom as any}
    />
  );
};

export default PhoneNumber;
