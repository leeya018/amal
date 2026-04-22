import { Text, type TextProps } from "react-native";

type Variant = "display" | "title" | "heading" | "body" | "caption" | "label";
type Tone    = "default" | "muted" | "faint" | "inverse" | "accent" | "danger";

const variantClass: Record<Variant, string> = {
  display: "font-bold text-[34px] leading-[41px] tracking-tight",
  title:   "font-bold text-[28px] leading-[34px] tracking-tight",
  heading: "font-medium text-[17px] leading-[22px]",
  body:    "font-sans text-[17px] leading-[22px]",
  caption: "font-sans text-[13px] leading-[18px]",
  label:   "font-medium text-[15px] leading-[20px]",
};

const toneClass: Record<Tone, string> = {
  default: "text-ink",
  muted:   "text-ink-muted",
  faint:   "text-ink-faint",
  inverse: "text-white",
  accent:  "text-accent-500",
  danger:  "text-danger",
};

type Props = TextProps & {
  variant?: Variant;
  tone?:    Tone;
};

export const Txt = ({ variant = "body", tone = "default", className, style, ...rest }: Props) => (
  <Text
    className={`${variantClass[variant]} ${toneClass[tone]} ${className ?? ""}`}
    style={[{ writingDirection: "rtl", textAlign: "right" }, style]}
    {...rest}
  />
);
