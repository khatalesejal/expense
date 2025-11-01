import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
//import { authApi } from '../services/authApi';
//import { Api } from "../services/api";
import { api } from "../services/api"; 

// export const store = configureStore({
//   reducer: {
//     [authApi.reducerPath]: authApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(authApi.middleware),
// });

// setupListeners(store.dispatch);

// export default store;


export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

 setupListeners(store.dispatch);
 export default store;