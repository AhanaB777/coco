import type { ComponentType } from "react";
import {
  Backspace,
  Bell,
  ChartLineUp,
  CheckCircle,
  CircleDashed,
  GameController,
  ListNumbers,
  Microphone,
  MoonStars,
  PaperPlaneRight,
  Scan,
  SquaresFour,
  StopCircle,
  Sun,
  SunHorizon,
  type IconProps,
} from "phosphor-react-native";
import { View } from "react-native";

export type AppIconName =
  | "GameController"
  | "Bell"
  | "ChartLineUp"
  | "Microphone"
  | "PaperPlaneRight"
  | "SquaresFour"
  | "ListNumbers"
  | "Scan"
  | "CheckCircle"
  | "CircleDashed"
  | "Backspace"
  | "StopCircle"
  | "SunHorizon"
  | "Sun"
  | "MoonStars";

type AppIconWeight = "duotone" | "regular" | "fill";

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color: string;
  weight?: AppIconWeight;
}

const ICON_MAP: Record<AppIconName, ComponentType<IconProps>> = {
  GameController,
  Bell,
  ChartLineUp,
  Microphone,
  PaperPlaneRight,
  SquaresFour,
  ListNumbers,
  Scan,
  CheckCircle,
  CircleDashed,
  Backspace,
  StopCircle,
  SunHorizon,
  Sun,
  MoonStars,
};

export function AppIcon({
  name,
  size = 24,
  color,
  weight = "regular",
}: AppIconProps) {
  const IconComponent = ICON_MAP[name];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <IconComponent size={size} color={color} weight={weight} />
    </View>
  );
}
