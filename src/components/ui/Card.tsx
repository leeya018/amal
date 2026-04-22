import { View, type ViewProps } from "react-native";

type Props = ViewProps & { tone?: "surface" | "cream" | "brand" };

// Solid card — shadow-defined edges, no border. For translucent/glass surfaces
// use GlassCard instead.
export const Card = ({ tone = "surface", className, ...rest }: Props) => {
  const bg =
    tone === "brand" ? "bg-brand-700" :
    tone === "cream" ? "bg-cream-100" :
                       "bg-white";
  return (
    <View
      className={`${bg} rounded-[32px] p-6 shadow-xl shadow-black/5 ${className ?? ""}`}
      {...rest}
    />
  );
};
