import {
	Row,
	Col,
	Card,
	Rate,
	Tag,
	Input,
	Select,
	Slider,
	Button,
	Typography,
	Divider,
	Empty,
	Spin,
	message,
	Pagination,
	Tooltip,
} from 'antd';
import { SearchOutlined, ClockCircleOutlined, DollarOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DestinationDetail from './components/DestinationDetail';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { Option } = Select;

const DestinationHomePage: React.FC = () => {
	const { destinations, getDestinationData } = useModel('DestinationManagement.destination');
	const [loading, setLoading] = useState(true);
	const [selectedDestinationForDetail, setSelectedDestinationForDetail] = useState<any | null>(null);
	const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);

	// Filter states
	const [searchText, setSearchText] = useState<string>('');
	const [filterType, setFilterType] = useState<string>('All');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
	const [filterRating, setFilterRating] = useState<number>(0);
	const [sortBy, setSortBy] = useState<string>('rating-desc');

	// Pagination states
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(8);

	useEffect(() => {
		setLoading(true);
		getDestinationData();
		setLoading(false);
	}, []);

	// Format currency
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
	};

	// Calculate total cost
	const getTotalCost = (destination: any) => {
		return destination.avg_accommodation_cost + destination.avg_food_cost + destination.avg_transport_cost;
	};

	// Filter and sort destinations
	const filteredDestinations = destinations
		.filter((dest: any) => {
			const matchesSearch = searchText
				? dest.name.toLowerCase().includes(searchText.toLowerCase()) ||
				  dest.description?.toLowerCase().includes(searchText.toLowerCase())
				: true;
			const matchesType = filterType !== 'All' ? dest.type === filterType : true;
			const totalCost = getTotalCost(dest);
			const matchesPrice = totalCost >= priceRange[0] && totalCost <= priceRange[1];
			const matchesRating = filterRating > 0 ? dest.avg_rating >= filterRating : true;

			return matchesSearch && matchesType && matchesPrice && matchesRating;
		})
		.sort((a: any, b: any) => {
			switch (sortBy) {
				case 'rating-desc':
					return b.avg_rating - a.avg_rating;
				case 'rating-asc':
					return a.avg_rating - b.avg_rating;
				case 'price-desc':
					return getTotalCost(b) - getTotalCost(a);
				case 'price-asc':
					return getTotalCost(a) - getTotalCost(b);
				default:
					return 0;
			}
		});

	// Reset to first page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchText, filterType, priceRange, filterRating, sortBy]);

	// Pagination logic
	const paginatedDestinations = filteredDestinations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePageSizeChange = (current: number, size: number) => {
		setPageSize(size);
		setCurrentPage(1); // Reset to first page when changing page size
	};

	const filterSelectOption = (input: string, option?: { label: string; value: string }) => {
		return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
	};

	const uniqueTypes = Array.from(new Set(destinations.map((dest) => dest.type))).map((type) => ({
		label: type.charAt(0).toUpperCase() + type.slice(1),
		value: type,
	}));

	const handleAddToItinerary = (destination: any) => {
		message.success(`Added ${destination.name} to itinerary`);
	};

	const handleShowDestinationDetail = (destination: any) => {
		setSelectedDestinationForDetail(destination);
		setIsDetailModalVisible(true);
	};

	const handleCloseDestinationDetail = () => {
		setIsDetailModalVisible(false);
		// setSelectedDestinationForDetail(null); // Optionally clear, but DestinationDetail might need it while closing animation
	};

	return (
		<div style={{ padding: '24px' }}>
			<Row gutter={[16, 16]} align='middle' style={{ marginBottom: 24 }}>
				<Col xs={24} md={12}>
					<Title level={2} style={{ margin: 0 }}>
						Discover Destinations
					</Title>
				</Col>
				<Col xs={24} md={12}>
					<Input
						placeholder='Search destinations'
						prefix={<SearchOutlined />}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						allowClear
					/>
				</Col>
			</Row>

			<Card className='filter-card' style={{ marginBottom: 24 }}>
				<Row gutter={[16, 16]} align='middle'>
					<Col xs={24} sm={12} md={6}>
						<Text strong>Destination Type</Text>
						<Select
							style={{ width: '100%', marginTop: 8 }}
							value={filterType}
							onChange={setFilterType}
							showSearch
							placeholder='Search or select type'
							filterOption={filterSelectOption}
							optionFilterProp='label'
						>
							<Option value='All'>All Types</Option>
							{uniqueTypes.map((type) => (
								<Option key={type.value} value={type.value} label={type.label}>
									{type.label}
								</Option>
							))}
						</Select>
					</Col>

					<Col xs={24} sm={12} md={6}>
						<Text strong>Price Range (VND)</Text>
						<Slider
							range
							min={0}
							max={5000000}
							step={100000}
							value={priceRange}
							onChange={setPriceRange}
							tipFormatter={(value) => (value !== undefined ? formatCurrency(value) : '')}
							style={{ marginTop: 8 }}
						/>
					</Col>

					<Col xs={24} sm={12} md={6}>
						<Text strong>Min Rating</Text>
						<div style={{ marginTop: 8 }}>
							<Rate allowHalf value={filterRating} onChange={setFilterRating} />
						</div>
					</Col>

					<Col xs={24} sm={12} md={6}>
						<Text strong>Sort By</Text>
						<Select style={{ width: '100%', marginTop: 8 }} value={sortBy} onChange={setSortBy}>
							<Option value='rating-desc'>Highest Rating</Option>
							<Option value='rating-asc'>Lowest Rating</Option>
							<Option value='price-desc'>Highest Price</Option>
							<Option value='price-asc'>Lowest Price</Option>
						</Select>
					</Col>
				</Row>
			</Card>

			{loading ? (
				<div style={{ textAlign: 'center', padding: '50px 0' }}>
					<Spin size='large' />
				</div>
			) : filteredDestinations.length === 0 ? (
				<Empty description='No destinations found matching your criteria' style={{ margin: '50px 0' }} />
			) : (
				<Row gutter={[16, 16]}>
					{paginatedDestinations.map((destination: any) => (
						<Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
							<Card
								hoverable
								cover={
									<img alt={destination.name} src={destination.image_url} style={{ height: 200, objectFit: 'cover' }} />
								}
							>
								<Meta
									title={
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<span>{destination.name}</span>
											<Tag
												color={
													destination.type === 'Sea' ? 'blue' : destination.type === 'Mountain' ? 'green' : 'orange'
												}
											>
												{destination.type}
											</Tag>
										</div>
									}
									description={
										<>
											<Paragraph ellipsis={{ rows: 2 }}>{destination.description}</Paragraph>
											<div style={{ marginTop: 16 }}>
												<Rate disabled defaultValue={destination.avg_rating} allowHalf />
												<span style={{ marginLeft: 8 }}>{destination.avg_rating}</span>
											</div>
											<Divider style={{ margin: '12px 0' }} />
											<Row gutter={8}>
												<Col span={12}>
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<ClockCircleOutlined style={{ marginRight: 4 }} />
														<Text type='secondary'>{destination.estimated_visit_duration} days</Text>
													</div>
												</Col>
												<Col span={12}>
													<div style={{ display: 'flex', alignItems: 'center' }}>
														<DollarOutlined style={{ marginRight: 4 }} />
														<Text type='secondary'>{getTotalCost(destination) / 1000000}M</Text>
													</div>
												</Col>
											</Row>
										</>
									}
								/>

							{/* xem chi tiết địa điểms */}
								<div
									style={{
										position: 'absolute',
										top: '8px',
										left: '8px',
										backgroundColor: 'rgba(0, 0, 0, 0.6)',
										padding: '7px 3px 7px 7px',
										borderRadius: '8px',
										color: '#fff',
										fontSize: '12px',
										lineHeight: '1.5',
									}}
									onClick={() => handleShowDestinationDetail(destination)} 
								>
									<Tooltip title="Xem chi tiết"> 
									<InfoCircleOutlined style={{ marginRight: '4px' }} />
									</Tooltip>
								</div>
							</Card>
						</Col>
					))}
				</Row>
			)}

{/* lấy lại modal xem chi tiết địa điểm cho mỗi card */}
			{selectedDestinationForDetail && (
				<DestinationDetail
					destination={selectedDestinationForDetail}
					visible={isDetailModalVisible}
					setVisible={setIsDetailModalVisible} 
				/>
			)}

			{/* Pagination */}
			<div style={{ marginTop: '24px', textAlign: 'center' }}>
				<Pagination
					current={currentPage}
					total={filteredDestinations.length}
					pageSize={pageSize}
					onChange={handlePageChange}
					onShowSizeChange={handlePageSizeChange}
					showSizeChanger={true}
					showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
					pageSizeOptions={['8', '16', '24', '32']}
				/>
			</div>
		</div>
	);
};

export default DestinationHomePage;
