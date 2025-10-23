import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
}

const calculateTimeLeft = (endDate: string) => {
  const difference = +new Date(endDate) - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center bg-primary-light/50 text-white rounded-lg w-20 h-20 md:w-24 md:h-24 border border-white/20">
    <span className="text-3xl md:text-4xl font-bold">{String(value).padStart(2, '0')}</span>
    <span className="text-xs uppercase tracking-wider">{label}</span>
  </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary-dark mb-3">Voting Berakhir Dalam</p>
        <div className="flex justify-center space-x-2 md:space-x-4">
            <TimeBlock value={timeLeft.days} label="Hari" />
            <TimeBlock value={timeLeft.hours} label="Jam" />
            <TimeBlock value={timeLeft.minutes} label="Menit" />
            <TimeBlock value={timeLeft.seconds} label="Detik" />
        </div>
    </div>
  );
};

export default CountdownTimer;