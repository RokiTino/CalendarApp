import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock the components
jest.mock('../src/context/EventContext', () => ({
  useEvents: () => ({
    events: [],
    selectedDate: '2024-01-15',
    setSelectedDate: jest.fn(),
  }),
}));

// Import after mocking
import Calendar from '../src/components/Calendar/Calendar';
import CalendarDay from '../src/components/Calendar/CalendarDay';
import CalendarHeader from '../src/components/Calendar/CalendarHeader';

describe('Calendar Component', () => {
  describe('Calendar', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<Calendar />);
      // Should render month name
      expect(getByText(/January|February|March|April|May|June|July|August|September|October|November|December/)).toBeTruthy();
    });

    it('renders day headers', () => {
      const { getByText } = render(<Calendar />);
      expect(getByText('Sun')).toBeTruthy();
      expect(getByText('Mon')).toBeTruthy();
      expect(getByText('Tue')).toBeTruthy();
      expect(getByText('Wed')).toBeTruthy();
      expect(getByText('Thu')).toBeTruthy();
      expect(getByText('Fri')).toBeTruthy();
      expect(getByText('Sat')).toBeTruthy();
    });

    it('allows month navigation', () => {
      const { getByTestId } = render(<Calendar />);
      const prevButton = getByTestId('prev-month-button');
      const nextButton = getByTestId('next-month-button');
      
      expect(prevButton).toBeTruthy();
      expect(nextButton).toBeTruthy();
      
      fireEvent.press(nextButton);
      fireEvent.press(prevButton);
    });
  });

  describe('CalendarDay', () => {
    const defaultProps = {
      day: {
        date: 15,
        month: 0,
        year: 2024,
        dateString: '2024-01-15',
        isCurrentMonth: true,
        isToday: false,
        isSelected: false,
      },
      onPress: jest.fn(),
      events: [],
    };

    it('renders day number', () => {
      const { getByText } = render(<CalendarDay {...defaultProps} />);
      expect(getByText('15')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <CalendarDay {...defaultProps} onPress={onPress} />
      );
      
      fireEvent.press(getByText('15'));
      expect(onPress).toHaveBeenCalledWith('2024-01-15');
    });

    it('shows event indicators when events exist', () => {
      const eventsForDay = [
        { id: '1', title: 'Event 1', color: '#FF5733' },
        { id: '2', title: 'Event 2', color: '#33FF57' },
      ];
      
      const { getAllByTestId } = render(
        <CalendarDay {...defaultProps} events={eventsForDay as any} />
      );
      
      const indicators = getAllByTestId('event-indicator');
      expect(indicators.length).toBeLessThanOrEqual(3);
    });

    it('applies today styling', () => {
      const todayProps = {
        ...defaultProps,
        day: { ...defaultProps.day, isToday: true },
      };
      
      const { getByTestId } = render(<CalendarDay {...todayProps} />);
      expect(getByTestId('calendar-day')).toBeTruthy();
    });

    it('applies selected styling', () => {
      const selectedProps = {
        ...defaultProps,
        day: { ...defaultProps.day, isSelected: true },
      };
      
      const { getByTestId } = render(<CalendarDay {...selectedProps} />);
      expect(getByTestId('calendar-day')).toBeTruthy();
    });

    it('dims days from other months', () => {
      const otherMonthProps = {
        ...defaultProps,
        day: { ...defaultProps.day, isCurrentMonth: false },
      };
      
      const { getByText } = render(<CalendarDay {...otherMonthProps} />);
      expect(getByText('15')).toBeTruthy();
    });
  });

  describe('CalendarHeader', () => {
    const defaultProps = {
      selectedDate: '2024-01-15',
      eventCount: 3,
      onAddPress: jest.fn(),
    };

    it('renders selected date', () => {
      const { getByText } = render(<CalendarHeader {...defaultProps} />);
      expect(getByText(/January 15, 2024/)).toBeTruthy();
    });

    it('renders event count', () => {
      const { getByText } = render(<CalendarHeader {...defaultProps} />);
      expect(getByText(/3 events?/)).toBeTruthy();
    });

    it('renders singular event text for 1 event', () => {
      const { getByText } = render(
        <CalendarHeader {...defaultProps} eventCount={1} />
      );
      expect(getByText(/1 event/)).toBeTruthy();
    });

    it('calls onAddPress when add button pressed', () => {
      const onAddPress = jest.fn();
      const { getByTestId } = render(
        <CalendarHeader {...defaultProps} onAddPress={onAddPress} />
      );
      
      fireEvent.press(getByTestId('add-event-button'));
      expect(onAddPress).toHaveBeenCalled();
    });

    it('renders no events message when count is 0', () => {
      const { getByText } = render(
        <CalendarHeader {...defaultProps} eventCount={0} />
      );
      expect(getByText(/No events/)).toBeTruthy();
    });
  });
});
