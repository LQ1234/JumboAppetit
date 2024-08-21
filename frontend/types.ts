import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Month: undefined;
  Calendar: undefined;
  Dish: undefined;
  Camera: undefined;
  PhotoScanner: {
    photoUri: string; 
    location: string | null; // TODO not sure about type
    menu: string | null; // TODO not sure about type
  };
  Notification: undefined;
  AllNotifications: undefined;
};

// Define navigation prop types for specific screens
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;
type PhotoScannerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhotoScanner'>;

// Define route prop type for PhotoScanner
type PhotoScannerScreenRouteProp = RouteProp<RootStackParamList, 'PhotoScanner'>;
type DishScreenRouteProp = RouteProp<RootStackParamList, 'Dish'>;

// Combine options
type NavigationProps = HomeScreenNavigationProp | CameraScreenNavigationProp | PhotoScannerScreenNavigationProp;
type RouteProps = PhotoScannerScreenRouteProp | DishScreenRouteProp;

// Define props for screens using the combined navigation type
export type ScreenProps = {
  navigation?: NavigationProps;
  route?: RouteProps 
};