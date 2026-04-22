import { ActivityIndicator, Pressable, type PressableProps, View } from "react-native";
import { Txt } from "./Typography";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "md" | "lg";

const variantClass: Record<Variant, { bg: string; text: string; border: string }> = {
  primary:   { bg: "bg-brand-700",     text: "text-cream",    border: "border-transparent" },
  secondary: { bg: "bg-cream",         text: "text-brand-700", border: "border-brand-100" },
  ghost:     { bg: "bg-transparent",   text: "text-brand-700", border: "border-transparent" },
  danger:    { bg: "bg-danger",        text: "text-cream",    border: "border-transparent" },
};

const sizeClass: Record<Size, string> = {
  md: "px-5 py-3 rounded-2xl",
  lg: "px-6 py-4 rounded-2xl",
};

type Props = PressableProps & {
  label:     string;
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  fullWidth?: boolean;
};

export const Button = ({
  label, variant = "primary", size = "md", loading, fullWidth, disabled, className, ...rest
}: Props) => {
  const v = variantClass[variant];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      className={`${v.bg} ${sizeClass[size]} border ${v.border} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "opacity-60" : ""} active:opacity-80 ${className ?? ""}`}
      {...rest}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <ActivityIndicator color={variant === "primary" || variant === "danger" ? "#FAF5F0" : "#2E1A2E"} />
        ) : (
          <Txt
            className={`${v.text} text-center`}
            variant={size === "lg" ? "heading" : "label"}
            style={{ textAlign: "center" }}
          >
            {label}
          </Txt>
        )}
      </View>
    </Pressable>
  );
};
