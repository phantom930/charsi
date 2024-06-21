const Divider = ({ direction, sx = undefined, ...rest }) => {
  return (
    <hr
      style={
        direction === "horizontal"
          ? { borderTop: "0.5px solid #9E9E9E", ...sx }
          : { borderLeft: "0.5px solid #9E9E9E", ...sx }
      }
      {...rest}
    />
  );
};

export default Divider;
