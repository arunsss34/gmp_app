import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button, TextInput as PaperInput, Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { colors } from '../../config/config';
import Loader from '../../loader/Loader';
import Dropdown from '../../dropdown/Dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFromAPI } from '../../../apicall/apicall';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import WeftIssueList from '../weftissue/WeftIssueList';


const BeamKnotting = () => {
  const navigation = useNavigation();
  const qrData = useSelector(state => state.QRData.data);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [docno] = useState('AutoNumber');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedItemNoDet, setSelectedItemDet] = useState('');
  const [getItemDescriptionDp, setItemDescriptionDp] = useState([]);
  const [getItemDescription, setItemDescription] = useState('');
  const [getProductionLocationDp, setProductionLocationDp] = useState([]);
  const [getProductionLocation, setProductionLocation] = useState([]);
  const [getWorkOrderNoDp, setWorkOrderNoDp] = useState([]);
  const [getWorkOrderNo, setWorkOrderNo] = useState('');
  const [getLoomNoDp, setLoomNoDp] = useState([]);
  const [getLoomNo, setLoomNo] = useState([]);
  const [isCameraVisible, setCameraVisible] = useState(false);
 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ color: colors.textLight, fontWeight: 'bold', fontSize: 16 }}>Weft Issue</Text>
      ),
      headerStyle: { backgroundColor: colors.header },
    });
  }, [navigation]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [response, response1] = await Promise.all([
        getFromAPI('/get_work_order_no'),
        getFromAPI('/get_production_location'),
      ]);
      setWorkOrderNoDp(response.WorkOrderNo);
      setProductionLocationDp(response1.ProductionLocation);
    } catch (error) {
      Alert.alert('Error', 'Failed to load filter data.');
      console.error('Error fetching filter data:', error);
    } finally {
      setLoading(false);  
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setDate(date.toISOString().split('T')[0]); 
      setSelectedDate(date); 
    }
  };

  const handleItemChange = (selectedItem) => {
    setItemDescription(selectedItem);
    const selectedData = getItemDescriptionDp.find(item => item.value === selectedItem);
    setSelectedItemDet(selectedData);
  };

  const handleWorkOrderNoChange = async (selectedItem) => {
    setWorkOrderNo(selectedItem);
    const selectedData = getWorkOrderNoDp.find(item => item.value === selectedItem);
    const data = { WorkOrderID: selectedData.UID, LocationID: 1006297 }; 
    const encodedFilterData = encodeURIComponent(JSON.stringify(data));
    const data1 = { WorkOrderID: selectedData.UID }; 
    const encodedFilterData1 = encodeURIComponent(JSON.stringify(data1));
    const [response, response1] = await Promise.all([
      getFromAPI('/get_wi_item_description?data=' + encodedFilterData),
    getFromAPI('/get_loom_no?data=' + encodedFilterData1),
    ]);
    setItemDescriptionDp(response.ItemDescription);
    setLoomNoDp(response1.LoomNo);
  };

  const handleProductionLocation = (value) => {
    setProductionLocation(value);
    setErrors((prevErrors) => ({ ...prevErrors, ProductionLocation: '' }));
  };

  const handleLoomNoChange = (selectedItem)=>{
    setLoomNo(selectedItem)
  }

  const navigateToCamera = () => {
    navigation.navigate('Camera');
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.row}>
          <PaperInput
            label="Document No"
            value={docno}
            style={[styles.input, { fontSize: 14 }]}
            error={!!errors.docno}
            mode="outlined"
            theme={{
              colors: {
                primary: colors.data,
                error: colors.error,
                outline: colors.data,
              },
              roundness: 4,
            }}
          />
          <PaperInput
            label="Date"
            value={date}
            style={[styles.input, { fontSize: 14 }]}
            error={!!errors.date}
            mode="outlined"
            theme={{
              colors: {
                primary: colors.data,
                error: colors.error,
                outline: colors.data,
              },
              roundness: 4,
            }}
            onFocus={() => setShowDatePicker(true)}
          />
        </View>

        <View style={styles.dp}>
          <Dropdown
            data={getWorkOrderNoDp}
            setSelectdp={handleWorkOrderNoChange}
            label="WorkOrder No"
            Selectdp={getWorkOrderNo}
          />
        </View>

        <View style={styles.dp}>
          <Dropdown
            data={getItemDescriptionDp}
            setSelectdp={handleItemChange}
            label="Item Description"
            Selectdp={getItemDescription}
          />
        </View>

        <View style={styles.dp}>
          <Dropdown
            data={getLoomNoDp}
            setSelectdp={handleLoomNoChange}
            label="Loom No"
            Selectdp={getLoomNo}
          />
        </View>


        <View style={styles.dp}>
          <Dropdown
            data={getProductionLocationDp}
            setSelectdp={handleProductionLocation}
            label="Production Location"
            Selectdp={getProductionLocation}
          />
          {errors.ProductionLocation && <Text style={styles.errorText}>{errors.ProductionLocation}</Text>}
        </View>

        <View style={styles.row}>
          <PaperInput
            label="QR Data"
            value={qrData}
            style={[styles.input, { fontSize: 14 }]}
            mode="outlined"
            theme={{
              colors: {
                primary: colors.data,
                error: colors.error,
                outline: colors.data,
              },
              roundness: 4,
            }}
          />
          <View style={{ padding:0, marginTop:4
          }}>
           <Icon onPress={navigateToCamera} name="qr-code-outline" size={55} color={colors.header}/>
          </View>
        </View>

        <View>
           {/* <WeftIssueList/> */}
        </View>

        
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <Loader visible={loading} />
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    backgroundColor: colors.background,
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'red', // Optional background color
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginRight: 5,
    backgroundColor: colors.textLight,
  },
  errorText: {
    color: colors.error,
    marginBottom: 8,
    fontSize: 10,
  },
  dp: {
    marginBottom: 20,
  },
});

export default BeamKnotting;
