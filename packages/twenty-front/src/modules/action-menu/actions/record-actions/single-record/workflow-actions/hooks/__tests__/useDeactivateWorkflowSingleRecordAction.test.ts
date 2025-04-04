import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { useWorkflowWithCurrentVersion } from '@/workflow/hooks/useWorkflowWithCurrentVersion';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { FeatureFlagKey } from '~/generated-metadata/graphql';
import { getJestMetadataAndApolloMocksAndActionMenuWrapper } from '~/testing/jest/getJestMetadataAndApolloMocksAndActionMenuWrapper';
import { generatedMockObjectMetadataItems } from '~/testing/mock-data/generatedMockObjectMetadataItems';
import { mockCurrentWorkspace } from '~/testing/mock-data/users';
import { useDeactivateWorkflowSingleRecordAction } from '../useDeactivateWorkflowSingleRecordAction';
const workflowMockObjectMetadataItem = generatedMockObjectMetadataItems.find(
  (item) => item.nameSingular === 'workflow',
)!;

const mockedWorkflowEnabledFeatureFlag = {
  id: '1',
  key: FeatureFlagKey.IsWorkflowEnabled,
  value: true,
  workspaceId: '1',
};

const activeWorkflowMock = {
  __typename: 'Workflow',
  id: 'workflowId',
  lastPublishedVersionId: 'lastPublishedVersionId',
  currentVersion: {
    __typename: 'WorkflowVersion',
    id: 'currentVersionId',
    trigger: 'trigger',
    status: 'ACTIVE',
    steps: [
      {
        __typename: 'WorkflowStep',
        id: 'stepId1',
      },
    ],
  },
};

jest.mock('@/workflow/hooks/useWorkflowWithCurrentVersion', () => ({
  useWorkflowWithCurrentVersion: jest.fn(),
}));

const deactivateWorkflowVersionMock = jest.fn();

jest.mock('@/workflow/hooks/useDeactivateWorkflowVersion', () => ({
  useDeactivateWorkflowVersion: () => ({
    deactivateWorkflowVersion: deactivateWorkflowVersionMock,
  }),
}));

const activeWorkflowWrapper = getJestMetadataAndApolloMocksAndActionMenuWrapper(
  {
    apolloMocks: [],
    componentInstanceId: '1',
    contextStoreCurrentObjectMetadataNameSingular:
      workflowMockObjectMetadataItem.nameSingular,
    contextStoreTargetedRecordsRule: {
      mode: 'selection',
      selectedRecordIds: [activeWorkflowMock.id],
    },
    onInitializeRecoilSnapshot: (snapshot) => {
      snapshot.set(
        recordStoreFamilyState(activeWorkflowMock.id),
        activeWorkflowMock,
      );
      snapshot.set(currentWorkspaceState, {
        ...mockCurrentWorkspace,
        featureFlags: [mockedWorkflowEnabledFeatureFlag],
      });
    },
  },
);

describe('useDeactivateWorkflowSingleRecordAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call deactivateWorkflowVersion on click', () => {
    (useWorkflowWithCurrentVersion as jest.Mock).mockImplementation(
      () => activeWorkflowMock,
    );
    const { result } = renderHook(
      () => useDeactivateWorkflowSingleRecordAction(),
      {
        wrapper: activeWorkflowWrapper,
      },
    );

    act(() => {
      result.current.onClick();
    });

    expect(deactivateWorkflowVersionMock).toHaveBeenCalledWith({
      workflowVersionId: activeWorkflowMock.currentVersion.id,
    });
  });
});
