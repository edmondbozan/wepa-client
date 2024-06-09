import { Dimensions, PixelRatio } from 'react-native';
const { width, height } = Dimensions.get('window');

// Default guideline sizes are based on iPhone SE
const guidelineBaseWidth = 320;
const guidelineBaseHeight = 568;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const normalize = (size: number) => PixelRatio.roundToNearestPixel(moderateScale(size));

export default normalize;
