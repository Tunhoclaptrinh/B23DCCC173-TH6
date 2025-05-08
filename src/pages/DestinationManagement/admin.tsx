import { Button, Input, Select, Table, Space, Modal, message, Rate, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import DestinationDetail from './components/DestinationDetail';
import DestinationForm from './components/DestinationForm';

const { Option } = Select;
const { confirm } = Modal;

const DestinationManagement: React.FC = () => {
	const { destinations, getDestinationData, addDestination, updatedDestination, deleteDestination } = useModel(
		'DestinationManagement.destination',
	);

	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [currentDestination, setCurrentDestination] = useState<DestinationManagement.Destination | undefined>();

	// Detail view state
	// const [detailVisible, setDetailVisible] = useState<boolean>(false);
	// const [detailClassroom, setDetailClassroom] = useState<DestinationManagement.Destination | undefined>();

	// Filter states
	const [searchText, setSearchText] = useState<string>('');
	const [filterType, setFilterType] = useState<string | undefined>();
	const [filterPrice, setFilterPrice] = useState<string | undefined>();
	const [filterRating, setFilterRating] = useState<number | undefined>();

	//Add these states in your component
	const [detailVisible, setDetailVisible] = useState<boolean>(false);
	const [selectedDestination, setSelectedDestination] = useState<DestinationManagement.Destination | undefined>();

	// Load data on component mount
	useEffect(() => {
		getDestinationData();
	}, []);

	// Handle form submission (for both add and edit)
	const handleFormSubmit = (values: DestinationManagement.Destination, originalRoomCode?: string) => {
		if (isEdit && originalRoomCode) {
			const success = updatedDestination(values, originalRoomCode);
			if (success) {
				setVisible(false);
			}
		} else {
			const success = addDestination(values);
			if (success) {
				setVisible(false);
			}
		}
	};

	// Handle opening detail view
	// const handleViewDetails = (record: DestinationManagement.Destination) => {
	// 	setDetailClassroom(record);
	// 	setDetailVisible(true);
	// };

	// Handle delete with confirmation
	const handleDelete = (record: DestinationManagement.Destination) => {
		confirm({
			title: 'Are you sure you want to delete this destination?',
			content: `${record.name} - ${record.location}`,
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteDestination(record.id);
			},
		});
	};

	// Helper function to strip HTML tags for text search
	const stripHtml = (html: string) => {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	};

	// Filter the data based on search and filters
	const filteredData = destinations.filter((destination) => {
		const matchesSearch = searchText
			? destination.name.toLowerCase().includes(searchText.toLowerCase()) ||
			  destination.location.toLowerCase().includes(searchText.toLowerCase()) ||
			  stripHtml(destination.description).toLowerCase().includes(searchText.toLowerCase())
			: true;

		const matchesType = filterType ? destination.type === filterType : true;
		const matchesRating = filterRating ? destination.avg_rating >= filterRating : true;
		const totalCost = destination.avg_accommodation_cost + destination.avg_food_cost + destination.avg_transport_cost;
		const matchesPrice = filterPrice
			? (filterPrice === 'budget' && totalCost <= 1000000) ||
			  (filterPrice === 'moderate' && totalCost > 1000000 && totalCost <= 2000000) ||
			  (filterPrice === 'luxury' && totalCost > 2000000)
			: true;

		return matchesSearch && matchesType && matchesRating && matchesPrice;
	});

	// Table columns definition
	const columns: ColumnsType<DestinationManagement.Destination> = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Location',
			dataIndex: 'location',
			key: 'location',
			sorter: (a, b) => a.location.localeCompare(b.location),
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			sorter: (a, b) => a.type.localeCompare(b.type),
			render: (type: string) => (
				<Tag color={type === 'Sea' ? 'blue' : type === 'Mountain' ? 'green' : 'orange'}>{type}</Tag>
			),
		},
		{
			title: 'Rating',
			dataIndex: 'avg_rating',
			key: 'avg_rating',
			sorter: (a, b) => a.avg_rating - b.avg_rating,
			render: (rating: number) => <Rate disabled defaultValue={rating} allowHalf />,
		},
		{
			title: 'Total Cost',
			key: 'total_cost',
			sorter: (a, b) => {
				const totalA = a.avg_accommodation_cost + a.avg_food_cost + a.avg_transport_cost;
				const totalB = b.avg_accommodation_cost + b.avg_food_cost + b.avg_transport_cost;
				return totalA - totalB;
			},
			render: (_, record) => {
				const total = record.avg_accommodation_cost + record.avg_food_cost + record.avg_transport_cost;
				return `${(total / 1000000).toFixed(1)}M VND`;
			},
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<Space size='middle'>
					<Button
						icon={<EyeOutlined />}
						onClick={() => {
							setSelectedDestination(record);
							setDetailVisible(true);
						}}
					>
						View
					</Button>
					<Button
						onClick={() => {
							setCurrentDestination(record);
							setIsEdit(true);
							setVisible(true);
						}}
					>
						Edit
					</Button>
					<Button danger onClick={() => handleDelete(record)}>
						Delete
					</Button>
				</Space>
			),
		},
	];

	const uniqueTypes = Array.from(new Set(destinations.map((dest) => dest.type))).map((type) => ({
		label: type.charAt(0).toUpperCase() + type.slice(1),
		value: type,
	}));

	return (
		<div style={{ padding: '24px' }}>
			<h1>Destination Management</h1>

			{/* Search and filters */}
			<div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
				<Input
					placeholder='Search destinations...'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					prefix={<SearchOutlined />}
					style={{ width: 300 }}
				/>

				<Select
					placeholder='Filter by Type'
					style={{ width: 200 }}
					allowClear
					value={filterType}
					onChange={(value) => setFilterType(value)}
				>
					{uniqueTypes.map((type) => (
						<Option key={type.value} value={type.value}>
							{type.label}
						</Option>
					))}
				</Select>

				<Select
					placeholder='Filter by Price Range'
					style={{ width: 200 }}
					allowClear
					value={filterPrice}
					onChange={(value) => setFilterPrice(value)}
				>
					<Option value='budget'>Budget (≤ 1M VND)</Option>
					<Option value='moderate'>Moderate (1M-2M VND)</Option>
					<Option value='luxury'>Luxury ({'>'} 2M VND)</Option>
				</Select>

				<Select
					placeholder='Filter by Rating'
					style={{ width: 200 }}
					allowClear
					value={filterRating}
					onChange={(value) => setFilterRating(value)}
				>
					<Option value={4}>4+ Stars</Option>
					<Option value={3}>3+ Stars</Option>
					<Option value={2}>2+ Stars</Option>
				</Select>

				<Button
					type='primary'
					icon={<PlusOutlined />}
					onClick={() => {
						setIsEdit(false);
						setCurrentDestination(undefined);
						setVisible(true);
					}}
				>
					Add Destination
				</Button>
			</div>

			{/* Destination Table */}
			<Table
				columns={columns}
				dataSource={filteredData}
				rowKey='id'
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} destinations`,
				}}
			/>

			{/* Destination Form Modal */}
			<DestinationForm
				visible={visible}
				setVisible={setVisible}
				isEdit={isEdit}
				destination={currentDestination}
				onSubmit={handleFormSubmit}
			/>

			<DestinationDetail visible={detailVisible} setVisible={setDetailVisible} destination={selectedDestination} />
		</div>
	);
};

export default DestinationManagement;
