import { Button, Input, Select, Table, Space, Modal, message, Rate, Tag } from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { ColumnsType } from 'antd/es/table';
import DestinationDetail from './DestinationDetail';
import DestinationForm from './DestinationForm';

const { Option } = Select;
const { confirm } = Modal;

const DestinationManagement: React.FC = () => {
	const { destinations, getDestinationData, addDestination, updatedDestination, deleteDestination } = useModel(
		'DestinationManagement.destination',
	);

	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [currentDestination, setCurrentDestination] = useState<DestinationManagement.Destination | undefined>();

	const [detailVisible, setDetailVisible] = useState<boolean>(false);
	const [selectedDestination, setSelectedDestination] = useState<DestinationManagement.Destination | undefined>();

	useEffect(() => {
		getDestinationData();
	}, []);

	const handleFormSubmit = (values: DestinationManagement.Destination, originalRoomCode?: string) => {
		if (isEdit && originalRoomCode) {
			const success = updatedDestination(values, originalRoomCode);
			if (success) {
				setVisible(false);
				message.success('Cập nhật điểm đến thành công');
			}
		} else {
			const success = addDestination(values);
			if (success) {
				setVisible(false);
				message.success('Thêm điểm đến thành công');
			}
		}
	};

	const handleDelete = (record: DestinationManagement.Destination) => {
		confirm({
			title: 'Bạn có chắc muốn xóa điểm đến này?',
			content: `${record.name} - ${record.location}`,
			okText: 'Có',
			okType: 'danger',
			cancelText: 'Không',
			onOk() {
				deleteDestination(record.id);
				message.success('Xóa điểm đến thành công');
			},
		});
	};

	const stripHtml = (html: string) => {
		const tmp = document.createElement('DIV');
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || '';
	};

	const [searchText, setSearchText] = useState<string>('');
	const [filterType, setFilterType] = useState<string | undefined>();
	const [filterPrice, setFilterPrice] = useState<string | undefined>();
	const [filterRating, setFilterRating] = useState<number | undefined>();

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

	const columns: ColumnsType<DestinationManagement.Destination> = [
		{
			title: 'Tên',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
		},
		{
			title: 'Vị trí',
			dataIndex: 'location',
			key: 'location',
			sorter: (a, b) => a.location.localeCompare(b.location),
		},
		{
			title: 'Loại',
			dataIndex: 'type',
			key: 'type',
			sorter: (a, b) => a.type.localeCompare(b.type),
			render: (type: string) => (
				<Tag color={type === 'Sea' ? 'blue' : type === 'Mountain' ? 'green' : 'orange'}>
					{type === 'Sea' ? 'Biển' : type === 'Mountain' ? 'Núi' : 'Khác'}
				</Tag>
			),
		},
		{
			title: 'Đánh giá',
			dataIndex: 'avg_rating',
			key: 'avg_rating',
			sorter: (a, b) => a.avg_rating - b.avg_rating,
			render: (rating: number) => <Rate disabled defaultValue={rating} allowHalf />,
		},
		{
			title: 'Tổng chi phí',
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
			title: 'Hành động',
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
						Xem
					</Button>
					<Button
						onClick={() => {
							setCurrentDestination(record);
							setIsEdit(true);
							setVisible(true);
						}}
					>
						Sửa
					</Button>
					<Button danger onClick={() => handleDelete(record)}>
						Xóa
					</Button>
				</Space>
			),
		},
	];

	const uniqueTypes = Array.from(new Set(destinations.map((dest) => dest.type))).map((type) => ({
		label: type === 'Sea' ? 'Biển' : type === 'Mountain' ? 'Núi' : 'Khác',
		value: type,
	}));

	return (
		<div style={{ padding: '24px' }}>
			<h1>Quản lý Điểm đến</h1>

			<div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
				<Input
					placeholder='Tìm kiếm điểm đến...'
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					prefix={<SearchOutlined />}
					style={{ width: 300 }}
				/>

				<Select
					placeholder='Lọc theo Loại'
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
					placeholder='Lọc theo Mức giá'
					style={{ width: 200 }}
					allowClear
					value={filterPrice}
					onChange={(value) => setFilterPrice(value)}
				>
					<Option value='budget'>Tiết kiệm (≤ 1M VND)</Option>
					<Option value='moderate'>Trung bình (1M-2M VND)</Option>
					<Option value='luxury'>Cao cấp ({'>'} 2M VND)</Option>
				</Select>

				<Select
					placeholder='Lọc theo Đánh giá'
					style={{ width: 200 }}
					allowClear
					value={filterRating}
					onChange={(value) => setFilterRating(value)}
				>
					<Option value={4}>4+ Sao</Option>
					<Option value={3}>3+ Sao</Option>
					<Option value={2}>2+ Sao</Option>
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
					Thêm Điểm đến
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={filteredData}
				rowKey='id'
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} điểm đến`,
				}}
			/>

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