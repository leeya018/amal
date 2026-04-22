# Skill: Apple Sexy Design Language (RTL/Hebrew)

## Core Philosophy
- **Depth over Borders:** Never use `border-width`. Use shadow and blur to define edges.
- **Glassmorphism:** Use `expo-blur` Intensity 80. Backgrounds should be `bg-white/70`.
- **The Squircle:** Main cards = `rounded-[32px]`. Inner buttons = `rounded-[18px]`.

## Layout Rules (Hebrew RTL)
- Use `flex-row-reverse` for headers with icons.
- All text alignment must be `text-right`.
- Default card padding: `p-6`.

## Code Pattern (NativeWind)
- **Glass Card:** `StyledBlur intensity={80} className="rounded-[32px] overflow-hidden shadow-xl shadow-black/5"`
- **Sexy Button:** `bg-slate-900 h-14 rounded-[18px] items-center justify-center`

## Motion
- Use `moti` or `reanimated` for spring-based scaling on press (scale: 0.97).