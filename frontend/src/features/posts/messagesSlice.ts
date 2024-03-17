import { Message } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { fetchMessages } from './messagesThunk.ts';
import { RootState } from '../../app/store.ts';

interface MessagesState {
  data: Message[];
  fetching: boolean;
}

const initialState: MessagesState = {
  data: [],
  fetching: false,
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state) => {
      state.fetching = true;
    });
    builder.addCase(fetchMessages.fulfilled, (state, {payload: messages}) => {
      state.fetching = false;
      state.data = messages;
    });
    builder.addCase(fetchMessages.rejected, (state) => {
      state.fetching = false;
    });
  }
});

export const messagesReducer = messagesSlice.reducer;
export const selectMessages = (state: RootState) => state.messages.data;
export const selectMessagesFetching = (state: RootState) => state.messages.fetching;

