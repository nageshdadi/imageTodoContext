import React, {Component} from 'react';
import Home from './src/components/Home';
import Context from './src/context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface IState {
  todoList: any[];
}
export class App extends Component<IState> {
  state = {
    todoList: [],
  };

  componentDidMount() {
    this.setData();
  }
  setData = async () => {
    const data = await AsyncStorage.getItem('userDataList');
    console.log(data);
    if (data !== null) {
      console.log('hidddd');
      const finalData = JSON.parse(data);
      console.log(typeof finalData, finalData);
      this.setState({todoList: finalData});
    }
  };
  addTodoList = async (data: {id: string}) => {
    const {todoList} = this.state;
    let isValueEdit = false;
    const chekEdit = this.state.todoList.map((each: any) => {
      if (each.id === data.id) {
        isValueEdit = true;
        return data;
      }
      return each;
    });
    if (isValueEdit) {
      await AsyncStorage.setItem('userDataList', JSON.stringify(chekEdit));
      this.setState({todoList: chekEdit});
    } else {
      await AsyncStorage.setItem(
        'userDataList',
        JSON.stringify([...todoList, data]),
      );
      this.setState({todoList: [...this.state.todoList, data]});
    }
  };
  deleteTodo = async (id: string) => {
    const filteredData = this.state.todoList.filter(
      (each: any) => each.id !== id,
    );
    console.log(filteredData);
    await AsyncStorage.setItem('userDataList', JSON.stringify(filteredData));
    this.setState({todoList: filteredData});
  };
  render() {
    console.log(this.state.todoList);
    return (
      <Context.Provider
        value={{
          todoList: this.state.todoList,
          addTodoList: this.addTodoList,
          deleteTodo: this.deleteTodo,
        }}>
        <Home />
      </Context.Provider>
    );
  }
}

export default App;
