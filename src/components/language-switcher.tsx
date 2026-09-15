import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 hover:bg-accent hover:text-accent-foreground">
          <img 
            src={i18n.resolvedLanguage === 'en' ? 'https://flagcdn.com/w20/gb.png' : 'https://flagcdn.com/w20/mz.png'} 
            srcSet={i18n.resolvedLanguage === 'en' ? 'https://flagcdn.com/w40/gb.png 2x' : 'https://flagcdn.com/w40/mz.png 2x'}
            alt="Flag"
            width="20" 
            height="15"
            className="rounded-sm object-cover drop-shadow-sm"
          />
          <span className="text-xs font-medium uppercase">{i18n.resolvedLanguage || 'pt'}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        >
          <DropdownMenu.Item
            className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => changeLanguage('pt')}
          >
            <img src="https://flagcdn.com/w20/mz.png" srcSet="https://flagcdn.com/w40/mz.png 2x" alt="MZ" width="20" height="15" className="rounded-sm object-cover drop-shadow-sm" />
            Português
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            onClick={() => changeLanguage('en')}
          >
            <img src="https://flagcdn.com/w20/gb.png" srcSet="https://flagcdn.com/w40/gb.png 2x" alt="GB" width="20" height="15" className="rounded-sm object-cover drop-shadow-sm" />
            English
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
