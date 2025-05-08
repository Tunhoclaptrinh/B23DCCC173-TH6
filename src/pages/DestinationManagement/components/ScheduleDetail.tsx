import { Modal, Typography, Card, Row, Col, Statistic, Timeline, Divider, Tag } from 'antd';
import { useModel } from 'umi';

const { Title } = Typography;

interface ScheduleDetailProps {
	visible: boolean;
	schedule: any;
	onCancel: () => void;
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ visible, schedule, onCancel }) => {
	const { scheduleDays, scheduleItems } = useModel('DestinationManagement.schedule');
	const { destinations } = useModel('DestinationManagement.destination');

	if (!schedule) return null;

	// Get the schedule days for this schedule
	const days = scheduleDays.filter((day) => day.schedule_id === schedule.id);

	// Get schedule items and join with destination data
	const scheduleDestinationItems = scheduleItems
		.filter((item) => days.some((day) => day.id === item.schedule_day_id))
		.map((item) => {
			const destination = destinations.find((d) => d.id === item.destination_id);
			return {
				...item,
				destination,
				day_number: days.find((day) => day.id === item.schedule_day_id)?.day_number || 0,
			};
		})
		.sort((a, b) => a.day_number - b.day_number);

	// Get unique day numbers
	const dayNumbers = Array.from(new Set(scheduleDestinationItems.map((item) => item.day_number)));

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
					<Card title='Daily Itinerary'>
						<Timeline>
							{dayNumbers.map((dayNum) => (
								<Timeline.Item key={dayNum}>
									<Title level={5}>Day {dayNum}</Title>
									{scheduleDestinationItems
										.filter((item) => item.day_number === dayNum)
										.map((item) => (
											<Card size='small' style={{ marginBottom: 8 }} key={item.id}>
												<Row justify='space-between' align='middle'>
													<Col>
														<div>{item.destination?.name}</div>
														<Tag color='blue'>{item.destination?.type}</Tag>
													</Col>
													<Col>
														{new Intl.NumberFormat('vi-VN', {
															style: 'currency',
															currency: 'VND',
														}).format(
															(item.destination?.avg_accommodation_cost ?? 0) +
																(item.destination?.avg_food_cost ?? 0) +
																(item.destination?.avg_transport_cost ?? 0),
														)}
													</Col>
												</Row>
											</Card>
										))}
								</Timeline.Item>
							))}
						</Timeline>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic title='Total Budget' value={schedule.total_budget} prefix='₫' precision={0} />
						<Divider />
						<Statistic title='Total Days' value={dayNumbers.length} suffix='days' />
						<Divider />
						<Statistic title='Total Destinations' value={scheduleDestinationItems.length} suffix='places' />
					</Card>
				</Col>
			</Row>
		</Modal>
	);
};

export default ScheduleDetail;
