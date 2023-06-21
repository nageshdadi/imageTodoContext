/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
const Context = React.createContext({
  todoList: [],
  addTodoList: (data: {
    id: string;
    firstName: string;
    lastName: string;
    mobileNum: string;
    email: string;
    image: string;
    password: string;
  }) => {},
  deleteTodo: (id: string) => {},
});

export default Context;
