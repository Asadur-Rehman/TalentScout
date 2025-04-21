import { render, screen } from '@testing-library/react';
import StatsCard from './StatsCard';

// Ensure @testing-library/jest-dom is loaded
import '@testing-library/jest-dom';

describe('StatsCard Component', () => {
  test('renders with candidates icon', () => {
    render(<StatsCard icon="candidates" value="100" label="Total Candidates" />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
  });

  test('renders with jobs icon', () => {
    render(<StatsCard icon="jobs" value="50" label="Total Jobs" />);
    
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
  });
  test('renders with candidates icon', () => {
    render(<StatsCard icon="candidates" value="100" label="Total Candidates" />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
  });

  test('renders with jobs icon', () => {
    render(<StatsCard icon="jobs" value="50" label="Total Jobs" />);
    
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
  });
  test('renders with candidates icon', () => {
    render(<StatsCard icon="candidates" value="100" label="Total Candidates" />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
  });

  test('renders with jobs icon', () => {
    render(<StatsCard icon="jobs" value="50" label="Total Jobs" />);
    
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
  });
  test('renders with candidates icon', () => {
    render(<StatsCard icon="candidates" value="100" label="Total Candidates" />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
  });

  test('renders with jobs icon', () => {
    render(<StatsCard icon="jobs" value="50" label="Total Jobs" />);
    
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
  });
  test('renders with candidates icon', () => {
    render(<StatsCard icon="candidates" value="100" label="Total Candidates" />);
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Total Candidates')).toBeInTheDocument();
  });

  test('renders with jobs icon', () => {
    render(<StatsCard icon="jobs" value="50" label="Total Jobs" />);
    
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
  });
});
