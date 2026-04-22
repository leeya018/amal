import { View, type ViewProps } from "react-native";

type Props = ViewProps & { tone?: "surface" | "cream" | "brand" };

export const Card = ({ tone = "surface", className, ...rest }: Props) => {
  const bg = tone === "brand" ? "bg-brand-700" : tone === "cream" ? "bg-cream" : "bg-white";
  return (
    <View
      className={`${bg} rounded-3xl p-5 border border-brand-100/60 ${className ?? ""}`}
      {...rest}
    />
  );
};
