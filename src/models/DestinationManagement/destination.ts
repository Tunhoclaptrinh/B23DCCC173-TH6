import { useState } from 'react';
import { message } from 'antd';
import { getMockDestinations, generateUUID } from '@/services/DestinationManagement/destination';

export default () => {
	const [destinations, setDestinations] = useState<DestinationManagement.Destination[]>([]);

	// Load destination data from localStorage or initialize with mock data (dữ liệu giả)
	const getDestinationData = () => {
		const localData = localStorage.getItem('destinations');
		if (localData) {
			setDestinations(JSON.parse(localData));
		} else {
			const initialData = getMockDestinations();
			localStorage.setItem('destinations', JSON.stringify(initialData));
			setDestinations(initialData);
		}
	};

	// Add a new destination
	const addDestination = (newDestination: DestinationManagement.Destination) => {
		const isDuplicate = destinations.some((destination) => destination.name === newDestination.name);

		if (isDuplicate) {
			message.error('Destination already exists!');
			return false;
		}

		// Add UUID to the new destination
		const destinationWithId = {
			...newDestination,
			id: generateUUID(),
		};

		const updatedDestinations = [destinationWithId, ...destinations];
		localStorage.setItem('destinations', JSON.stringify(updatedDestinations));
		setDestinations(updatedDestinations);
		message.success('Destination added successfully!');
		return true;
	};

	// Update an existing destination
	const updatedDestination = (updatedDestination: DestinationManagement.Destination, originalRoomCode: string) => {
		const isDuplicate = destinations.some((destination) => destination.name === updatedDestination.name);

		if (isDuplicate) {
			message.error('Destination already exists!');
			return false;
		}

		const updatedDestinations = destinations.map((destination) =>
			destination.id === originalRoomCode ? updatedDestination : destination,
		);

		localStorage.setItem('destinations', JSON.stringify(updatedDestinations));
		setDestinations(updatedDestinations);
		message.success('Destination updated successfully!');
		return true;
	};

	// Delete a destination
	const deleteDestination = (destinationId: string) => {
		const updatedDestinations = destinations.filter((destination) => destination.id !== destinationId);
		localStorage.setItem('destinations', JSON.stringify(updatedDestinations));
		setDestinations(updatedDestinations);
		message.success('Destination deleted successfully!');
		return true;
	};

	return {
		destinations,
		getDestinationData,
		addDestination,
		updatedDestination,
		deleteDestination,
	};
};
