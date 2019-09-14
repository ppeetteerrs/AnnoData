import ax, { AxiosResponse } from 'axios';
import moment, { Moment } from 'moment';
import { SERVER_URL } from '../config';
import { AppPage, AppThunkAction } from '../models/models';

// Update loading status
interface UpdateLoading {
  type: 'UPDATE_LOADING';
  loading: boolean;
}

interface UpdateToken {
  type: 'UPDATE_TOKEN';
  token?: string;
}

// Union Action Types
export type AppAction = UpdateLoading | UpdateToken;

export function updateLoading(loading: boolean): UpdateLoading {
  return {
    type: 'UPDATE_LOADING',
    loading
  };
}

export function updateToken(token?: string): UpdateToken {
  return {
    type: 'UPDATE_TOKEN',
    token
  };
}

export function auth(): AppThunkAction {
  return async (dispatch, getState) => {
    const { authToken } = getState();
    if (!authToken) { return undefined; }
    dispatch(updateLoading(true));
    const { status, data: { token } } = await ax.post<any, AxiosResponse<{ token: string }>>(`${SERVER_URL}/auth/verify`, undefined, {
      headers: {
        'x-access-token': authToken
      }
    });
    console.log(`Token: ${token}, Status: ${status}`);
    if (status == 200) {
      dispatch(updateToken(token));
    } else {
      dispatch(updateToken(undefined));
    }
    dispatch(updateLoading(false));
  };
}