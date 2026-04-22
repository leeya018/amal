import { Modal, Pressable, ScrollView, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import type { ActionItem } from "@/lib/gemini";

type Props = {
  visible: boolean;
  items:   ActionItem[];
  onAddAll:  () => void;
  onDismiss: () => void;
};

export const ActionItemsModal = ({ visible, items, onAddAll, onDismiss }: Props) => {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <Pressable onPress={onDismiss} className="flex-1 bg-black/50 justify-end">
        <Pressable onPress={(e) => e.stopPropagation()} className="bg-cream rounded-t-3xl p-6 pb-10">
          <View className="self-center w-12 h-1 rounded-full bg-brand-100 mb-4" />
          <Txt variant="title" className="mb-1" style={{ textAlign: "right" }}>
            {t("agent.actionItems.title")}
          </Txt>
          <Txt variant="body" tone="muted" className="mb-4" style={{ textAlign: "right" }}>
            {t("agent.actionItems.body")}
          </Txt>

          <ScrollView className="max-h-[320px] mb-4">
            {items.map((item, idx) => (
              <View key={idx} className="bg-white rounded-2xl p-4 mb-2 border border-brand-100">
                <Txt variant="heading" style={{ textAlign: "right" }}>{item.title}</Txt>
                {item.description ? (
                  <Txt variant="caption" tone="muted" className="mt-1" style={{ textAlign: "right" }}>
                    {item.description}
                  </Txt>
                ) : null}
              </View>
            ))}
          </ScrollView>

          <View className="gap-2">
            <Button label={t("agent.actionItems.addAll")} onPress={onAddAll} fullWidth size="lg" />
            <Button label={t("agent.actionItems.dismiss")} variant="ghost" onPress={onDismiss} fullWidth />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
