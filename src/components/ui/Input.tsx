import { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { Txt } from "./Typography";

type Props = TextInputProps & {
  label?: string;
  errorText?: string | null;
};

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
        placeholderTextColor="#A89AA2"
        className={`bg-white rounded-2xl px-4 py-3 border ${focused ? "border-accent-400" : "border-brand-100"} text-ink font-sans ${className ?? ""}`}
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
