import { render, screen } from '@testing-library/react';
import UpcomingInterviews from './UpcomingInterviews';
import StatsCard from './StatsCard';
import '@testing-library/jest-dom';

describe('UpcomingInterviews Component', () => {
  test('renders the title "Upcoming Interviews"', () => {
    render(<UpcomingInterviews />);
    expect(screen.getByText('Upcoming Interviews')).toBeInTheDocument();
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
  test('renders the title "Upcoming Interviews"', () => {
    render(<UpcomingInterviews />);
    expect(screen.getByText('Upcoming Interviews')).toBeInTheDocument();
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
