import { render, screen } from '@testing-library/react';
import RecentApplications from './RecentApplications';
import '@testing-library/jest-dom';

describe('RecentApplications Component', () => {
  test('renders the title "Recent Applications"', () => {
    render(<RecentApplications />);
    expect(screen.getByText('Recent Applications')).toBeInTheDocument();
  });

  test('renders the table headers', () => {
    render(<RecentApplications />);

  });

  test('renders at least one candidate', () => {
    render(<RecentApplications />);

    expect(screen.getByText('John Cooper')).toBeInTheDocument();
    expect(screen.getByText('Senior UX Designer')).toBeInTheDocument();
    expect(screen.getByText('interviewing')).toBeInTheDocument();
    expect(screen.getByText('Jan 12, 2025')).toBeInTheDocument();
  });

  test('renders all candidates correctly', () => {
    render(<RecentApplications />);
    
    const candidates = [
      'John Cooper',
      'Sarah Wilson',
      'Mike Johnson',
      'Emily Brown',
      'David Lee'
    ];

    candidates.forEach(candidate => {
      expect(screen.getByText(candidate)).toBeInTheDocument();
    });
  });

  test('renders status labels correctly', () => {
    render(<RecentApplications />);
  });
  test('renders the title "Recent Applications"', () => {
    render(<RecentApplications />);
    expect(screen.getByText('Recent Applications')).toBeInTheDocument();
  });

  test('renders the table headers', () => {
    render(<RecentApplications />);

  });

  test('renders at least one candidate', () => {
    render(<RecentApplications />);

    expect(screen.getByText('John Cooper')).toBeInTheDocument();
    expect(screen.getByText('Senior UX Designer')).toBeInTheDocument();
    expect(screen.getByText('interviewing')).toBeInTheDocument();
    expect(screen.getByText('Jan 12, 2025')).toBeInTheDocument();
  });

  test('renders all candidates correctly', () => {
    render(<RecentApplications />);
    
    const candidates = [
      'John Cooper',
      'Sarah Wilson',
      'Mike Johnson',
      'Emily Brown',
      'David Lee'
    ];

    candidates.forEach(candidate => {
      expect(screen.getByText(candidate)).toBeInTheDocument();
    });
  });

  test('renders status labels correctly', () => {
    render(<RecentApplications />);
  });

});
