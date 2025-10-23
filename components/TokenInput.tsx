import React, { useRef, ChangeEvent, KeyboardEvent } from 'react';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const TokenInput: React.FC<TokenInputProps> = ({ value, onChange, disabled }) => {
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const length = 6;

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value.toUpperCase();
    if (/^[A-Z0-9]*$/.test(newValue)) {
      const newOtp = value.split('');
      newOtp[index] = newValue.slice(-1);
      onChange(newOtp.join(''));

      if (newValue && index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData('text/plain')
        .slice(0, length)
        .toUpperCase();

      if (/^[A-Z0-9]*$/.test(pastedData)) {
          onChange(pastedData.padEnd(length, ' ').substring(0, length).trim());
          inputsRef.current[Math.min(pastedData.length -1, length -1)]?.focus();
      }
  };


  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el!)}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={disabled}
          className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-mono font-bold border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition disabled:bg-slate-100"
        />
      ))}
    </div>
  );
};

export default TokenInput;