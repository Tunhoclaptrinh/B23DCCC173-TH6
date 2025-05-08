import { Card, Rate, Select, Input, Row, Col, Space, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { JSXElementConstructor, Key, ReactElement, ReactNodeArray, ReactPortal, useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Meta } = Card;
const { Option } = Select;

const DestinationManagement: React.FC = () => {
	const { destinations, getDestinationData } = useModel('DestinationManagement.destination');

	// Filter states
	const [searchText, setSearchText] = useState<string>('');
	const [filterType, setFilterType] = useState<string | undefined>();
	const [filterPrice, setFilterPrice] = useState<string | undefined>();
	const [filterRating, setFilterRating] = useState<number | undefined>();

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 8; // Number of items per page

	useEffect(() => {
		getDestinationData();
	}, []);

	// Helper function to get price range based on total cost
	const getPriceRange = (total: number) => {
		if (total <= 1000) return 'budget';
		if (total <= 2000) return 'moderate';
		return 'luxury';
	};

	// Filter the destinations
	const filteredDestinations = destinations.filter((dest: DestinationManagement.Destination) => {
		const matchesSearch = searchText ? dest.name.toLowerCase().includes(searchText.toLowerCase()) : true;
		const matchesType = filterType ? dest.type === filterType : true;

		// Calculate total cost
		const totalCost = dest.avg_accommodation_cost + dest.avg_food_cost + dest.avg_transport_cost;
		const destPriceRange = getPriceRange(totalCost);
		const matchesPrice = filterPrice ? destPriceRange === filterPrice : true;

		const matchesRating = filterRating ? dest.avg_rating >= Number(filterRating) : true;

		return matchesSearch && matchesType && matchesPrice && matchesRating;
	});

	// Pagination logic
	const paginatedDestinations = filteredDestinations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const filterSelectOption = (input: string, option?: { label: string; value: string }) => {
		return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
	};

	const uniqueTypes = Array.from(new Set(destinations.map((dest) => dest.type))).map((type) => ({
		label: type.charAt(0).toUpperCase() + type.slice(1),
		value: type,
	}));

	return (
		<div style={{ padding: '24px' }}>
			<h1>Discover Destinations</h1>

			{/* Filters */}
			<Space style={{ marginBottom: 24 }} size='large'>
				<Input
					placeholder='Search destinations'
					prefix={<SearchOutlined />}
					style={{ width: 200 }}
					onChange={(e) => setSearchText(e.target.value)}
				/>

				<Select
					placeholder='Destination Type'
					style={{ width: 150 }}
					allowClear
					showSearch
					optionFilterProp='label'
					filterOption={filterSelectOption}
					onChange={(value) => setFilterType(value)}
					options={uniqueTypes}
				/>

				<Select placeholder='Price Range' style={{ width: 150 }} allowClear onChange={(value) => setFilterPrice(value)}>
					<Option value='budget'>Budget (≤ $1000)</Option>
					<Option value='moderate'>Moderate ($1001-$2000)</Option>
					<Option value='luxury'>Luxury ({'>'} $2000)</Option>
				</Select>

				<Select placeholder='Rating' style={{ width: 150 }} allowClear onChange={(value) => setFilterRating(value)}>
					<Option value={4}>4+ Stars</Option>
					<Option value={3}>3+ Stars</Option>
					<Option value={2}>2+ Stars</Option>
				</Select>
			</Space>

			{/* Destination Cards */}

			<Row gutter={[16, 16]}>
				{paginatedDestinations.map((destination) => (
					<Col xs={24} sm={12} md={8} lg={6} key={destination.id}>
						<Card
							hoverable
							cover={
								<img alt={destination.name} src={destination.image_url} style={{ height: 200, objectFit: 'cover' }} />
							}
						>
							<Meta
								title={destination.name}
								description={
									<>
										<p>{destination.location}</p>
										<Rate disabled defaultValue={destination.avg_rating} />
										<p>
											Price Range:{' '}
											{destination.avg_accommodation_cost + destination.avg_food_cost + destination.avg_transport_cost}
										</p>
										<p>Destination Type: {destination.type}</p>
									</>
								}
							/>
						</Card>
					</Col>
				))}
			</Row>

			{/* Pagination */}
			<div style={{ marginTop: '24px', textAlign: 'center' }}>
				<Pagination
					current={currentPage}
					total={filteredDestinations.length}
					pageSize={pageSize}
					onChange={handlePageChange}
					showSizeChanger={false}
				/>
			</div>
		</div>
	);
};

export default DestinationManagement;
