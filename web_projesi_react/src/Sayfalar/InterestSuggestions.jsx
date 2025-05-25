import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button,Typography } from '@mui/material';

const mockEvents = [
  {
    id: 1,
    title: 'Yaz Konseri',
    category: 'Konser',
  },
  {
    id: 2,
    title: 'Tiyatro Gecesi',
    category: 'Tiyatro',
  },
  {
    id: 3,
    title: 'Sanat Sergisi',
    category: 'Sergi',
  },
  {
    id: 4,
    title: 'Müzik Festivali',
    category: 'Festival',
  },
];

const availableInterests = ['Konser', 'Tiyatro', 'Sergi', 'Festival'];

function InterestSuggestions() {
  const [selectedInterests, setSelectedInterests] = useState(['Konser', 'Tiyatro']);

  const handleToggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const filteredEvents = mockEvents.filter(event =>
    selectedInterests.includes(event.category)
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">İlgi Alanlarına Göre Önerilen Etkinlikler</h2>

      <div className="mb-6">
        <h3 className="font-semibold">İlgi Alanlarını Seç:</h3>
        <div className="flex gap-3 flex-wrap mt-2">
          {availableInterests.map(interest => (
            <Button
              key={interest}
              variant={selectedInterests.includes(interest) ? 'contained' : 'outlined'}
              color={selectedInterests.includes(interest) ? 'primary' : 'inherit'}
              sx={{ borderRadius: '999px', px: 3, py: 1, minWidth: 0 }}
              onClick={() => handleToggleInterest(interest)}
            >
            {interest}
            </Button>
))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredEvents.map(event => (
          <Typography>
          <div key={event.id} className="border p-4 rounded shadow">
            <h4 className="text-lg font-semibold mb-1">{event.title}</h4>
            <p className="text-sm text-gray-500">Kategori: {event.category}</p>
            <div className="mt-3 flex gap-2">
              <Button><Link to={`/event/${event.id}`} className="text-blue-600 hover:underline">Detay</Link></Button>
              <Button>Sepete Ekle</Button>
            </div>
          </div>
          </Typography>
        ))}
      </div>
    </div>
  );
}

export default InterestSuggestions;
