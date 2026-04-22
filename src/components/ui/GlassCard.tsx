import { StyleSheet, View, type ViewProps } from "react-native";
import { BlurView } from "expo-blur";

type Props = ViewProps & {
  intensity?: number;
  tint?: "light" | "dark" | "default" | "extraLight" | "regular" | "prominent";
  innerClassName?: string;
  radius?: "lg" | "md";
};

// Glassmorphism primitive per apple-design skill: blur + bg-white/70 tint on top,
// defined by shadow (no border). On Android, BlurView falls back to a translucent
// overlay; the bg-white/70 tint layer keeps the surface legible either way.
export const GlassCard = ({
  className,
  innerClassName,
  children,
  intensity = 80,
  tint = "light",
  radius = "lg",
  style,
  ...rest
}: Props) => {
  const radiusClass = radius === "lg" ? "rounded-[32px]" : "rounded-[18px]";
  return (
    <View
      className={`${radiusClass} overflow-hidden shadow-xl shadow-black/5 ${className ?? ""}`}
      style={style}
      {...rest}
    >
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View className={`bg-white/70 ${innerClassName ?? "p-6"}`}>
        {children}
      </View>
    </View>
  );
};
