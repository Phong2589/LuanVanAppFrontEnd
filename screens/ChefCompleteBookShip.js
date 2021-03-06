import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import CurrencyFormat from 'react-currency-format';
import RenderItemOrder from '../components/RenderItemOrder';
import RenderStaff from '../components/RenderStaff';
import styles from '../components/styles';
import LoadingComponent from '../components/Loading';
import { useIsFocused } from '@react-navigation/native'
import RenderInfoCustomer from '../components/RenderInfoCustomer';

function ChefCompleteBookShip(props) {

  const { navigation, route } = props;
  const [bookShip, setBookShip] = useState(null)
  const [loading, setLoading] = useState(true)
  const isFocused = useIsFocused()


  const getBookShip = () => {
    axios({
      method: 'get',
      url: '/shipper/getBookShip',
      params: {
        orderId: route.params.orderId
      }
    })
      .then(response => {
        setBookShip(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
  useEffect(() => {
    getBookShip()
  }, [isFocused])

  if (loading) {
    return (
      <LoadingComponent />
    )
  }
  else {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>{route.params.orderId}</Text>

          <FlatList
            ListFooterComponent={
              <>
                <RenderInfoCustomer bookShip={bookShip}/>
                <FlatList
                  data={bookShip.staff}
                  ListHeaderComponent={<Text style={styles.ul}>Nhân viên xử lý</Text>}
                  renderItem={RenderStaff}
                  keyExtractor={(item) => item.id}
                />
              </>
            }
            ListHeaderComponent={
              <Text style={styles.ul}>Món gọi</Text>
            }
            data={bookShip.order}
            renderItem={RenderItemOrder}
            keyExtractor={(item) => item.slug}
          />
        </View>
        <View style={styles.footerOneElement}>
          <View style={styles.footer2}>
            <Text style={styles.textBold}>Tổng Tiền: </Text>
            <CurrencyFormat
              value={bookShip.total}
              displayType={'text'}
              thousandSeparator={true}
              suffix={' đ'}
              renderText={value => <Text style={styles.textBold}>{value}</Text>}
            />
          </View>
        </View>
      </>

    );
  }
}

export default ChefCompleteBookShip;
