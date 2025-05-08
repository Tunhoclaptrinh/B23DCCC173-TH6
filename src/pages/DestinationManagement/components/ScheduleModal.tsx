import {
	Modal,
	Steps,
	Card,
	DatePicker,
	Row,
	Col,
	List,
	Tag,
	Button,
	Form,
	Input,
	Statistic,
	Space,
	Divider,
	message,
} from 'antd';
import { CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useModel } from 'umi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import { Select } from 'antd';

const { RangePicker } = DatePicker;

interface CreateItineraryModalProps {
	visible: boolean;
	onCancel: () => void;
	onSuccess: () => void;
}

const CreateItineraryModal: React.FC<CreateItineraryModalProps> = ({ visible, onCancel, onSuccess }) => {
	const { destinations } = useModel('DestinationManagement.destination');
	const { addSchedule, addScheduleItem } = useModel('DestinationManagement.schedule');
	const [form] = Form.useForm();

	// States
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
	const [itineraryDays, setItineraryDays] = useState<
		Array<{
			date: string;
			destinations: DestinationManagement.Destination[];
		}>
	>([]);

	// Calculate total budget
	const calculateTotalBudget = () => {
		let total = 0;
		itineraryDays.forEach((day) => {
			day.destinations.forEach((dest) => {
				total += dest.avg_accommodation_cost + dest.avg_food_cost + dest.avg_transport_cost;
			});
		});
		return total;
	};

	// Handle date selection
	const handleDateChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
		if (!dates) return;
		setSelectedDates(dates);

		// Create days array
		const days = [];
		let currentDate = dates[0];
		while (currentDate.isBefore(dates[1]) || currentDate.isSame(dates[1], 'day')) {
			days.push({
				date: currentDate.format('YYYY-MM-DD'),
				destinations: [],
			});
			currentDate = currentDate.add(1, 'day');
		}
		setItineraryDays(days);
		setCurrentStep(1);
	};

	// Handle destination drag and drop
	const onDragEnd = (result: any) => {
		if (!result.destination) return;

		const sourceDay = parseInt(result.source.droppableId);
		const destDay = parseInt(result.destination.droppableId);
		const sourceIndex = result.source.index;
		const destIndex = result.destination.index;

		const newDays = [...itineraryDays];
		const [movedDestination] = newDays[sourceDay].destinations.splice(sourceIndex, 1);
		newDays[destDay].destinations.splice(destIndex, 0, movedDestination);

		setItineraryDays(newDays);
	};

	// Add destination to a day
	const addDestinationToDay = (destination: DestinationManagement.Destination, dayIndex: number) => {
		const newDays = [...itineraryDays];
		newDays[dayIndex].destinations.push(destination);
		setItineraryDays(newDays);
	};

	// Save itinerary
	const handleSave = async () => {
		try {
			const values = await form.validateFields();
			const scheduleId = addSchedule({
				...values,
				start_date: selectedDates![0].format('YYYY-MM-DD'),
				end_date: selectedDates![1].format('YYYY-MM-DD'),
				total_budget: calculateTotalBudget(),
				status: 'planned',
			});

			// Add schedule items
			itineraryDays.forEach((day, dayIndex) => {
				day.destinations.forEach((dest, destIndex) => {
					addScheduleItem({
						schedule_day_id: scheduleId,
						destination_id: dest.id, // Use the actual destination ID
						order_in_day: destIndex + 1, // Set the order based on the index
						estimated_transport_time: dest.avg_transport_time || 60, // Use destination's transport time or default
						estimated_cost: dest.avg_accommodation_cost + dest.avg_food_cost + dest.avg_transport_cost, // Calculate total cost
					});
				});
			});

			message.success('Itinerary saved successfully!');
			resetForm();
			onSuccess();
		} catch (error) {
			message.error('Failed to save itinerary');
		}
	};

	// Reset form and state when closing modal
	const resetForm = () => {
		form.resetFields();
		setCurrentStep(0);
		setSelectedDates(null);
		setItineraryDays([]);
	};

	const handleModalCancel = () => {
		if (selectedDates || itineraryDays.some((day) => day.destinations.length > 0) || form.isFieldsTouched()) {
			Modal.confirm({
				title: 'Discard changes?',
				content: 'All unsaved changes will be lost.',
				onOk() {
					resetForm();
					onCancel();
				},
				onCancel() {},
			});
		} else {
			resetForm();
			onCancel();
		}
	};

	return (
		<Modal title='Create Travel Itinerary' visible={visible} onCancel={handleModalCancel} footer={null} width={1000}>
			<Steps current={currentStep} style={{ marginBottom: 24 }}>
				<Steps.Step title='Select Dates' />
				<Steps.Step title='Plan Activities' />
				<Steps.Step title='Review & Save' />
			</Steps>

			<Card>
				{currentStep === 0 && (
					<div style={{ textAlign: 'center', padding: '40px 0' }}>
						<RangePicker
							onChange={(dates) => handleDateChange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
							style={{ width: 300 }}
						/>
					</div>
				)}

				{currentStep === 1 && (
					<DragDropContext onDragEnd={onDragEnd}>
						<Row gutter={[16, 16]}>
							<Col span={6}>
								<Card title='Available Destinations'>
									<List
										dataSource={destinations}
										renderItem={(item) => (
											<List.Item>
												<Card
													size='small'
													hoverable
													onClick={() => {
														Modal.confirm({
															title: `Add ${item.name} to which day?`,
															content: (
																<Select
																	style={{ width: '100%', marginTop: 16 }}
																	placeholder='Select a day'
																	onChange={(value) => {
																		addDestinationToDay(item, value);
																		Modal.destroyAll();
																	}}
																>
																	{itineraryDays.map((day, index) => (
																		<Select.Option key={index} value={index}>
																			Day {index + 1} - {day.date}
																		</Select.Option>
																	))}
																</Select>
															),
															okText: 'Cancel',
															cancelText: 'Close',
															onOk: () => {},
														});
													}}
												>
													<div>{item.name}</div>
													<div>
														<Tag color='blue'>{item.type}</Tag>
														<Tag color='green'>{item.avg_rating} ★</Tag>
													</div>
												</Card>
											</List.Item>
										)}
									/>
								</Card>
							</Col>
							<Col span={18}>
								<Row gutter={[16, 16]}>
									{itineraryDays.map((day, dayIndex) => (
										<Col span={24} key={day.date}>
											<Card
												title={
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<CalendarOutlined style={{ marginRight: 8 }} />
														Day {dayIndex + 1} - {day.date}
													</div>
												}
											>
												<Droppable droppableId={String(dayIndex)}>
													{(provided) => (
														<div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 100 }}>
															{day.destinations.map((dest, index) => (
																<Draggable key={dest.id} draggableId={`${dest.id}-${dayIndex}`} index={index}>
																	{(provided) => (
																		<div
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}
																		>
																			<Card size='small' style={{ marginBottom: 8 }}>
																				<Row justify='space-between' align='middle'>
																					<Col>{dest.name}</Col>
																					<Col>
																						<Button
																							type='text'
																							danger
																							icon={<DeleteOutlined />}
																							onClick={() => {
																								const newDays = [...itineraryDays];
																								newDays[dayIndex].destinations.splice(index, 1);
																								setItineraryDays(newDays);
																							}}
																						/>
																					</Col>
																				</Row>
																			</Card>
																		</div>
																	)}
																</Draggable>
															))}
															{provided.placeholder}
														</div>
													)}
												</Droppable>
											</Card>
										</Col>
									))}
								</Row>
							</Col>
						</Row>
					</DragDropContext>
				)}

				{currentStep === 2 && (
					<Form form={form} layout='vertical'>
						<Row gutter={24}>
							<Col span={16}>
								<Form.Item name='name' label='Itinerary Name' rules={[{ required: true }]}>
									<Input />
								</Form.Item>
								<Form.Item name='description' label='Description' rules={[{ required: true }]}>
									<Input.TextArea rows={4} />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Card>
									<Statistic title='Total Budget' value={calculateTotalBudget()} prefix='₫' precision={0} />
									<Divider />
									<Statistic title='Total Days' value={itineraryDays.length} suffix='days' />
								</Card>
							</Col>
						</Row>
					</Form>
				)}

				<div style={{ marginTop: 24, textAlign: 'right' }}>
					{currentStep > 0 && (
						<Button style={{ marginRight: 8 }} onClick={() => setCurrentStep((c) => c - 1)}>
							Previous
						</Button>
					)}
					{currentStep < 2 ? (
						<Button type='primary' onClick={() => setCurrentStep((c) => c + 1)}>
							Next
						</Button>
					) : (
						<Button type='primary' onClick={handleSave}>
							Save Itinerary
						</Button>
					)}
				</div>
			</Card>
		</Modal>
	);
};

export default CreateItineraryModal;
