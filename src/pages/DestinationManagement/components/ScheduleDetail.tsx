import { Modal, Typography, Card, Row, Col, Statistic, Timeline, Divider, Tag, Alert, Empty } from 'antd';
import { useModel } from 'umi';
import { CalendarOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import React from 'react';

const { Title, Text } = Typography;

interface ScheduleDetailProps {
	visible: boolean;
	schedule: DestinationManagement.Schedule | null;
	onCancel: () => void;
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ visible, schedule, onCancel }) => {
	const { scheduleDays, scheduleItems, getScheduleData } = useModel('DestinationManagement.schedule');
	const { destinations, getDestinationData } = useModel('DestinationManagement.destination');
	const { calculateBudgetStats } = useModel('DestinationManagement.budget');

	if (!schedule) return null;

	React.useEffect(() => {
		getScheduleData();
		getDestinationData();
	}, []);

	// Format currency helper
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(value);
	};

	// Get the schedule days for this schedule, sorted by day number
	const days = scheduleDays
		.filter((day) => day.schedule_id === schedule.id)
		.sort((a, b) => a.day_number - b.day_number);

	console.log('Filtered days:', days);

	// For each day, get its schedule items with full destination details
	const daySchedules = days.map((day) => {
		// Lọc items cho ngày hiện tại
		const dayItems = scheduleItems
			.filter((item) => {
				console.log('Comparing:', {
					itemDayId: item.schedule_day_id,
					currentDayId: day.id,
					match: item.schedule_day_id === day.id,
				});
				return item.schedule_day_id === day.id;
			})
			.sort((a, b) => a.order_in_day - b.order_in_day)
			.map((item) => {
				// Tìm destination tương ứng
				const destination = destinations.find((d) => {
					console.log('Finding destination:', {
						destId: d.id,
						itemDestId: item.destination_id,
						match: d.id === item.destination_id,
					});
					return d.id.toString() === item.destination_id.toString();
				});

				return {
					...item,
					destination,
				};
			})
			.filter((item) => {
				if (!item.destination) {
					console.warn(`No destination found for item ${item.id}`);
					return false;
				}
				return true;
			});

		console.log(`Items for day ${day.day_number}:`, dayItems);

		return {
			day,
			items: dayItems,
		};
	});

	// Calculate total estimated cost
	const totalEstimatedCost = scheduleItems
		.filter((item) => days.some((day) => day.id === item.schedule_day_id))
		.reduce((sum, item) => sum + (item.estimated_cost || 0), 0);

	// Get budget stats if available
	const budgetStats = calculateBudgetStats ? calculateBudgetStats(schedule.id) : null;

	// Count total destinations
	const totalDestinations = daySchedules.reduce((count, day) => count + day.items.length, 0);

	console.log('Days:', days);
	console.log('Day Schedules:', daySchedules);
	console.log('All Schedule Items:', scheduleItems);

	return (
		<Modal
			title={`Schedule Details - ${schedule.name}`}
			visible={visible}
			onCancel={onCancel}
			width={1000}
			footer={null}
		>
			<Row gutter={24}>
				<Col span={16}>
					<Card
						title={
							<div>
								<CalendarOutlined /> Daily Itinerary
								<Text type='secondary' style={{ marginLeft: 8 }}>
									{new Date(schedule.start_date).toLocaleDateString()} -{' '}
									{new Date(schedule.end_date).toLocaleDateString()}
								</Text>
							</div>
						}
					>
						{daySchedules.length === 0 ? (
							<Empty description='No schedule days found' />
						) : (
							<Timeline>
								{daySchedules.map(({ day, items }) => {
									// Lấy activities theo schedule_day_id
									const activities = scheduleItems
										// .filter((item) => {
										// 	const isMatch = item.schedule_day_id === day.id;
										// 	console.log('Activity check:', {
										// 		itemId: item.id,
										// 		scheduleDayId: item.schedule_day_id,
										// 		currentDayId: day.id,
										// 		isMatch,
										// 	});
										// 	return isMatch;
										// })
										.map((item) => {
											const destination = destinations.find((d) => d.id.toString() === item.destination_id.toString());
											return { ...item, destination };
										})
										.filter((item) => item.destination);

									console.log(`Activities for day ${day.day_number}:`, activities);

									return (
										<Timeline.Item key={day.id}>
											<Title level={5}>
												Day {day.day_number} - {new Date(day.date).toLocaleDateString()}
											</Title>

											{activities.length === 0 ? (
												<Alert message='No activities planned for this day' type='info' showIcon />
											) : (
												activities.map((activity) => (
													<Card size='small' style={{ marginBottom: 8 }} key={activity.id}>
														<Row gutter={16}>
															<Col span={16}>
																<div style={{ fontWeight: 'bold' }}>{activity.destination?.name}</div>
																<div>
																	{activity.destination?.type && <Tag color='blue'>{activity.destination.type}</Tag>}
																	{activity.destination?.avg_rating && (
																		<Tag color='gold'>{activity.destination.avg_rating}★</Tag>
																	)}
																</div>
																<Text type='secondary'>
																	<ClockCircleOutlined /> Visit duration:{' '}
																	{activity.destination?.estimated_visit_duration} min
																</Text>
																<br />
																<Text type='secondary'>
																	<ClockCircleOutlined /> Transport time:{' '}
																	{Math.floor(activity.estimated_transport_time / 60)}h{' '}
																	{activity.estimated_transport_time % 60}m
																</Text>
															</Col>
															<Col span={8} style={{ textAlign: 'right' }}>
																<div>
																	<Text strong>Estimated Cost:</Text>
																	<div>
																		<DollarOutlined /> {formatCurrency(activity.estimated_cost)}
																	</div>
																</div>
																{activity.destination?.location && (
																	<div style={{ marginTop: 8 }}>
																		<Text type='secondary'>{activity.destination.location}</Text>
																	</div>
																)}
															</Col>
														</Row>
													</Card>
												))
											)}
										</Timeline.Item>
									);
								})}
							</Timeline>
						)}
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title='Total Budget'
							value={schedule.total_budget}
							prefix='₫'
							precision={0}
							valueStyle={{ color: totalEstimatedCost > schedule.total_budget ? '#cf1322' : '#3f8600' }}
						/>
						{totalEstimatedCost > schedule.total_budget && (
							<Alert message='Budget exceeded!' type='warning' showIcon style={{ marginTop: 8 }} />
						)}
						<Divider />
						<Statistic title='Estimated Cost' value={totalEstimatedCost} prefix='₫' precision={0} />
						<Divider />
						<Statistic title='Total Days' value={days.length} suffix='days' />
						<Divider />
						<Statistic title='Total Destinations' value={totalDestinations} suffix='places' />

						{budgetStats && Object.keys(budgetStats).length > 0 && (
							<>
								<Divider />
								<Title level={5}>Budget Breakdown</Title>
								{Object.entries(budgetStats).map(([category, stats]) => (
									<div key={category} style={{ marginBottom: 8 }}>
										<Row justify='space-between'>
											<Text>{category}</Text>
											<Text type={stats.isOverBudget ? 'danger' : undefined}>
												{formatCurrency(stats.spent)} / {formatCurrency(stats.limit)}
											</Text>
										</Row>
									</div>
								))}
							</>
						)}
					</Card>
				</Col>
			</Row>
		</Modal>
	);
};

export default ScheduleDetail;
