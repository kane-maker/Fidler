import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigateフックをインポート

function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigateフックを初期化


  useEffect(() => {
    // DynamoDBから履歴を取得
    const fetchHistory = async () => {
      try {
        const user_id = '1';
        const response = await axios.get(`https://6kasisg23f.execute-api.ap-northeast-1.amazonaws.com/dev/test?UserID=${user_id}`);
        setHistoryData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching history data:', error);
        setError('Failed to load history data');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // ホームに戻るボタンのクリックハンドラ
  const handleGoHome = () => {
    navigate('/'); // ホーム画面に戻る
  };

  return (
    <div>
      <h1>履歴</h1>
      {historyData.length > 0 ? (
        <ul>
        <button onClick={handleGoHome} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          ホームに戻る
        </button>
          {historyData.map((item, index) => (
            <li key={index}>
              <h2>{item.name}</h2>
              <p>評価: {item.rating}</p>
              <p>カフェID: {item.place_id}</p>
              {item.photo_urls && item.photo_urls.length > 0 && (
                <div>
                  {item.photo_urls.map((url, idx) => (
                    <img key={idx} src={url} alt={`Cafe photo ${idx + 1}`} style={{ width: '100px', marginRight: '10px' }} />
                  ))}
                </div>
              )}
              {item.reviews && item.reviews.length > 0 && (
                <div>
                  <h3>レビュー:</h3>
                  {item.reviews.map((reviewGroup, idx) => (
                    <div key={idx}>
                      {reviewGroup.map((review, reviewIdx) => (
                        <div key={reviewIdx} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                          <img src={review.profile_photo_url} alt={`${review.author_name}'s profile`} style={{ width: '50px', borderRadius: '50%', marginRight: '10px' }} />
                          <p><strong>{review.author_name}</strong> ({review.rating} stars)</p>
                          <p>{review.text}</p>
                          <p><small>{review.relative_time_description}</small></p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>履歴データがありません。</p>
      )}

    </div>
  );
}

export default History;
