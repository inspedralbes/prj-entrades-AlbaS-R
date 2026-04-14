

export const useRuntimeConfig = jest.fn(() => ({
  public: {
    apiUrl: 'http://localhost:8000/api',
    socketUrl: 'http://localhost:3001'
  }
}));

export const ref = (val) => ({ value: val });
export const computed = (fn) => ({ value: fn() });
export const onMounted = jest.fn();
export const onUnmounted = jest.fn();
export const watch = jest.fn();
export const defineEmits = jest.fn();
export const defineProps = jest.fn();
export const useRoute = jest.fn();
export const useRouter = jest.fn();
