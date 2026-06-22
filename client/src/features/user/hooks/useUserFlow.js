import { useCallback, useMemo } from 'react';
import { userApi } from '../../../api/user.js';
import { useImmediateFlow } from '../../../hooks/useImmediateFlow.js';

/**
 * Hook for all User Management flows.
 * All flows are immediate-response POST requests.
 */
export function useUserFlow(flowKey) {
  const immediateFlows = useMemo(() => ({
    'login-user': {
      submitApi: (input) => userApi.loginUser(input),
      onResponse: (data, _input, { addLog: log }) => {
        const body = data.body ?? data;
        if (body.accessToken) {
          log(`User logged in. Workspace: ${body.workspaceId || 'unknown'}`);
        } else {
          log('Login response received');
        }
      },
    },
    'delete-user': {
      submitApi: (input) => userApi.deleteUser(input),
      onResponse: (data, _input, { addLog: log }) => {
        const msg = data.body?.message ?? data.message ?? 'Delete completed';
        log(msg);
      },
    },
    'set-user-credit-limit': {
      submitApi: (input) => userApi.setUserCreditLimit(input),
      onResponse: (data, _input, { addLog: log }) => {
        const msg = data.body?.message ?? data.message ?? 'Credit limit updated';
        log(msg);
      },
    },
  }), []);

  const loginUserFlow = useImmediateFlow(
    immediateFlows['login-user'].submitApi,
    'login-user',
    { onResponse: immediateFlows['login-user'].onResponse }
  );

  const deleteUserFlow = useImmediateFlow(
    immediateFlows['delete-user'].submitApi,
    'delete-user',
    { onResponse: immediateFlows['delete-user'].onResponse }
  );

  const setUserCreditLimitFlow = useImmediateFlow(
    immediateFlows['set-user-credit-limit'].submitApi,
    'set-user-credit-limit',
    { onResponse: immediateFlows['set-user-credit-limit'].onResponse }
  );

  const submit = useCallback(
    (input) => {
      switch (flowKey) {
        case 'login-user':
          return loginUserFlow.submit(input);
        case 'delete-user':
          return deleteUserFlow.submit(input);
        case 'set-user-credit-limit':
          return setUserCreditLimitFlow.submit(input);
        default:
          throw new Error(`Unknown user flow: ${flowKey}`);
      }
    },
    [flowKey, loginUserFlow, deleteUserFlow, setUserCreditLimitFlow]
  );

  return { submit };
}
