import { CompanyProgressPicker } from '@/companies/components/CompanyProgressPicker';
import { useCreateCompanyProgress } from '@/companies/hooks/useCreateCompanyProgress';
import { PageHotkeyScope } from '@/types/PageHotkeyScope';
import { IconButton } from '@/ui/button/components/IconButton';
import { DropdownButton } from '@/ui/dropdown/components/DropdownButton';
import { useDropdownButton } from '@/ui/dropdown/hooks/useDropdownButton';
import { IconPlus } from '@/ui/icon/index';
import { EntityForSelect } from '@/ui/input/relation-picker/types/EntityForSelect';
import { RelationPickerHotkeyScope } from '@/ui/input/relation-picker/types/RelationPickerHotkeyScope';
import { useSnackBar } from '@/ui/snack-bar/hooks/useSnackBar';

export function PipelineAddButton() {
  const { enqueueSnackBar } = useSnackBar();

  const { closeDropdownButton, toggleDropdownButton } = useDropdownButton({
    dropdownId: 'add-pipeline-progress',
  });

  const createCompanyProgress = useCreateCompanyProgress();

  function handleCompanySelected(
    selectedCompany: EntityForSelect | null,
    selectedPipelineStageId: string | null,
  ) {
    if (!selectedCompany?.id) {
      enqueueSnackBar(
        'There was a problem with the company selection, please retry.',
        {
          variant: 'error',
        },
      );

      console.error(
        'There was a problem with the company selection, please retry.',
      );
      return;
    }

    if (!selectedPipelineStageId) {
      enqueueSnackBar(
        'There was a problem with the pipeline stage selection, please retry.',
        {
          variant: 'error',
        },
      );

      console.error('There was a problem with the pipeline stage selection.');
      return;
    }

    createCompanyProgress(selectedCompany.id, selectedPipelineStageId);
  }

  return (
    <DropdownButton
      dropdownId="add-pipeline-progress"
      buttonComponents={
        <IconButton
          Icon={IconPlus}
          size="medium"
          dataTestId="add-company-progress-button"
          accent="default"
          variant="secondary"
          onClick={toggleDropdownButton}
        />
      }
      dropdownComponents={
        <CompanyProgressPicker
          companyId={null}
          onSubmit={handleCompanySelected}
          onCancel={closeDropdownButton}
        />
      }
      hotkey={{
        key: 'c',
        scope: PageHotkeyScope.OpportunitiesPage,
      }}
      dropdownHotkeyScope={{
        scope: RelationPickerHotkeyScope.RelationPicker,
      }}
    />
  );
}
