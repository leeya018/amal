import { useRef, useState } from "react";
import { Dimensions, FlatList, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";

const { width: SCREEN_W } = Dimensions.get("window");

type Slide = {
  key:      string;
  icon:     keyof typeof Ionicons.glyphMap;
  titleKey: string;
  bodyKey:  string;
};

const SLIDES: Slide[] = [
  { key: "s1", icon: "heart-circle",     titleKey: "onboarding.intro.slide1Title", bodyKey: "onboarding.intro.slide1Body" },
  { key: "s2", icon: "shield-checkmark", titleKey: "onboarding.intro.slide2Title", bodyKey: "onboarding.intro.slide2Body" },
  { key: "s3", icon: "sparkles",         titleKey: "onboarding.intro.slide3Title", bodyKey: "onboarding.intro.slide3Body" },
];

type Props = { onIndexChange?: (index: number) => void };

export const IntroCarousel = ({ onIndexChange }: Props) => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // RN auto-mirrors horizontal FlatList under RTL; offset still reports LTR-based x.
    const ratio = e.nativeEvent.contentOffset.x / SCREEN_W;
    const next  = Math.round(ratio);
    if (next !== index) {
      setIndex(next);
      onIndexChange?.(next);
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_W }} className="items-center justify-center px-8">
            <View className="w-32 h-32 rounded-[36px] bg-white items-center justify-center mb-10 shadow-2xl shadow-accent-500/20">
              <Ionicons name={item.icon} size={64} color="#007AFF" />
            </View>
            <Txt variant="title" className="mb-3 text-ink" style={{ textAlign: "center" }}>
              {t(item.titleKey)}
            </Txt>
            <Txt variant="body" tone="muted" style={{ textAlign: "center" }}>
              {t(item.bodyKey)}
            </Txt>
          </View>
        )}
      />
      <View className="flex-row justify-center gap-2 pb-6">
        {SLIDES.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full ${i === index ? "w-8 bg-accent-500" : "w-2 bg-ink-faint/40"}`}
          />
        ))}
      </View>
    </View>
  );
};
