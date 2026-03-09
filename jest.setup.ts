import '@testing-library/jest-dom';

// Mocks for layout/router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn()
        };
    },
    usePathname() {
        return '';
    }
}));
