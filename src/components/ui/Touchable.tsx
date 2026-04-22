import { forwardRef } from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// Animated wrapper around Pressable. A spring scale on press-in / press-out
// gives every interactive surface the signature iOS "settle" feel, per the
// apple-design skill (scale: 0.97, spring-based).
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  scaleTo?: number;
};

export const Touchable = forwardRef<any, Props>(
  ({ scaleTo = 0.97, style, onPressIn, onPressOut, children, ...rest }, ref) => {
    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    return (
      <AnimatedPressable
        ref={ref}
        style={[animStyle, style as any]}
        onPressIn={(e) => {
          scale.value = withSpring(scaleTo, { damping: 16, stiffness: 260, mass: 0.6 });
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, { damping: 16, stiffness: 260, mass: 0.6 });
          onPressOut?.(e);
        }}
        {...rest}
      >
        {children as any}
      </AnimatedPressable>
    );
  }
);
Touchable.displayName = "Touchable";
