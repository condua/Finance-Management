// src/features/message/messageSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/src/types/enum';

interface MessageState {
  messages: Message[];
}

const initialState: MessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    removeMessage(state, action: PayloadAction<string>) {
      state.messages = state.messages.filter(message => message._id !== action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

// Export actions
export const { setMessages, addMessage, removeMessage, clearMessages } = messageSlice.actions;

// Export reducer
export default messageSlice.reducer;
