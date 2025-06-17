import React, { useEffect, useState } from 'react';
import { trafficDataApi } from '../api/trafficData';

const TrafficTest = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            console.log('API 호출 시작...');
            const response = await trafficDataApi.getIntersectionTrafficData(
                2717,  // 교차로 ID
                "2024-12-25T10:00:00",  // 시작 시간
                "2025-01-20T11:00:00"   // 종료 시간
            );
            console.log('API 응답:', response);
            setData(response);
        } catch (err) {
            console.error('상세 에러:', err);
            if (err instanceof Error) {
                setError(`에러 발생: ${err.message}`);
            } else if (typeof err === 'object' && err !== null) {
                setError(`에러 발생: ${JSON.stringify(err)}`);
            } else {
                setError('알 수 없는 에러가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div style={{ padding: '20px' }}>
            <h3>데이터 로딩 중...</h3>
        </div>
    );
    
    if (error) return (
        <div style={{ padding: '20px', color: 'red' }}>
            <h3>에러 발생</h3>
            <p>{error}</p>
            <button onClick={fetchData}>다시 시도</button>
        </div>
    );
    
    if (!data) return (
        <div style={{ padding: '20px' }}>
            <h3>데이터가 없습니다.</h3>
            <button onClick={fetchData}>데이터 가져오기</button>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <h2>교통 데이터 테스트</h2>
            <button onClick={fetchData} style={{ marginBottom: '20px' }}>새로고침</button>
            <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '20px', 
                borderRadius: '5px',
                overflow: 'auto'
            }}>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
};

export default TrafficTest; 