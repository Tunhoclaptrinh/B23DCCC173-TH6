import React from 'react';
import { Card, Col, Rate, Row, Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useModel } from 'umi';


const { Text } = Typography;
const TourList: React.FC<DestinationManagement.Destination> = () => {
const { filteredDestinations } = useModel('dulich.diemden');

  return (
    <Row gutter={[16, 16]}>
      {filteredDestinations.map((tour, index) => (
        <Col xs={24} sm={12} md={8} lg={6} key={index}>
          <Card
            cover={<img alt={tour.name} src={tour.image_url} />}
          >
            <div style={{ marginBottom: 8 }}>
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              <Text strong>{tour.name}</Text>
            </div>
            <Card.Meta
              title={tour.name}
              description={`Giá: ${tour.avg_accommodation_cost.toLocaleString()}₫`}
            />
              <Rate disabled defaultValue={tour.avg_rating} allowHalf style={{ marginTop: 8 }} />
            
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default TourList;
