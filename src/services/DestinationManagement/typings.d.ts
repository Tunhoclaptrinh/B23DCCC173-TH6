declare module DestinationManagement {
	export interface User {
		id: string;
		name: string;
		email: string;
		password: string;
		role: UserRole;
	}

	export interface Destination {
		id: string;
		name: string;
		description: string;
		type: DestinationType;
		location: string;
		image_url: string;
		avg_rating: number;
		avg_food_cost: number;
		avg_transport_cost: number;
		avg_accommodation_cost: number;
		estimated_visit_duration: number;
	}
	export interface Schedule {
		id: string;
		user_id: string; // ID of the user who created the schedule
		name: string;
		start_date: string;
		end_date: string;
		total_budget: number;
		status: 'planned' | 'completed' | 'cancelled';
	}
	export interface ScheduleDays {
		id: string;
		schedule_id: string; // ID of the schedule this day belongs to
		day_number: number;
		date: string;
	}

	export interface ScheduleItems {
		id: string;
		schedule_day_id: string; // ID of the schedule day this item belongs to
		destination_id: string; // ID of the destination this item refers to
		order_in_day: number;
		estimated_transport_time: number;
		estimated_cost: number;
	}

	export interface BudgetItems {
		id: string;
		schedule_id: string; // ID of the schedule this budget item belongs to
		category: ECategoryBudget; // Category of the budget item (e.g., accommodation, food, transport, etc.)
		amount: number;
	}

	export interface Ratings {
		id: string;
		user_id: string; // ID of the user who made the rating
		destination_id: string; // ID of the destination being rated
		rating: number;
		comment: string;
		created_at: string;
	}

	export interface statistics {
		destination_id: string; // ID of the destination
		total_visits: number;
		average_rating: number;
		total_reviews: number;
		most_popular_month: string;
	}
}
