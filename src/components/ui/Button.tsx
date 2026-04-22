import { ActivityIndicator, View, type PressableProps } from "react-native";
import { Touchable } from "./Touchable";
import { Txt } from "./Typography";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "md" | "lg";

// When the bg is dark (primary/danger) we must use `tone="inverse"` rather than a
// className override, because Txt emits its default tone class in the className
// string with equal CSS specificity — className order doesn't determine precedence.
const variantClass: Record<Variant, { bg: string; inverse: boolean; textClass: string; shadow: string }> = {
  primary:   { bg: "bg-brand-700",   inverse: true,  textClass: "",                  shadow: "shadow-lg shadow-black/20" },
  secondary: { bg: "bg-white",       inverse: false, textClass: "text-brand-700",    shadow: "shadow-md shadow-black/5" },
  ghost:     { bg: "bg-transparent", inverse: false, textClass: "text-accent-500",   shadow: "" },
  danger:    { bg: "bg-danger",      inverse: true,  textClass: "",                  shadow: "shadow-lg shadow-danger/30" },
};

const sizeClass: Record<Size, string> = {
  md: "px-5 h-12 rounded-[18px]",
  lg: "px-6 h-14 rounded-[18px]",
};

type Props = PressableProps & {
  label:      string;
  variant?:   Variant;
  size?:      Size;
  loading?:   boolean;
  fullWidth?: boolean;
};

export const Button = ({
  label, variant = "primary", size = "md", loading, fullWidth, disabled, className, ...rest
}: Props) => {
  const v = variantClass[variant];
  return (
    <Touchable
      accessibilityRole="button"
      disabled={disabled || loading}
      className={`${v.bg} ${sizeClass[size]} ${v.shadow} ${fullWidth ? "w-full" : ""} ${disabled || loading ? "opacity-60" : ""} ${className ?? ""}`}
      {...rest}
    >
      <View className="flex-row items-center justify-center h-full">
        {loading ? (
          <ActivityIndicator color={v.inverse ? "#FFFFFF" : "#1C1C1E"} />
        ) : (
          <Txt
            tone={v.inverse ? "inverse" : "default"}
            className={`${v.textClass} text-center`}
            variant={size === "lg" ? "heading" : "label"}
            style={{ textAlign: "center" }}
          >
            {label}
          </Txt>
        )}
      </View>
    </Touchable>
  );
};
