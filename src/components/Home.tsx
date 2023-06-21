import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  PermissionsAndroid,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import Context from '../context/Context';
import Icons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
interface IProps {}
interface IState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNum: string;
  isModal: boolean;
  errorMsg: string;
  editId: string;
  isEdit: boolean;
  editedUrl: string;
  photo: any;
}
export class Home extends Component<IProps, IState> {
  state = {
    firstName: '',
    lastName: '',
    isModal: false,
    email: '',
    password: '',
    mobileNum: '',
    errorMsg: '',
    isEdit: false,
    editId: '',
    photo: null,
    editedUrl: '',
  };
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        this.handleChoosePhoto();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response && !response.didCancel) {
        this.setState({photo: response.assets[0].uri});
      }
    });
  };

  render() {
    const {firstName, lastName, email, mobileNum, password, isEdit, photo} =
      this.state;
    console.log(this.state.photo);
    return (
      <Context.Consumer>
        {context => {
          const editTodo = (id: string) => {
            const editedData = context.todoList.filter(
              (each: {id: string}) => each.id === id,
            );
            const obj: {
              id: string;
              firstName: string;
              lastName: string;
              mobileNum: string;
              email: string;
              image: string;
              password: string;
            } = editedData[0];
            this.setState({
              firstName: obj.firstName,
              lastName: obj.lastName,
              email: obj.email,
              password: obj.password,
              mobileNum: obj.mobileNum,
              editId: obj.id,
              photo: obj.image,
              isEdit: true,
              isModal: true,
            });
          };
          return (
            <View style={styles.mainCobtainer}>
              <Modal visible={this.state.isModal}>
                <View style={styles.modelCrad}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        mobileNum: '',
                        errorMsg: '',
                        photo: null,
                        isEdit: false,
                        isModal: false,
                      });
                    }}>
                    <Icons name="close" size={33} />
                  </TouchableOpacity>
                  <View style={styles.inputCards}>
                    <Text style={{...styles.noTodosText, marginBottom: 20}}>
                      Add Todo
                    </Text>
                    <TextInput
                      style={styles.inputComponent}
                      placeholder="First Name"
                      value={this.state.firstName}
                      onChangeText={(newText: string) =>
                        this.setState({firstName: newText})
                      }
                    />
                    <TextInput
                      style={styles.inputComponent}
                      placeholder="Last Name"
                      value={this.state.lastName}
                      onChangeText={(newText: string) =>
                        this.setState({lastName: newText})
                      }
                    />
                    <TextInput
                      style={styles.inputComponent}
                      placeholder="Email"
                      value={this.state.email}
                      onChangeText={(newText: string) =>
                        this.setState({email: newText})
                      }
                    />
                    <TextInput
                      style={styles.inputComponent}
                      placeholder="Password"
                      value={this.state.password}
                      maxLength={8}
                      secureTextEntry
                      onChangeText={(newText: string) =>
                        this.setState({password: newText})
                      }
                    />
                    <TextInput
                      style={styles.inputComponent}
                      placeholder="Mobile Number"
                      maxLength={10}
                      keyboardType="numeric"
                      value={this.state.mobileNum}
                      onChangeText={(newText: string) =>
                        this.setState({mobileNum: newText})
                      }
                    />
                    <TouchableOpacity
                      style={styles.uploadeBtn}
                      onPress={this.requestCameraPermission}>
                      <Text>Uploade Photo</Text>
                    </TouchableOpacity>
                    {photo !== null && (
                      <Image
                        style={styles.priviewImg}
                        source={{uri: `${this.state.photo}`}}
                      />
                    )}
                    <Text style={styles.errorMsg}> {this.state.errorMsg}</Text>
                    {isEdit ? (
                      <TouchableOpacity
                        style={styles.page2Btn}
                        onPress={() => {
                          let userData: {
                            id: string;
                            firstName: string;
                            lastName: string;
                            mobileNum: string;
                            email: string;
                            image: any;
                            password: string;
                          } = {
                            id: this.state.editId,
                            firstName,
                            lastName,
                            email,
                            password,
                            mobileNum,
                            image: this.state.photo,
                          };
                          if (firstName === '') {
                            this.setState({errorMsg: 'Plese Enter First Name'});
                          } else if (lastName === '') {
                            this.setState({errorMsg: 'Plese Enter Last Name'});
                          } else if (email === '') {
                            this.setState({errorMsg: 'Plese Enter Email'});
                          } else if (password === '') {
                            this.setState({errorMsg: 'Plese Enter Password'});
                          } else if (mobileNum === '') {
                            this.setState({
                              errorMsg: 'Plese Enter Mubile Number',
                            });
                          } else if (photo === null) {
                            this.setState({
                              errorMsg: 'Plese Uploade Photo',
                            });
                          } else {
                            this.setState({
                              firstName: '',
                              lastName: '',
                              email: '',
                              password: '',
                              mobileNum: '',
                              errorMsg: '',
                              photo: null,
                              isEdit: false,
                              isModal: false,
                            });
                            context.addTodoList(userData);
                          }
                        }}>
                        <Text style={styles.gotoText}>Edit Todo</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.page2Btn}
                        onPress={() => {
                          let userData: {
                            id: string;
                            firstName: string;
                            lastName: string;
                            mobileNum: string;
                            email: string;
                            image: any;
                            password: string;
                          } = {
                            id: new Date() + '',
                            firstName,
                            lastName,
                            email,
                            password,
                            mobileNum,
                            image: this.state.photo,
                          };
                          if (firstName === '') {
                            this.setState({errorMsg: 'Plese Enter First Name'});
                          } else if (lastName === '') {
                            this.setState({errorMsg: 'Plese Enter Last Name'});
                          } else if (email === '') {
                            this.setState({errorMsg: 'Plese Enter Email'});
                          } else if (password === '') {
                            this.setState({errorMsg: 'Plese Enter Password'});
                          } else if (email.endsWith('@gmail.com') === false) {
                            this.setState({
                              errorMsg: 'Plese Enter Valid Email',
                            });
                          } else if (mobileNum === '') {
                            this.setState({
                              errorMsg: 'Plese Enter Mubile Number',
                            });
                          } else if (photo === null) {
                            this.setState({
                              errorMsg: 'Plese Uploade Photo',
                            });
                          } else {
                            this.setState({
                              firstName: '',
                              lastName: '',
                              email: '',
                              password: '',
                              mobileNum: '',
                              errorMsg: '',
                              photo: null,
                              isEdit: false,
                              isModal: false,
                            });
                            context.addTodoList(userData);
                          }
                        }}>
                        <Text style={styles.gotoText}>Save Todo</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Modal>
              <View style={styles.inputCrad}>
                <TouchableOpacity
                  style={styles.addTodoBtn}
                  onPress={() => {
                    this.setState({isModal: true});
                  }}>
                  <Text style={styles.todoAddText}>Add +</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.headText}>Todo lists</Text>
              <Text style={styles.lineText}>
                _________________________________________________
              </Text>
              {context.todoList.length === 0 && (
                <Text style={styles.noTodosText}>No Todos</Text>
              )}
              <FlatList
                data={context.todoList}
                renderItem={({
                  item,
                }: {
                  item: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    mobileNum: string;
                    email: string;
                    image: string;
                  };
                }) => (
                  <View style={styles.todoItemCard}>
                    <View style={styles.profileCard}>
                      <Image
                        style={styles.priviewImg}
                        source={{uri: `${item.image}`}}
                      />
                      <View>
                        <Text style={styles.textItemTodo}>
                          Name: {item.firstName} {item.lastName}
                        </Text>
                        <Text style={styles.textItemTodo}>
                          Email: {item.email}
                        </Text>
                        <Text style={styles.textItemTodo}>
                          Number: {item.mobileNum}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.lineText}>
                      ______________________________________________
                    </Text>
                    <View style={styles.editBtnCard}>
                      <TouchableOpacity onPress={() => editTodo(item.id)}>
                        <MaterialIcons name="edit" size={30} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => context.deleteTodo(item.id)}>
                        <MaterialIcons name="delete" size={30} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          );
        }}
      </Context.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  mainCobtainer: {
    flex: 1,
    padding: 20,
  },
  headText: {
    fontSize: 25,
    marginBottom: 10,
  },
  inputCrad: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputComponent: {
    borderColor: '#000',
    borderWidth: 1,
    width: 300,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 15,
  },
  addTodoBtn: {
    backgroundColor: '#0f4fb8',
    marginLeft: 10,
    height: 40,
    padding: 5,
    borderRadius: 10,
    width: 90,
    alignItems: 'center',
  },
  todoAddText: {
    fontSize: 20,
    color: '#fff',
  },
  todoItemCard: {
    padding: 10,
    backgroundColor: '#f0dfa3',
    borderRadius: 10,
    marginBottom: 10,
  },
  profileCard: {
    flexDirection: 'row',
  },
  textItemTodo: {
    fontSize: 15,
    fontWeight: '500',
    width: 200,
    marginTop: 7,
  },
  textItemNameTodo: {
    fontSize: 15,
    fontWeight: '500',
  },
  editBtnCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  page2Btn: {
    backgroundColor: '#0d3bd4',
    height: 50,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
  },
  gotoText: {
    fontSize: 20,
    color: '#fff',
  },
  noTodosText: {
    fontSize: 30,
    alignSelf: 'center',
    marginTop: 50,
  },
  lineText: {
    marginBottom: 15,
  },
  modelCrad: {
    padding: 20,
  },
  inputCards: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  priviewImg: {
    height: 100,
    width: 100,
    borderRadius: 70,
    marginRight: 15,
  },
  uploadeBtn: {
    backgroundColor: '#bdb7a8',
    height: 40,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
  },
  errorMsg: {
    color: '#f54d27',
  },
});

export default Home;
