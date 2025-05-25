"use client"

import React, { useState } from 'react';

const daysInWeek = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysArray = [...Array(lastDayOfMonth.getDate()).keys()].map(i => i + 1);

  const handleDayClick = (day: number) => {
    alert(`Du klickade på ${day}/${currentDate.getMonth() + 1}`);
  };

  const getStartPadding = () => {
    const day = firstDayOfMonth.getDay();
    return day === 0 ? 6 : day - 1; // Söndag = 0, Måndag = 1
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto my-4">
      <div className="flex justify-between mb-4 items-center">
        <button
          className="text-lg"
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
        >
          ⬅
        </button>
        <h2 className="text-xl font-bold capitalize">
          {currentDate.toLocaleString('sv-SE', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          className="text-lg"
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
        >
          ➡
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysInWeek.map(day => (
          <div key={day} className="font-semibold text-gray-600">{day}</div>
        ))}
        {Array(getStartPadding()).fill(null).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {daysArray.map(day => (
          <div
            key={day}
            onClick={() => handleDayClick(day)}
            className={`p-2 rounded-full hover:bg-blue-300 transition cursor-pointer ${
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
