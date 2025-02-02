import { DropdownButton } from '@/ui/dropdown/components/DropdownButton';
import { HotkeyScope } from '@/ui/utilities/hotkey/types/HotkeyScope';
import type { View } from '@/ui/view-bar/types/View';

import { TableOptionsDropdownId } from '../../constants/TableOptionsDropdownId';

import { TableOptionsDropdownButton } from './TableOptionsDropdownButton';
import { TableOptionsDropdownContent } from './TableOptionsDropdownContent';

type TableOptionsDropdownProps = {
  onViewsChange?: (views: View[]) => void;
  onImport?: () => void;
  customHotkeyScope: HotkeyScope;
};

export function TableOptionsDropdown({
  onViewsChange,
  onImport,
  customHotkeyScope,
}: TableOptionsDropdownProps) {
  return (
    <DropdownButton
      buttonComponents={<TableOptionsDropdownButton />}
      dropdownHotkeyScope={customHotkeyScope}
      dropdownId={TableOptionsDropdownId}
      dropdownComponents={
        <TableOptionsDropdownContent
          onImport={onImport}
          onViewsChange={onViewsChange}
        />
      }
    />
  );
}
