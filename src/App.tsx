import { useState } from 'react';
import './styles.css';

type BookingStep = 'select-date' | 'select-time' | 'confirm' | 'success';

interface Booking {
  date: Date | null;
  time: string | null;
  name: string;
  email: string;
  service: string;
}

const services = [
  { id: 'consultation', name: 'Consultation', duration: '30 min' },
  { id: 'session', name: 'Full Session', duration: '60 min' },
  { id: 'extended', name: 'Extended Session', duration: '90 min' },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

function App() {
  const [step, setStep] = useState<BookingStep>('select-date');
  const [booking, setBooking] = useState<Booking>({
    date: null,
    time: null,
    name: '',
    email: '',
    service: 'consultation'
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isDateValid = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() !== 0 && date.getDay() !== 6;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateSelect = (day: number) => {
    if (!isDateValid(day)) return;
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setBooking({ ...booking, date: selectedDate });
    setStep('select-time');
  };

  const handleTimeSelect = (time: string) => {
    setBooking({ ...booking, time });
    setStep('confirm');
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (booking.name && booking.email) {
      setStep('success');
    }
  };

  const resetBooking = () => {
    setBooking({ date: null, time: null, name: '', email: '', service: 'consultation' });
    setStep('select-date');
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="app">
      <div className="texture-overlay" />

      <header className="header">
        <div className="header-ornament" />
        <h1 className="logo">Reserve</h1>
        <p className="tagline">Book your moment</p>
      </header>

      <main className="main">
        <div className="card">
          {/* Progress Indicator */}
          <div className="progress">
            <div className={`progress-step ${step === 'select-date' ? 'active' : ''} ${['select-time', 'confirm', 'success'].includes(step) ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Date</span>
            </div>
            <div className="progress-line" />
            <div className={`progress-step ${step === 'select-time' ? 'active' : ''} ${['confirm', 'success'].includes(step) ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Time</span>
            </div>
            <div className="progress-line" />
            <div className={`progress-step ${step === 'confirm' ? 'active' : ''} ${step === 'success' ? 'completed' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Confirm</span>
            </div>
          </div>

          {/* Step 1: Date Selection */}
          {step === 'select-date' && (
            <div className="step-content fade-in">
              <h2 className="step-title">Choose a Date</h2>

              {/* Service Selection */}
              <div className="service-selector">
                {services.map((service) => (
                  <button
                    key={service.id}
                    className={`service-btn ${booking.service === service.id ? 'selected' : ''}`}
                    onClick={() => setBooking({ ...booking, service: service.id })}
                  >
                    <span className="service-name">{service.name}</span>
                    <span className="service-duration">{service.duration}</span>
                  </button>
                ))}
              </div>

              {/* Calendar */}
              <div className="calendar">
                <div className="calendar-header">
                  <button
                    className="nav-btn"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <span className="month-name">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button
                    className="nav-btn"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
                <div className="calendar-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <span key={day} className="weekday">{day}</span>
                  ))}
                </div>
                <div className="calendar-days">
                  {getDaysInMonth(currentMonth).map((day, index) => (
                    <button
                      key={index}
                      className={`day-btn ${day === null ? 'empty' : ''} ${day && !isDateValid(day) ? 'disabled' : ''} ${day && isDateValid(day) ? 'available' : ''}`}
                      onClick={() => day && handleDateSelect(day)}
                      disabled={day === null || !isDateValid(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Time Selection */}
          {step === 'select-time' && (
            <div className="step-content fade-in">
              <button className="back-btn" onClick={() => setStep('select-date')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back
              </button>
              <h2 className="step-title">Select a Time</h2>
              <p className="selected-date">{booking.date && formatDate(booking.date)}</p>

              <div className="time-grid">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className="time-btn"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirm' && (
            <div className="step-content fade-in">
              <button className="back-btn" onClick={() => setStep('select-time')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Back
              </button>
              <h2 className="step-title">Confirm Booking</h2>

              <div className="booking-summary">
                <div className="summary-item">
                  <span className="summary-label">Service</span>
                  <span className="summary-value">{services.find(s => s.id === booking.service)?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Date</span>
                  <span className="summary-value">{booking.date && formatDate(booking.date)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Time</span>
                  <span className="summary-value">{booking.time}</span>
                </div>
              </div>

              <form className="booking-form" onSubmit={handleConfirm}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={booking.name}
                    onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={booking.email}
                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <button type="submit" className="confirm-btn">
                  Confirm Reservation
                </button>
              </form>
            </div>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="step-content fade-in success-content">
              <div className="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="step-title">Booking Confirmed</h2>
              <p className="success-message">
                Thank you, {booking.name}! Your reservation has been confirmed.
              </p>

              <div className="confirmation-card">
                <div className="confirmation-detail">
                  <span>{services.find(s => s.id === booking.service)?.name}</span>
                </div>
                <div className="confirmation-detail">
                  <span>{booking.date && formatDate(booking.date)}</span>
                </div>
                <div className="confirmation-detail">
                  <span>{booking.time}</span>
                </div>
              </div>

              <p className="email-note">A confirmation email has been sent to {booking.email}</p>

              <button className="new-booking-btn" onClick={resetBooking}>
                Make Another Booking
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <span>Requested by @wenxora · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
