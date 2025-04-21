import { render, screen } from '@testing-library/react';
import RecruiterDashboard from './RecruiterDashboard';
import '@testing-library/jest-dom';

// Mock child components since they have their own tests
vi.mock('../../components/StatsCard', () => ({
  default: () => <div data-testid="stats-card">StatsCard</div>,
}));

vi.mock('../../components/RecentApplications', () => ({
  default: () => <div data-testid="recent-applications">RecentApplications</div>,
}));

vi.mock('../../components/UpcomingInterviews', () => ({
  default: () => <div data-testid="upcoming-interviews">UpcomingInterviews</div>,
}));

describe('RecruiterDashboard Component', () => {
  test('renders dashboard title and welcome message', () => {
    render(<RecruiterDashboard />);
    
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Welcome back, Sarah!')).toBeInTheDocument();
  });

  test('renders all stats cards', () => {
    render(<RecruiterDashboard />);

    const statsCards = screen.getAllByTestId('stats-card');
    expect(statsCards.length).toBe(4); // 4 StatsCard components should be rendered
  });

  test('renders Recent Applications section', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByTestId('recent-applications')).toBeInTheDocument();
  });

  test('renders Upcoming Interviews section', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByTestId('upcoming-interviews')).toBeInTheDocument();
  });
  test('renders dashboard title and welcome message', () => {
    render(<RecruiterDashboard />);
    
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Welcome back, Sarah!')).toBeInTheDocument();
  });
  test('renders all stats cards', () => {
    render(<RecruiterDashboard />);

    const statsCards = screen.getAllByTestId('stats-card');
    expect(statsCards.length).toBe(4); // 4 StatsCard components should be rendered
  });

  test('renders Recent Applications section', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByTestId('recent-applications')).toBeInTheDocument();
  });

  test('renders Upcoming Interviews section', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByTestId('upcoming-interviews')).toBeInTheDocument();
  });
  test('renders dashboard title and welcome message', () => {
    render(<RecruiterDashboard />);
    
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Welcome back, Sarah!')).toBeInTheDocument();
  });

  test('renders all stats cards', () => {
    render(<RecruiterDashboard />);

    const statsCards = screen.getAllByTestId('stats-card');
    expect(statsCards.length).toBe(4); // 4 StatsCard components should be rendered
  });

  test('renders Recent Applications section', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByTestId('recent-applications')).toBeInTheDocument();
  });

  test('renders Upcoming Interviews section', () => {
    render(<RecruiterDashboard />);
    expect(screen.getByTestId('upcoming-interviews')).toBeInTheDocument();
  });
});
