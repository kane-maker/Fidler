import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { TextField, Button, Typography, Card, CardContent, Grid, Dialog, DialogContent } from '@mui/material';
import lottie from 'lottie-web';
import animationData from './components/cafeAnimation.json'; // Lottieアニメーションデータ
import History from './History'; // 履歴画面コンポーネント
import '@aws-amplify/ui-react/styles.css';

function PlaceSearch() {
    const [keyword, setKeyword] = useState('');
    const [placeDetails, setPlaceDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const animationContainerRef = useRef(null); // アニメーション用のコンテナ
    const animationInstanceRef = useRef(null); // アニメーションインスタンス

    // Lottieアニメーションの初期化
    useEffect(() => {
        // アニメーションを初期化
        animationInstanceRef.current = lottie.loadAnimation({
            container: animationContainerRef.current, // アニメーションを描画するDOM要素
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData,
        });

        // クリーンアップ関数でアニメーションを停止して破棄
        return () => {
            animationInstanceRef.current?.destroy();
        };
    }, []); // 空の依存配列で一度だけ実行

    // 検索を行う関数
    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setPlaceDetails(null);

        try {
            const response = await axios.post('https://46hnny0f46.execute-api.ap-northeast-1.amazonaws.com/dev/test', {
                keyword: `カフェ ${keyword}`,
                user_id: '1',
            });

            if (response.data.result) {
                setPlaceDetails(response.data.result);
            } else {
                setError('Place not found');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                setError(`Server error: ${error.response.data.error}`);
            } else {
                setError('An error occurred while fetching place details');
            }
        } finally {
            setLoading(false);
        }
    };

    // 画像クリック時にモーダルを開く関数
    const handleClickOpen = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpen(true);
    };

    // モーダルを閉じる関数
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                カフェ検索
            </Typography>

            {/* Lottieアニメーションの表示 */}
            <div
                ref={animationContainerRef}
                style={{ width: '300px', height: '300px', margin: '0 auto' }}
            />

            <div style={{ marginTop: '20px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            label="キーワードを入力"
                            variant="outlined"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
                            検索
                        </Button>
                    </Grid>
                </Grid>
            </div>

            {error && (
                <Typography variant="body1" color="error" style={{ marginTop: '20px' }}>
                    {error}
                </Typography>
            )}

            {placeDetails && (
                <Card style={{ marginTop: '20px', maxWidth: '600px', margin: '0 auto' }}>
                    <CardContent>
                        <Typography variant="h5">{placeDetails.name}</Typography>
                        <Typography variant="subtitle1">Rating: {placeDetails.rating}</Typography>

                        <Typography variant="h6" gutterBottom>
                            Photos:
                        </Typography>
                        <Grid container spacing={2}>
                            {placeDetails.photo_urls.map((photoUrl, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <img
                                        src={photoUrl}
                                        alt={`Place photo ${index + 1}`}
                                        style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
                                        onClick={() => handleClickOpen(photoUrl)}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                            Reviews:
                        </Typography>
                        <Grid container spacing={2}>
                            {placeDetails.reviews.map((review, index) => (
                                <Grid item xs={12} key={index}>
                                    <Card variant="outlined" style={{ marginBottom: '10px' }}>
                                        <CardContent>
                                            <Typography variant="body1">
                                                <strong>{review.author_name}</strong> ({review.rating} stars)
                                            </Typography>
                                            <Typography variant="body2">{review.text}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* 履歴画面に遷移するリンク */}
            <Button variant="contained" color="secondary" component={Link} to="/history" fullWidth style={{ marginTop: '20px', maxWidth: '600px', margin: '0 auto' }}>
                履歴を見る
            </Button>

            {/* モーダルの設定 */}
            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogContent>
                    <img src={selectedImage} alt="Selected" style={{ width: '100%' }} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

function App() {
    return (
        <div style={{ padding: '20px' }}>
            <Router>
                <nav>
                    <Link to="/">ホーム</Link> | <Link to="/history">履歴</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<PlaceSearch />} />
                    <Route path="/history" element={<History />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
