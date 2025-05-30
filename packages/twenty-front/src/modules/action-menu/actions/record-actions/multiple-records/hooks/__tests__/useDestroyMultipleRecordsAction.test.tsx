import { DestroyManyRecordsProps } from '@/object-record/hooks/useDestroyManyRecords';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { ViewFilterOperand } from '@/views/types/ViewFilterOperand';
import { expect } from '@storybook/test';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import {
  GetJestMetadataAndApolloMocksAndActionMenuWrapperProps,
  getJestMetadataAndApolloMocksAndActionMenuWrapper,
} from '~/testing/jest/getJestMetadataAndApolloMocksAndActionMenuWrapper';
import { generatedMockObjectMetadataItems } from '~/testing/mock-data/generatedMockObjectMetadataItems';
import { getPeopleRecordConnectionMock } from '~/testing/mock-data/people';
import { useDestroyMultipleRecordsAction } from '../useDestroyMultipleRecordsAction';

const personMockObjectMetadataItem = generatedMockObjectMetadataItems.find(
  (item) => item.nameSingular === 'person',
)!;
const personMockObjectMetadataItemDeletedAtField =
  personMockObjectMetadataItem.fields.find((el) => el.name === 'deletedAt');
if (personMockObjectMetadataItemDeletedAtField === undefined)
  throw new Error('Should never occur');

const [firstPeopleMock, secondPeopleMock] = getPeopleRecordConnectionMock().map(
  (record) => ({
    ...record,
    deletedAt: new Date().toISOString(),
  }),
);

const destroyManyRecordsMock = jest.fn();
const resetTableRowSelectionMock = jest.fn();

jest.mock('@/object-record/hooks/useDestroyManyRecords', () => ({
  useDestroyManyRecords: () => ({
    destroyManyRecords: destroyManyRecordsMock,
  }),
}));

jest.mock('@/object-record/hooks/useLazyFetchAllRecords', () => ({
  useLazyFetchAllRecords: () => {
    return {
      fetchAllRecords: () => [firstPeopleMock, secondPeopleMock],
    };
  },
}));

jest.mock('@/object-record/record-table/hooks/useRecordTable', () => ({
  useRecordTable: () => ({
    resetTableRowSelection: resetTableRowSelectionMock,
  }),
}));

const getWrapper = (
  overrides?: Partial<GetJestMetadataAndApolloMocksAndActionMenuWrapperProps>,
) =>
  getJestMetadataAndApolloMocksAndActionMenuWrapper({
    apolloMocks: [],
    componentInstanceId: '1',
    contextStoreCurrentObjectMetadataNameSingular:
      personMockObjectMetadataItem.nameSingular,
    contextStoreCurrentViewId: 'my-view-id',
    contextStoreTargetedRecordsRule: {
      mode: 'selection',
      selectedRecordIds: [firstPeopleMock.id, secondPeopleMock.id],
    },
    contextStoreFilters: [],
    contextStoreNumberOfSelectedRecords: 2,
    onInitializeRecoilSnapshot: (snapshot) => {
      snapshot.set(recordStoreFamilyState(firstPeopleMock.id), firstPeopleMock);
      snapshot.set(
        recordStoreFamilyState(secondPeopleMock.id),
        secondPeopleMock,
      );
    },
    ...overrides,
  });

describe('useDestroyMultipleRecordsAction', () => {
  it('should call destroyManyRecords on click if records are filtered by deletedAt', async () => {
    const { result } = renderHook(
      () =>
        useDestroyMultipleRecordsAction({
          objectMetadataItem: personMockObjectMetadataItem,
        }),
      {
        wrapper: getWrapper({
          contextStoreFilters: [
            {
              id: '1553cda7-893d-4d89-b7ab-04969a4c2927',
              fieldMetadataId: personMockObjectMetadataItemDeletedAtField.id,
              value: '',
              displayValue: '',
              operand: ViewFilterOperand.IsNotEmpty,
              type: 'DATE_TIME',
              label: 'Deleted',
            },
          ],
        }),
      },
    );

    expect(result.current.ConfirmationModal?.props?.isOpen).toBeFalsy();

    act(() => {
      result.current.onClick();
    });

    expect(result.current.ConfirmationModal?.props?.isOpen).toBe(true);

    act(() => {
      result.current.ConfirmationModal?.props?.onConfirmClick();
    });

    const expectedParams: DestroyManyRecordsProps = {
      recordIdsToDestroy: [firstPeopleMock.id, secondPeopleMock.id],
    };
    await waitFor(() => {
      expect(resetTableRowSelectionMock).toHaveBeenCalled();
      expect(destroyManyRecordsMock).toHaveBeenCalledWith(expectedParams);
    });
  });
});
