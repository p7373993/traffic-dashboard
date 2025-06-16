import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Leaflet 마커 아이콘 설정
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const IntersectionMap = () => {
    const [intersections, setIntersections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        const fetchIntersections = async () => {
            console.log('교차로 데이터 요청 시작');
            try {
                const response = await axios.get('http://localhost:8000/api/intersections/');
                console.log('API 응답 받음:', response);
                console.log('응답 데이터:', response.data);
                
                if (Array.isArray(response.data)) {
                    console.log('교차로 데이터 배열 확인됨, 길이:', response.data.length);
                    setIntersections(response.data);
                } else {
                    console.error('응답 데이터가 배열이 아님:', response.data);
                    setError('데이터 형식이 올바르지 않습니다.');
                }
            } catch (err) {
                console.error('API 요청 중 에러 발생:', err);
                console.error('에러 상세:', {
                    message: err.message,
                    response: err.response,
                    request: err.request
                });
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchIntersections();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;
    if (!intersections.length) return <div>교차로 데이터가 없습니다.</div>;

    // 리마 시의 중심 좌표
    const center = [-12.0464, -77.0428];

    return (
        <div style={{ height: '600px', width: '100%', border: '1px solid #ccc' }}>
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                whenReady={() => {
                    console.log('Map is ready');
                    setMapReady(true);
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mapReady && intersections.map((intersection) => {
                    console.log('마커 생성:', intersection);
                    return (
                        <Marker
                            key={intersection.id}
                            position={[intersection.latitude, intersection.longitude]}
                        >
                            <Popup>
                                <div>
                                    <h3>{intersection.name}</h3>
                                    <h4>교통량:</h4>
                                    <ul>
                                        {intersection.traffic_volumes.map((volume, index) => (
                                            <li key={index}>
                                                {volume.direction}: {volume.total_volume}대
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default IntersectionMap; 