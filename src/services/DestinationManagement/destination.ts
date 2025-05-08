import { EUserRole, EDestinationType, ECategoryBudget } from '../base/constant';

// Function to generate a UUID
export const generateUUID = (): string => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

// Mock Users
export const getMockUsers = (): DestinationManagement.User[] => {
	return [
		{
			id: generateUUID(),
			name: 'Admin User',
			email: 'admin@travelplanner.com',
			password: 'admin123', // In a real app, passwords would be hashed
			role: EUserRole.ADMIN,
		},
		{
			id: generateUUID(),
			name: 'Regular User',
			email: 'user@travelplanner.com',
			password: 'user123',
			role: EUserRole.USER,
		},
	];
};

// Mock Destinations
export const getMockDestinations = (): DestinationManagement.Destination[] => {
	return [
		{
			id: generateUUID(),
			name: 'Ha Long Bay',
			description:
				'Ha Long Bay is a UNESCO World Heritage Site and popular travel destination in Quang Ninh Province, Vietnam. The bay features thousands of limestone karsts and isles in various shapes and sizes.',
			type: EDestinationType.BEACH,
			image_url: 'https://minio.vnptquangninh.vn/halongbay/images/1730084792tructhangvinhhalong.jpg',
			location: 'Ha Long',
			avg_rating: 4.8,
			avg_food_cost: 300000, // in VND
			avg_transport_cost: 250000,
			avg_accommodation_cost: 1200000,
			estimated_visit_duration: 6, // hours
		},
		{
			id: generateUUID(),
			name: 'Sapa',
			description:
				'Sapa is a town in the Hoàng Liên Son Mountains of northwestern Vietnam. It is known for its terraced rice fields and hiking trails.',
			type: EDestinationType.MOUNTAIN,
			image_url: '/api/placeholder/800/500',
			location: 'Sapa',
			avg_rating: 4.5,
			avg_food_cost: 250000,
			avg_transport_cost: 300000,
			avg_accommodation_cost: 800000,
			estimated_visit_duration: 8,
		},
		{
			id: generateUUID(),
			name: 'Hoi An',
			description:
				"Hoi An is a city on Vietnam's central coast known for its well-preserved Ancient Town, cut through with canals.",
			type: EDestinationType.HISTORICAL,
			image_url: '/api/placeholder/800/500',
			location: 'Da Nang',
			avg_rating: 4.7,
			avg_food_cost: 200000,
			avg_transport_cost: 150000,
			avg_accommodation_cost: 900000,
			estimated_visit_duration: 5,
		},
		{
			id: generateUUID(),
			name: 'Da Nang',
			description:
				'Da Nang is a coastal city in central Vietnam known for its sandy beaches and history as a French colonial port.',
			type: EDestinationType.CITY,
			image_url: '/api/placeholder/800/500',
			location: 'Da Nang',
			avg_rating: 4.6,
			avg_food_cost: 250000,
			avg_transport_cost: 200000,
			avg_accommodation_cost: 1000000,
			estimated_visit_duration: 7,
		},
		{
			id: generateUUID(),
			name: 'Phong Nha Caves',
			description:
				'Phong Nha-Ke Bang National Park is known for its ancient limestone karsts and caves, including Phong Nha Cave.',
			type: EDestinationType.NATURE,
			image_url: '/api/placeholder/800/500',
			location: 'Phong Nha Caves',
			avg_rating: 4.9,
			avg_food_cost: 180000,
			avg_transport_cost: 350000,
			avg_accommodation_cost: 700000,
			estimated_visit_duration: 6,
		},
		{
			id: generateUUID(),
			name: 'Nha Trang',
			description:
				'Nha Trang is a coastal resort city in southern Vietnam known for its beaches, diving sites and offshore islands.',
			type: EDestinationType.BEACH,
			image_url: '/api/placeholder/800/500',
			location: 'Nha Trang',
			avg_rating: 4.3,
			avg_food_cost: 220000,
			avg_transport_cost: 180000,
			avg_accommodation_cost: 950000,
			estimated_visit_duration: 5,
		},
		{
			id: generateUUID(),
			name: 'Ho Chi Minh City',
			description:
				'Ho Chi Minh City (formerly Saigon) is the largest city in Vietnam, known for its French colonial landmarks and vibrant street life.',
			type: EDestinationType.CITY,
			image_url: '/api/placeholder/800/500',
			location: 'Ho Chi Minh City',
			avg_rating: 4.4,
			avg_food_cost: 300000,
			avg_transport_cost: 150000,
			avg_accommodation_cost: 1100000,
			estimated_visit_duration: 8,
		},
		{
			id: generateUUID(),
			name: 'Nhà AN LE',
			description: 'haizzz',
			type: EDestinationType.CITY,
			image_url: '/api/placeholder/800/500',
			location: 'Hai Phong City',
			avg_rating: 2,
			avg_food_cost: 300000,
			avg_transport_cost: 150000,
			avg_accommodation_cost: 1100000,
			estimated_visit_duration: 8,
		},
		{
			id: generateUUID(),
			name: 'Hue',
			description:
				'Hue is a city in central Vietnam that was the seat of Nguyen Dynasty emperors and the national capital from 1802 to 1945.',
			type: EDestinationType.HISTORICAL,
			image_url: '/api/placeholder/800/500',
			location: 'Hue City',
			avg_rating: 4.2,
			avg_food_cost: 180000,
			avg_transport_cost: 200000,
			avg_accommodation_cost: 750000,
			estimated_visit_duration: 6,
		},
	];
};

// Mock Schedules (empty initially, to be created by users)
export const getMockSchedules = (): DestinationManagement.Schedule[] => {
	return [
		{
			id: generateUUID(),
			user_id: getMockUsers()[1].id, // Regular user's ID
			name: 'Central Vietnam Trip',
			start_date: '2023-10-15',
			end_date: '2023-10-20',
			total_budget: 10000000, // 10 million VND
		},
	];
};

// Mock Schedule Days
export const getMockScheduleDays = (): DestinationManagement.ScheduleDays[] => {
	const mockSchedule = getMockSchedules()[0];

	return [
		{
			id: generateUUID(),
			schedule_id: mockSchedule.id,
			day_number: 1,
			date: '2023-10-15',
		},
		{
			id: generateUUID(),
			schedule_id: mockSchedule.id,
			day_number: 2,
			date: '2023-10-16',
		},
		{
			id: generateUUID(),
			schedule_id: mockSchedule.id,
			day_number: 3,
			date: '2023-10-17',
		},
	];
};

// Mock Schedule Items
export const getMockScheduleItems = (): DestinationManagement.ScheduleItems[] => {
	const mockDays = getMockScheduleDays();
	const mockDestinations = getMockDestinations();

	return [
		{
			id: generateUUID(),
			schedule_day_id: mockDays[0].id,
			destination_id: mockDestinations[2].id, // Hoi An
			order_in_day: 1,
			estimated_transport_time: 60, // minutes
			estimated_cost: 350000,
		},
		{
			id: generateUUID(),
			schedule_day_id: mockDays[1].id,
			destination_id: mockDestinations[3].id, // Da Nang
			order_in_day: 1,
			estimated_transport_time: 30,
			estimated_cost: 450000,
		},
	];
};

// Mock Budget Items
export const getMockBudgetItems = (): DestinationManagement.BudgetItems[] => {
	const mockSchedule = getMockSchedules()[0];

	return [
		{
			id: generateUUID(),
			schedule_id: mockSchedule.id,
			category: ECategoryBudget.ACCOMMODATION,
			amount: 3000000,
		},
		{
			id: generateUUID(),
			schedule_id: mockSchedule.id,
			category: ECategoryBudget.FOOD,
			amount: 2500000,
		},
		{
			id: generateUUID(),
			schedule_id: mockSchedule.id,
			category: ECategoryBudget.TRANSPORT,
			amount: 2000000,
		},
		{
			id: generateUUID(),
			schedule_id: mockSchedule.id,
			category: ECategoryBudget.ACTIVITIES,
			amount: 1500000,
		},
		{
			id: generateUUID(),
			schedule_id: mockSchedule.id,
			category: ECategoryBudget.ACCOMMODATION,
			amount: 1000000,
		},
	];
};

// Mock Ratings
export const getMockRatings = (): DestinationManagement.Ratings[] => {
	const mockDestinations = getMockDestinations();
	const mockUsers = getMockUsers();

	return [
		{
			id: generateUUID(),
			user_id: mockUsers[1].id,
			destination_id: mockDestinations[0].id, // Ha Long Bay
			rating: 5,
			comment: 'Breathtaking views, highly recommend!',
			created_at: '2023-09-10',
		},
		{
			id: generateUUID(),
			user_id: mockUsers[1].id,
			destination_id: mockDestinations[1].id, // Sapa
			rating: 4,
			comment: 'Beautiful mountains, but prepare for colder weather.',
			created_at: '2023-08-25',
		},
	];
};

// Mock Statistics
export const getMockStatistics = (): DestinationManagement.statistics[] => {
	const mockDestinations = getMockDestinations();

	return mockDestinations.map((destination) => ({
		destination_id: destination.id,
		total_visits: Math.floor(Math.random() * 100) + 50,
		average_rating: destination.avg_rating,
		total_reviews: Math.floor(Math.random() * 50) + 10,
		most_popular_month: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		][Math.floor(Math.random() * 12)],
	}));
};

// // Mock Monthly Stats for Admin Dashboard
// export const getMockMonthlyStats = (): MonthlyStats[] => {
// 	return [
// 		{ month: 'Jan', schedules_created: 45, total_revenue: 45000000 },
// 		{ month: 'Feb', schedules_created: 52, total_revenue: 52000000 },
// 		{ month: 'Mar', schedules_created: 61, total_revenue: 61000000 },
// 		{ month: 'Apr', schedules_created: 70, total_revenue: 70000000 },
// 		{ month: 'May', schedules_created: 85, total_revenue: 85000000 },
// 		{ month: 'Jun', schedules_created: 93, total_revenue: 93000000 },
// 		{ month: 'Jul', schedules_created: 105, total_revenue: 105000000 },
// 		{ month: 'Aug', schedules_created: 120, total_revenue: 120000000 },
// 		{ month: 'Sep', schedules_created: 95, total_revenue: 95000000 },
// 		{ month: 'Oct', schedules_created: 80, total_revenue: 80000000 },
// 		{ month: 'Nov', schedules_created: 68, total_revenue: 68000000 },
// 		{ month: 'Dec', schedules_created: 75, total_revenue: 75000000 },
// 	];
// };

// // Mock Popular Destination Stats
// export const getMockPopularDestinations = (): PopularDestinationStats[] => {
// 	const mockDestinations = getMockDestinations();

// 	return mockDestinations
// 		.map((destination) => ({
// 			destination_id: destination.id,
// 			destination_name: destination.name,
// 			visit_count: Math.floor(Math.random() * 200) + 50,
// 		}))
// 		.sort((a, b) => b.visit_count - a.visit_count)
// 		.slice(0, 5); // Top 5 destinations
// };

// // Mock Budget Distribution
// export const getMockBudgetDistribution = (): BudgetDistribution[] => {
// 	const totalBudget = 10000000; // 10 million VND

// 	return [
// 		{ category: CategoryBudget.Accommodation, amount: 3000000, percentage: 30 },
// 		{ category: CategoryBudget.Food, amount: 2500000, percentage: 25 },
// 		{ category: CategoryBudget.Transport, amount: 2000000, percentage: 20 },
// 		{ category: CategoryBudget.Activities, amount: 1500000, percentage: 15 },
// 		{ category: CategoryBudget.Miscellaneous, amount: 1000000, percentage: 10 },
// 	];
// };

// Initialize Data
export const initializeAppData = () => {
	// Check if data already exists in localStorage
	if (!localStorage.getItem('users')) {
		localStorage.setItem('users', JSON.stringify(getMockUsers()));
	}

	if (!localStorage.getItem('destinations')) {
		localStorage.setItem('destinations', JSON.stringify(getMockDestinations()));
	}

	if (!localStorage.getItem('schedules')) {
		localStorage.setItem('schedules', JSON.stringify(getMockSchedules()));
	}

	if (!localStorage.getItem('scheduleDays')) {
		localStorage.setItem('scheduleDays', JSON.stringify(getMockScheduleDays()));
	}

	if (!localStorage.getItem('scheduleItems')) {
		localStorage.setItem('scheduleItems', JSON.stringify(getMockScheduleItems()));
	}

	if (!localStorage.getItem('budgetItems')) {
		localStorage.setItem('budgetItems', JSON.stringify(getMockBudgetItems()));
	}

	if (!localStorage.getItem('ratings')) {
		localStorage.setItem('ratings', JSON.stringify(getMockRatings()));
	}

	if (!localStorage.getItem('statistics')) {
		localStorage.setItem('statistics', JSON.stringify(getMockStatistics()));
	}

	// // For admin dashboard
	// if (!localStorage.getItem('monthlyStats')) {
	// 	localStorage.setItem('monthlyStats', JSON.stringify(getMockMonthlyStats()));
	// }

	// if (!localStorage.getItem('popularDestinations')) {
	// 	localStorage.setItem('popularDestinations', JSON.stringify(getMockPopularDestinations()));
	// }

	// if (!localStorage.getItem('budgetDistribution')) {
	// 	localStorage.setItem('budgetDistribution', JSON.stringify(getMockBudgetDistribution()));
	// }
};

// Format currency to Vietnamese Dong (VND)
export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Calculate days between two dates
export const getDaysBetweenDates = (startDate: string, endDate: string): number => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const diffTime = Math.abs(end.getTime() - start.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
	return diffDays;
};

// Format date to display
export const formatDate = (dateString: string): string => {
	const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
	return new Date(dateString).toLocaleDateString('en-US', options);
};
