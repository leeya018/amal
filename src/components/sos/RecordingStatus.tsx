import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import type { RecordingStatus as Status } from "@/contexts/RecordingContext";

const formatElapsed = (ms: number): string => {
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
};

type Props = {
  status: Status;
  elapsedMs: number;
  errorMessage: string | null;
};

export const RecordingStatusIndicator = ({ status, elapsedMs, errorMessage }: Props) => {
  const { t } = useTranslation();

  if (status === "recording") {
    return (
      <View className="items-center gap-2">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-danger" />
          <Txt variant="label" tone="danger">{t("sos.recording")}</Txt>
        </View>
        <Txt
          variant="display"
          className="font-bold text-ink"
          style={{ textAlign: "center", writingDirection: "ltr", fontVariant: ["tabular-nums"] }}
        >
          {formatElapsed(elapsedMs)}
        </Txt>
      </View>
    );
  }
  if (status === "saving")  return <Txt variant="heading" tone="muted" style={{ textAlign: "center" }}>{t("sos.saving")}</Txt>;
  if (status === "saved")   return <Txt variant="heading" tone="accent" style={{ textAlign: "center" }}>{t("sos.savedTitle")}</Txt>;
  if (status === "error")   return <Txt variant="label"   tone="danger" style={{ textAlign: "center" }}>{errorMessage ?? t("errors.generic")}</Txt>;
  return null;
};
