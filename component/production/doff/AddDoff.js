import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, FlatList  } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TextInput as PaperInput, Button, Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { colors } from '../../config/config';
import Loader from '../../loader/Loader';
import Dropdown from '../../dropdown/Dropdown';
import BeamDetails from './BeamDetails';
import WeftDetails from './WeftDetails';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFromAPI } from '../../../apicall/apicall';
import { setWarpDetails } from './warpSlice'; 
import { useDispatch } from 'react-redux';
import { resetTableData } from './LMListSlice'; 

const AddDoff = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [docno, setdocno] = useState('AutoNumber');
  const [date, setdate] = useState(new Date().toISOString().split('T')[0]);
  const [getLoomNo, setLoomNo] = useState('');
  const [getLoomNoDp, setLoomNoDp] = useState([]);
  const [getRollType, setRollType] = useState('');
  const [getRollTypeDp, setRollTypeDp] = useState([]);
  const [getRollNo, setRollNo] = useState('');
  const [weightPerMtr, setweightPerMtr] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [getBeamDetails, setBeamDetails] = useState([]);
  const [getWeftDetails, setWeftDetails] = useState([]);
  const [selectedLoomNoDet, setSelectedLoomDet] = useState('');
  const [doffMeter, setDoffMeter] = useState('');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ color: colors.textLight, fontWeight: 'bold', fontSize: 16 }}>Doff Info</Text>
      ),
      headerStyle: { backgroundColor: colors.header },
    });
  }, [navigation]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [response, response1] = await Promise.all([
        getFromAPI('/loom_no_dropdown'),
        getFromAPI('/rolltype_dropdown') 
      ]);
      setLoomNoDp(response.document_info); 
      setRollTypeDp(response1.roll_type);          
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
      setdate(date.toISOString().split('T')[0]); 
      setSelectedDate(date); 
    }
  };

  const handleLoomNoChange = async (selectedLoom) => {
    setErrors((prevErrors) => ({ ...prevErrors, loomNo: '' }));
    setLoomNo(selectedLoom);
    const selectedData = getLoomNoDp.find(item => item.value === selectedLoom);
    setSelectedLoomDet(selectedData)
    const data = { UID: selectedData.UID, Description: selectedData.Description }
    const encodedFilterData = encodeURIComponent(JSON.stringify(data));
    const response = await getFromAPI('/get_beam_weft_details?data=' + encodedFilterData);
    if (selectedData) {
      setweightPerMtr(response.WeightPerMeter.toString());
      setBeamDetails(response.beam_details);
      setWeftDetails(response.weft_details);
    } else {
      setRollNo('');
      setBeamDetails([]);
      setWeftDetails([]);
      setweightPerMtr('');
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    dispatch(setWarpDetails([]));
    dispatch(resetTableData()); 
    if (!docno) newErrors.docno = 'Document No is required';
    if (!date) newErrors.date = 'Date is required';
    if (!getLoomNo) newErrors.loomNo = 'Loom No is required';
    if (!getRollNo) newErrors.rollNo = 'Roll No is required';
    if (!getRollType) newErrors.rollType = 'Roll Type is required';
    if (!weightPerMtr) newErrors.weightPerMtr1 = 'Weight Per Meter is required';
    if (!doffMeter) newErrors.doffMeter = 'Doff Meter is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const doffinfo = {docno,date,loom_detail: selectedLoomNoDet, BeamDetails:getBeamDetails,
        WeftDetails: getWeftDetails, RollType: getRollType, weightPerMtr: weightPerMtr,RollNo:getRollNo,
        DoffMeter: doffMeter
      }
      const selectedData = getRollTypeDp.find(item => item.value === getRollType);
      if (selectedData){
        const roll_type = selectedData.Description
        if (roll_type == 'Beam Knotting'){
          navigation.navigate('BeamKnotting', {doffinfo});
        } 
        else if (roll_type == 'Single Beam Knotting'){
          navigation.navigate('SingleBeamKnotting', {doffinfo}); 
        }
        else if (roll_type == 'Last Roll SortChange'){
          navigation.navigate('LastRollSortChange', {doffinfo}); 
        }
        else if (roll_type == 'Sort Change & Beam Change'){
          navigation.navigate('ScBc', {doffinfo}); 
        }
    }        
    } 
  };

  const handleRollTypeChange = (value) => {
    setRollType(value);
    setErrors((prevErrors) => ({ ...prevErrors, rollType: '' }));
  };

  return (
    <PaperProvider>
      <FlatList 
       ListHeaderComponent={
        <View style={styles.scrollContainer}>
        <View style={styles.row}>
          <View>
            
          </View>
          <PaperInput
            label="Document No"
            value={docno}
            style={[styles.input, { fontSize: 14 }]}
            // onChangeText={setdocno}
            mode="outlined"
            theme={{
              colors: {
                primary: colors.data,
                error: colors.error,
                outline: colors.data,
                disabled: 'red',
              },
              roundness: 4,
            }}
          />
          {errors.docno ? <Text style={styles.errorText}>{errors.docno}</Text> : null}

          <PaperInput
            label="Date"
            value={date}
            style={[styles.input, { fontSize: 14 }]}
            // onChangeText={() => setShowDatePicker(true)}
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
          {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}

        </View>
        <View style={styles.dp}>
        <Dropdown
            data={getLoomNoDp}
            setSelectdp={handleLoomNoChange}
            label="Loom No"
            Selectdp={getLoomNo}
          /> 
        {errors.loomNo ? <Text style={styles.errorText}>{errors.loomNo}</Text> : null}
        </View>

        <View style={styles.dp}>
          <Dropdown
              data={getRollTypeDp}
              setSelectdp={handleRollTypeChange}
              label="Roll Type"
              Selectdp={getRollType}
            />
        {errors.rollType ? <Text style={styles.errorText}>{errors.rollType}</Text> : null}
        </View>

        <View style={styles.row}>
          <PaperInput
            label="Roll No"
            value={getRollNo}
            style={[styles.input, { fontSize: 14 }]}
            onChangeText={(text) => {
              setRollNo(text);
              setErrors((prevErrors) => ({ ...prevErrors, rollNo: '' }));
            }}       
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
        </View>
        {errors.rollNo ? <Text style={styles.errorText}>{errors.rollNo}</Text> : null}
          
       <View style={styles.row}>
          <PaperInput
            label="Doff"
            value={doffMeter}
            style={[styles.input, { fontSize: 14 }]}
            onChangeText={(text) => {
              setDoffMeter(text);
              setErrors((prevErrors) => ({ ...prevErrors, doffMeter: '' }));
            }}
            mode="outlined"
            keyboardType="numeric"
            theme={{
              colors: {
                primary: colors.data,
                error: colors.error,
                outline: colors.data,
              },
              roundness: 4,
            }}
          />
        </View>
        {errors.doffMeter ? <Text style={styles.errorText}>{errors.doffMeter}</Text> : null}


        <View style={styles.row}>
          <PaperInput
            label="Weight Per Meter"
            value={weightPerMtr}
            style={[styles.input, { fontSize: 14 }]}
            onChangeText={(text) => {
              setweightPerMtr(text);
              setErrors((prevErrors) => ({ ...prevErrors, weightPerMtr1: '' }));
            }} 
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
      </View>
      {/* {errors.weightPerMtr1 ? <Text style={styles.errorText}>{errors.weightPerMtr1}</Text> : null} */}

        <View style={styles.row}>
          <BeamDetails getBeamDetails={getBeamDetails} />
        </View>
        <View style={styles.row}>
          <WeftDetails getWeftDetails={getWeftDetails} />
        </View>
        <Button 
          icon="content-save" 
          mode="contained" 
          style={{ backgroundColor: colors.button, marginBottom:20, borderRadius:10 }} 
          disabled={loading}
          onPress={handleSubmit}
        >
          Continue
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <Loader visible={loading} />
      </View>
       }
      />
      
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    backgroundColor: colors.background,
    marginTop:10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginRight: 5,
    backgroundColor : colors.textLight
  },
  errorText: {
    color: colors.error,
    marginBottom: 8,
    fontSize:10
  },
  dp:{
    marginBottom:20
  }
});

export default AddDoff;
