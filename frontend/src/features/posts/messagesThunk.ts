import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi.ts';
import { Message } from '../../types';

export const fetchMessages = createAsyncThunk<Message[]>(
  'messages/fetch',
  async() => {
    const response = await axiosApi.get<Message[]>('/messages');
    return response.data;
  }
);