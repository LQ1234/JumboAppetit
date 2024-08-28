import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthProvider } from './app/contexts/AuthContext';
import { AppProvider } from './app/contexts/AppContext';

import LoginPage from './app/pages/LoginPage';
import FeedPage from './app/pages/FeedPage';
import MenuPage from './app/pages/MenuPage';
import CameraPage from './app/pages/CameraPage';
import VisionPage from './app/pages/VisionPage';
import PostPage from './app/pages/PostPage';

function App() {
  const [currentPage, setCurrentPage] = React.useState('login');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'feed':
        return <FeedPage setCurrentPage={setCurrentPage} />;
      case 'menu':
        return <MenuPage setCurrentPage={setCurrentPage} />;
      case 'camera':
        return <CameraPage setCurrentPage={setCurrentPage} />;
      case 'vision':
        return <VisionPage setCurrentPage={setCurrentPage} />;
      case 'post':
        return <PostPage setCurrentPage={setCurrentPage} />;
      default:
        return <LoginPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <AppProvider>
        <View style={styles.container}>
          {renderPage()}
        </View>
      </AppProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
