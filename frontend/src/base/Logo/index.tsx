import SVGLogo from "@styles/icons/logo.svg";
import SVGLogoGradient from "@styles/icons/logo_gradient.svg";

interface Props {
  white?: boolean;
  height: number;
}

const Logo = (props: Props) =>
  props.white ? <SVGLogo /> : <SVGLogoGradient />;

export default Logo;
