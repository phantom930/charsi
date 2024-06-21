import Typography, { TypographyProps } from "@mui/material/Typography";

interface BlockQuoteProps extends TypographyProps {
  children: React.ReactNode;
}
const BlockQuote = ({ children, ...props }: BlockQuoteProps) => {
  return <Typography {...props}>&#8220;{children}&#8221;</Typography>;
};

export default BlockQuote;
