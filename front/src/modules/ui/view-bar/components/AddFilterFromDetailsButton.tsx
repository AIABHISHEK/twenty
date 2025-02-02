import { LightButton } from '@/ui/button/components/LightButton';
import { useDropdownButton } from '@/ui/dropdown/hooks/useDropdownButton';
import { IconPlus } from '@/ui/icon';

import { FilterDropdownId } from '../constants/FilterDropdownId';

export function AddFilterFromDropdownButton() {
  const { toggleDropdownButton } = useDropdownButton({
    dropdownId: FilterDropdownId,
  });

  function handleClick() {
    toggleDropdownButton();
  }

  return (
    <LightButton
      onClick={handleClick}
      icon={<IconPlus />}
      title="Add filter"
      accent="tertiary"
    />
  );
}
