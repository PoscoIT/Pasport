import Background_Green from '../../components/Background_Green';
import {
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import ImageViewing from "react-native-image-viewing";
// import PhotoView from '@merryjs/photo-viewer';

const SafetyImage = () => {
  const imageSize = Dimensions.get('window').width *2/3;
  const width = Dimensions.get("window").width
  const imageStyle = {
    width: width,
    height: imageSize,
    padding: 4,
    marginVertical: 4,
    flexDirection: 'row',
    flex: 1,
  };

  const route = useRoute();
  const [visible, setVisible] = useState(false);
  const [initial, setInitial] = useState(0);
  const liMulti = []

  const [data, setData] = useState([]);
  const [imageList,setImageList] = useState([])

  const getData = async () => {

    const {insertDate, summary, summaryColor, titleColor, uriList} =
      await route.params.data
    let uriList2 = await uriList?.split(',');
    console.warn(uriList2)

    uriList2?.map((item, index2) => {
      liMulti.push({    
      
          uri: item,
      
      });
    });
    setData(liMulti)
 
  


  };
  useEffect(() => {
    getData();
  }, []);

  const Separator = () => <View style={styles.separator} />;


  return (
    <Background_Green>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageViewing
  images={data}
  imageIndex={initial}
  visible={visible}
  onRequestClose={() => setVisible(false)}
  onImageIndexChange={index => setInitial(index)}
/>
        {/* <PhotoView
          visible={visible}
          data={data}
          hideStatusBar={false}
          hideCloseButton={false}
          hideShareButton={false}
          initial={initial}
          onDismiss={() => {
            setVisible(false);
          }}
          onChange={data => setInitial(data.index)}
        /> */}
        <View >
          <View
            style={{
              justifyContent: 'center',
              flex:1

            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize:16,
                fontWeight:"700"

              }}>
              {route.params.data.summary}
            </Text>
          </View>


          {route.params.data.uriList?.split(',').map((item, index) => (
            <TouchableOpacity
              style={{paddingVertical:10,width:width}}
              key={index}
              onPress={() => {
                setVisible(true);
                setInitial(index);
              }}>
              <Image resizeMode={"contain"} style={imageStyle} source={{uri: item}} />
              <Separator />

            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Background_Green>
  );
};
const styles = StyleSheet.create({
  photoContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  separator: {
    borderBottomColor: '#fff',
    borderWidth: 1,
    marginTop:5,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
export default SafetyImage;
