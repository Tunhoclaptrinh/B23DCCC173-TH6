import { Modal, Descriptions, Image, Rate, Tag } from 'antd';
import { formatCurrency } from '@/services/DestinationManagement/destination';

interface DestinationDetailProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	destination?: DestinationManagement.Destination;
}

const DestinationDetail: React.FC<DestinationDetailProps> = ({ visible, setVisible, destination }) => {
	if (!destination) return null;

	return (
		<Modal title='Destination Details' visible={visible} onCancel={() => setVisible(false)} footer={null} width={800}>
			<Image
				src={destination.image_url}
				alt={destination.name}
				style={{ width: '100%', maxHeight: 400, objectFit: 'cover', marginBottom: 24 }}
			/>

			<Descriptions bordered column={2}>
				<Descriptions.Item label='Name' span={2}>
					{destination.name}
				</Descriptions.Item>

				<Descriptions.Item label='Location' span={2}>
					{destination.location}
				</Descriptions.Item>

				<Descriptions.Item label='Type'>
					<Tag color={destination.type === 'Sea' ? 'blue' : destination.type === 'Mountain' ? 'green' : 'orange'}>
						{destination.type}
					</Tag>
				</Descriptions.Item>

				<Descriptions.Item label='Rating'>
					<Rate disabled defaultValue={destination.avg_rating} allowHalf />
					<span style={{ marginLeft: 8 }}>{destination.avg_rating}</span>
				</Descriptions.Item>

				<Descriptions.Item label='Description' span={2}>
					{destination.description}
				</Descriptions.Item>

				<Descriptions.Item label='Accommodation Cost'>
					{formatCurrency(destination.avg_accommodation_cost)}
				</Descriptions.Item>

				<Descriptions.Item label='Food Cost'>{formatCurrency(destination.avg_food_cost)}</Descriptions.Item>

				<Descriptions.Item label='Transport Cost'>{formatCurrency(destination.avg_transport_cost)}</Descriptions.Item>

				<Descriptions.Item label='Total Cost'>
					{formatCurrency(
						destination.avg_accommodation_cost + destination.avg_food_cost + destination.avg_transport_cost,
					)}
				</Descriptions.Item>

				<Descriptions.Item label='Visit Duration' span={2}>
					{destination.estimated_visit_duration} hours
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default DestinationDetail;
