import { Coffee, Mountain, Crown, Globe, Music, ChefHat, Heart, Star, Zap, BookOpen, Camera, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEditMode } from "@/lib/edit-context";
import { useState } from "react";

const iconOptions = [
  { key: "coffee", Icon: Coffee },
  { key: "hiking", Icon: Mountain },
  { key: "chess", Icon: Crown },
  { key: "languages", Icon: Globe },
  { key: "music", Icon: Music },
  { key: "cooking", Icon: ChefHat },
  { key: "heart", Icon: Heart },
  { key: "star", Icon: Star },
  { key: "zap", Icon: Zap },
  { key: "book", Icon: BookOpen },
  { key: "camera", Icon: Camera },
  { key: "gaming", Icon: Gamepad2 },
];

interface IconPickerProps {
  currentIcon: string;
  table: string;
  id: string;
  onSelect: (iconKey: string) => void;
}

export function IconPicker({ currentIcon, table, id, onSelect }: IconPickerProps) {
  const { isEditMode } = useEditMode();
  const [open, setOpen] = useState(false);
  const CurrentIcon = iconOptions.find((o) => o.key === currentIcon)?.Icon ?? Coffee;

  if (!isEditMode) {
    return <CurrentIcon className="h-6 w-6" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
          <CurrentIcon className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-4 gap-1">
          {iconOptions.map(({ key, Icon }) => (
            <Button
              key={key}
              variant={key === currentIcon ? "secondary" : "ghost"}
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                onSelect(key);
                setOpen(false);
              }}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
