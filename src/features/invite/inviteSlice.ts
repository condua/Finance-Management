import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { inviteMemberService } from './invite.service';  // Import the service

interface InviteMemberState {
  isLoading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: InviteMemberState = {
  isLoading: false,
  message: null,
  error: null,
};

const inviteSlice = createSlice({
  name: 'inviteMember',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // When the inviteMember mutation is pending
    builder.addMatcher(inviteMemberService.endpoints.inviteMember.matchPending, (state) => {
      state.isLoading = true;
      state.message = null;
      state.error = null;
    });
    // When the inviteMember mutation is successful
    builder.addMatcher(inviteMemberService.endpoints.inviteMember.matchFulfilled, (state, action: PayloadAction<{ message: string }>) => {
      state.isLoading = false;
      state.message = action.payload.message;
    });
    // When the inviteMember mutation fails
    builder.addMatcher(inviteMemberService.endpoints.inviteMember.matchRejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Something went wrong';
    });
  },
});

export const { clearMessage } = inviteSlice.actions;

export default inviteSlice.reducer;
