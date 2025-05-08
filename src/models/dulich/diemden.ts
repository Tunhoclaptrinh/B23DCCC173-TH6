import { useState, useEffect } from 'react';
import { DestinationType } from '@/services/DuLich/constant';

export default () => {
  const storageKey = 'destinations';
  const initialData: DestinationManagement.Destination[] = [
    {
      id: '1',
      name: 'Vịnh Hạ Long',
      description: 'string',
      type: DestinationType.BEACH,
      image_url: '',
      avg_rating: 5.0,
      avg_food_cost: 120000,
      avg_transport_cost: 120000,
      avg_accommodation_cost: 120000,
      estimated_visit_duration: 120000,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DestinationManagement.Destination[]>(initialData);
  const [categoryFilter, setCategoryFilter] = useState<DestinationType | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [sortOrder, setSortOrder] = useState<string>('none');

  const loadFromStorage = (): DestinationManagement.Destination[] => {
    try {
      const storedData = localStorage.getItem(storageKey);
      return storedData ? JSON.parse(storedData) : initialData;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialData;
    }
  };

  const getData = () => {
    setLoading(true);
    const storedData = loadFromStorage();
    setData(storedData);
    setLoading(false);
  };

  const filteredDestinations = data
    .filter((dest) => {
      return (!categoryFilter || dest.type === categoryFilter) &&
             dest.avg_accommodation_cost >= priceRange[0] &&
             dest.avg_accommodation_cost <= priceRange[1];
    })
    .sort((a, b) => {
      if (sortOrder === 'priceAsc') return a.avg_accommodation_cost - b.avg_accommodation_cost;
      if (sortOrder === 'priceDesc') return b.avg_accommodation_cost - a.avg_accommodation_cost;
      if (sortOrder === 'ratingDesc') return b.avg_rating - a.avg_rating;
      return 0;
    });

  useEffect(() => {
    getData();
  }, []);

  return {
    loading,
    getData,
    filteredDestinations,
    setPriceRange,
    setSortOrder,
    setCategoryFilter,
    priceRange
  };
};

