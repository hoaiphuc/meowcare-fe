// hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store'; // Đảm bảo đường dẫn đúng

// Sử dụng các hook này trong toàn bộ ứng dụng thay vì `useDispatch` và `useSelector` mặc định
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
