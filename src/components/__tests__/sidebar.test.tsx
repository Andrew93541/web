import { render, screen } from '@testing-library/react';
import { Sidebar } from '../layout/sidebar';
import '@testing-library/jest-dom';

describe('Sidebar Integration Test', () => {
    it('should correctly render all sidebar navigation links', () => {
        render(<Sidebar />);

        expect(screen.getByText('CloudDrive')).toBeInTheDocument();
        expect(screen.getByText('My Drive')).toBeInTheDocument();
        expect(screen.getByText('Shared with me')).toBeInTheDocument();
        expect(screen.getByText('Recent')).toBeInTheDocument();
        expect(screen.getByText('Starred')).toBeInTheDocument();
        expect(screen.getByText('Trash')).toBeInTheDocument();
    });

    it('should correctly render the New button modal trigger', () => {
        render(<Sidebar />);
        expect(screen.getByText('New')).toBeInTheDocument();
    });
});
