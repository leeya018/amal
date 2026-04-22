import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Touchable } from "@/components/ui/Touchable";
import type { Todo } from "@/types/app";

type Props = {
  todo:     Todo;
  onToggle: (t: Todo) => void;
  onDelete: (id: string) => void;
};

// iOS Reminders-style row. Checkbox is a filled blue circle when complete, a
// soft outline when not. Shadow defines the card edge — no border.
export const TaskCard = ({ todo, onToggle, onDelete }: Props) => {
  const { t } = useTranslation();
  const due = todo.due_date
    ? new Date(todo.due_date).toLocaleDateString("he-IL", { day: "2-digit", month: "short" })
    : null;

  return (
    <View className="bg-white rounded-[24px] p-4 mb-2.5 flex-row-reverse items-start gap-3 shadow-md shadow-black/5">
      <Touchable
        onPress={() => onToggle(todo)}
        accessibilityRole="checkbox"
        accessibilityLabel={todo.completed ? t("todos.markUndone") : t("todos.markDone")}
        accessibilityState={{ checked: todo.completed }}
        className={`w-7 h-7 rounded-full items-center justify-center mt-0.5 ${
          todo.completed
            ? "bg-accent-500 shadow-md shadow-accent-500/40"
            : "bg-cream-100 shadow-inner"
        }`}
        scaleTo={0.88}
      >
        {todo.completed ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
      </Touchable>

      <View className="flex-1">
        <Txt
          variant="heading"
          className={todo.completed ? "line-through text-ink-faint" : "text-ink"}
          style={{ textAlign: "right" }}
        >
          {todo.title}
        </Txt>
        {todo.description ? (
          <Txt variant="caption" tone="muted" className="mt-0.5" style={{ textAlign: "right" }}>
            {todo.description}
          </Txt>
        ) : null}
        {due ? (
          <View className="flex-row-reverse items-center gap-1 mt-2">
            <Ionicons name="calendar-outline" size={12} color="#636366" />
            <Txt variant="caption" tone="muted">{due}</Txt>
          </View>
        ) : null}
      </View>

      <Touchable
        onPress={() => onDelete(todo.id)}
        accessibilityRole="button"
        accessibilityLabel={t("common.delete")}
        className="w-9 h-9 items-center justify-center rounded-full"
      >
        <Ionicons name="close" size={18} color="#AEAEB2" />
      </Touchable>
    </View>
  );
};
