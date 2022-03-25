import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, TextInput, Switch, SafeAreaView, Button } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Constants from 'expo-constants';

import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrencyFormat from 'react-currency-format';
import { set } from 'react-native-reanimated';


function WaiterAddOrder(props) {

  const { navigation, route } = props;
  const [food, setFood] = useState(null)
  const [drink, setDrink] = useState(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [foodCheck, setFoodCheck] = useState(true)
  const [drinkCheck, setDrinkCheck] = useState(true)
  const [foodState, setFoodState] = useState(null)
  const [drinkState, setDrinkState] = useState(null)
  const [note, setNote] = useState('')
  const [user, setUser] = useState('')
  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem('user')
      await setUser(value)
    } catch (e) {
      console.log(e)
    }
  }
  if(user === '') getUser()
  const getmenu = () => {
    axios({
      method: 'get',
      url: '/waiter/getFood',
    })
      .then(response => {
        setFood(response.data.food)
        setDrink(response.data.drink)
        setFoodState(response.data.foodState)
        setDrinkState(response.data.drinkState)
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
  useEffect(async() => {
    await getmenu()
  }, [])

  const toggleSwitchFood = (item, value, index) => {

    setFoodState(() => {
      var result = foodState
      result[index].value = value
      return result
    })
    if (value) {
      setTotal(() => {
        return total + item.price * foodState[index].quantity
      })
    }
    else {
      setTotal(() => {
        return total - item.price * foodState[index].quantity
      })
    }
    setFoodCheck(!foodCheck)

  }
  const toggleSwitchDrink = (item, value, index) => {

    setDrinkState(() => {
      var result = drinkState
      result[index].value = value
      return result
    })
    if (value) {
      setTotal(() => {
        return total + item.price * drinkState[index].quantity
      })
    }
    else {
      setTotal(() => {
        return total - item.price * drinkState[index].quantity
      })
    }
    setDrinkCheck(!drinkCheck)
  }

  const decreaseFood = (item, index) => {
    if (foodState[index].quantity > 1) {
      setFoodState(() => {
        var result = foodState
        result[index].value = true
        result[index].quantity = result[index].quantity - 1
        return result
      })
      setTotal(() => {
        return total - item.price
      })
      setFoodCheck(!foodCheck)
    }
  }

  const increaseFood = (item, index) => {
    if (foodState[index].value === false) {
      setFoodState(() => {
        var result = foodState
        result[index].value = true
        result[index].quantity = result[index].quantity + 1
        return result
      })
      setTotal(() => {
        return total + item.price * foodState[index].quantity
      })
      setFoodCheck(!foodCheck)
    }
    else {
      setFoodState(() => {
        var result = foodState
        result[index].quantity = result[index].quantity + 1
        return result
      })
      setTotal(() => {
        return total + item.price
      })
      setFoodCheck(!foodCheck)
    }
  }

  const decreaseDrink = (item, index) => {
    if (drinkState[index].quantity > 1) {
      setDrinkState(() => {
        var result = drinkState
        result[index].value = true
        result[index].quantity = result[index].quantity - 1
        return result
      })
      setTotal(() => {
        return total - item.price
      })
      setFoodCheck(!drinkCheck)
    }
  }

  const increaseDrink = (item, index) => {
    if (drinkState[index].value === false) {
      setDrinkState(() => {
        var result = drinkState
        result[index].value = true
        result[index].quantity = result[index].quantity + 1
        return result
      })
      setTotal(() => {
        return total + item.price * drinkState[index].quantity
      })
      setDrinkCheck(!drinkCheck)
    }
    else {
      setDrinkState(() => {
        var result = drinkState
        result[index].quantity = result[index].quantity + 1
        return result
      })
      setTotal(() => {
        return total + item.price
      })
      setDrinkCheck(!drinkCheck)
    }
  }

  const renderItemFood = ({ item, index }) => {
    return (
      <SafeAreaView style={styles.item}>
        <View>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: item.image
            }}
          />
        </View>
        <View style={styles.infoItem}>
          <View style={styles.groupInfo}>
            <View><Text style={{ fontWeight: "bold" }}>{item.name}</Text></View>
          </View>
          <View style={styles.groupInfo}>
            <View>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={foodState[index].value}
                onValueChange={(value) => { toggleSwitchFood(item, value, index) }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
              <TouchableOpacity style={styles.changeQuantity}
                onPress={() => {
                  decreaseFood(item, index)
                }}
              >
                <Text style={styles.textChangeQuantity}>-</Text>
              </TouchableOpacity>
              <View><Text style={{ marginLeft: 10 }}>{foodState[index].quantity}</Text></View>

              <TouchableOpacity style={styles.changeQuantity}
                onPress={() => {
                  increaseFood(item, index)
                }}
              >
                <Text style={styles.textChangeQuantity}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.groupInfo}>
            <View>
              <CurrencyFormat
                value={item.price}
                displayType={'text'}
                thousandSeparator={true}
                suffix={' đ'}
                renderText={value => <Text>{value}</Text>}
              />
            </View>
            <View>
              <CurrencyFormat
                value={item.price * foodState[index].quantity}
                displayType={'text'}
                thousandSeparator={true}
                suffix={' đ'}
                renderText={value => <Text>{value}</Text>}
              />
            </View>
          </View>
        </View>

      </SafeAreaView>
    );
  };

  const renderItemDrink = ({ item, index }) => {
    return (
      <SafeAreaView style={styles.item}>
        <View>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: item.image
            }}
          />
        </View>
        <View style={styles.infoItem}>
          <View style={styles.groupInfo}>
            <View><Text style={{ fontWeight: "bold" }}>{item.name}</Text></View>
          </View>
          <View style={styles.groupInfo}>
            <View>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={drinkState[index].value}
                onValueChange={(value) => { toggleSwitchDrink(item, value, index) }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
              <TouchableOpacity style={styles.changeQuantity}
                onPress={() => {
                  decreaseDrink(item, index)
                }}
              >
                <Text style={styles.textChangeQuantity}>-</Text>
              </TouchableOpacity>
              <View><Text style={{ marginLeft: 10 }}>{drinkState[index].quantity}</Text></View>

              <TouchableOpacity style={styles.changeQuantity}
                onPress={() => {
                  increaseDrink(item, index)
                }}
              >
                <Text style={styles.textChangeQuantity}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.groupInfo}>
            <View>
              <CurrencyFormat
                value={item.price}
                displayType={'text'}
                thousandSeparator={true}
                suffix={' đ'}
                renderText={value => <Text>{value}</Text>}
              />
            </View>
            <View>
              <CurrencyFormat
                value={item.price * drinkState[index].quantity}
                displayType={'text'}
                thousandSeparator={true}
                suffix={' đ'}
                renderText={value => <Text>{value}</Text>}
              />
            </View>
          </View>
        </View>

      </SafeAreaView>
    );
  };




  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#ff6600"
        }}>Đang tải...</Text>
      </View>

    )
  }
  else {

    return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>{route.params.nameTable}</Text>

          <FlatList
            ListFooterComponent={
              <>
                <FlatList
                  data={drink}
                  ListHeaderComponent={<Text style={styles.ul}>Danh Sách Thức Uống</Text>}
                  renderItem={renderItemDrink}
                  keyExtractor={(item) => item.slug}
                  ListFooterComponent={
                    <TextInput
                      style={{
                        backgroundColor: "#ffffff",
                        borderWidth: 1,
                        paddingLeft: 10,
                        borderRadius: 10,
                      }}
                      multiline
                      numberOfLines={4}
                      onChangeText={(text) => setNote(text)}
                      value={note}
                      placeholder="Ghi chú"
                    />
                  }
                />
              </>
            }
            ListHeaderComponent={
              <Text style={styles.ul}>Danh Sách Thức Ăn</Text>
            }
            data={food}
            renderItem={renderItemFood}
            keyExtractor={(item) => item.slug}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.footer2}>
            <Text style={styles.textBold}>Tổng Tiền: </Text>
            <CurrencyFormat
              value={total}
              displayType={'text'}
              thousandSeparator={true}
              suffix={' đ'}
              renderText={value => <Text style={styles.textBold}>{value}</Text>}
            />
          </View>
          <View>
            <TouchableOpacity style={{ backgroundColor: "#ffcc66", alignItems: "center", height: 40 }}
              onPress={() => {
                if(total > 0){
                  axios({
                    method: 'post',
                    url: '/waiter/addOrder',
                    data: {
                      food: foodState,
                      drink: drinkState,
                      total: total,
                      nameTable: route.params.nameTable,
                      slugTable: route.params.slug,
                      note: note,
                      staff: user

                    }
                  })
                    .then(response => {
                      if (response.data === "ok") navigation.navigate('HomeWaiter')
                      else alert("Đặt đơn không thành công")
                    })
                    .catch(error => {
                      console.log(error)
                    })
                }
                else {
                  alert('Vui lòng chọn ít nhất một món!')
                }
                
              }}

            >
              <Text style={[styles.textBold, { lineHeight: 40 }]}>Lập phiếu gọi món</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    color: "#ff6600",
    marginVertical: 6
  },
  ul: {
    fontSize: 18,
    color: "#ff6600",
    textAlign: "center"
  },
  tinyLogo: {
    width: 80,
    height: 80,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.9,
    marginVertical: 8,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10
  },
  groupInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.6
  },
  footer: {
    height: windowHeight * 0.1,
  },
  footer2: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 6,
    backgroundColor: "#ccffcc"
  }
  ,
  textBold: {
    fontWeight: "bold",
    fontSize: 20
  },
  textChangeQuantity: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  changeQuantity: {
    backgroundColor: "#ff6600",
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 10
  }
});

export default WaiterAddOrder;
