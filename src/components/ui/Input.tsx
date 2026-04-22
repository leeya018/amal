import { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { Txt } from "./Typography";

type Props = TextInputProps & {
  label?: string;
  errorText?: string | null;
};

// Shadow-defined input (no border). Focus state adds a subtle blue glow via
// shadow color — matches iOS native field feel.
export const Input = ({ label, errorText, className, onFocus, onBlur, style, ...rest }: Props) => {
  const [focused, setFocused] = useState(false);
  return (
    <View className="w-full">
      {label ? (
        <Txt variant="label" tone="muted" className="mb-2 px-1">
          {label}
        </Txt>
      ) : null}
      <TextInput
        placeholderTextColor="#AEAEB2"
        className={`bg-white rounded-[18px] px-4 h-12 text-ink font-sans ${focused ? "shadow-lg shadow-accent-500/30" : "shadow-md shadow-black/5"} ${className ?? ""}`}
        style={[{ writingDirection: "rtl", textAlign: "right", fontSize: 16 }, style]}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); onBlur?.(e); }}
        {...rest}
      />
      {errorText ? (
        <Txt variant="caption" tone="danger" className="mt-1 px-1">
          {errorText}
        </Txt>
      ) : null}
    </View>
  );
};
